// utils/webSearch.ts
// Keyless, free, high-performance web search utility using DuckDuckGo HTML Lite.
// Runs server-side only.

import https from 'https';

export interface SearchResult {
  title: string;
  snippet: string;
  url: string;
}

export function performWebSearch(query: string): Promise<SearchResult[]> {
  return new Promise((resolve) => {
    // Limit query length for safety
    const safeQuery = query.slice(0, 100);
    const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(safeQuery)}`;
    
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      timeout: 6000 // 6 second timeout
    };

    const req = https.get(url, options, (res) => {
      let html = '';
      res.on('data', (chunk) => {
        html += chunk;
      });

      res.on('end', () => {
        try {
          const results: SearchResult[] = [];
          
          // Regex to match search result blocks on html.duckduckgo.com
          // Each result is contained in a <div class="result results_links results_links_deep web-result "> or similar
          const resultBlockRegex = /<div class="result results_links results_links_deep[^"]*">([\s\S]*?)<\/div>\s*<\/div>/g;
          
          let blockMatch;
          while ((blockMatch = resultBlockRegex.exec(html)) !== null && results.length < 3) {
            const blockHtml = blockMatch[1];
            
            // Extract URL and Title
            // <a class="result__a" href="[URL]">[TITLE]</a>
            const titleLinkMatch = blockHtml.match(/<a class="result__a" href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/);
            
            // Extract Snippet
            // <a class="result__snippet" href="...">[SNIPPET]</a>
            const snippetMatch = blockHtml.match(/<a class="result__snippet"[^>]*>([\s\S]*?)<\/a>/);
            
            if (titleLinkMatch && snippetMatch) {
              const rawUrl = titleLinkMatch[1];
              const title = titleLinkMatch[2].replace(/<[^>]*>/g, '').trim();
              const snippet = snippetMatch[1].replace(/<[^>]*>/g, '').trim();
              
              // Clean up DuckDuckGo redirect URLs if present
              let cleanUrl = rawUrl;
              if (rawUrl.includes('uddg=')) {
                const match = rawUrl.match(/uddg=([^&]+)/);
                if (match) {
                  cleanUrl = decodeURIComponent(match[1]);
                }
              }

              results.push({
                title: htmlDecode(title),
                snippet: htmlDecode(snippet),
                url: cleanUrl
              });
            }
          }

          // If regex parsing yielded no results, fallback to a simpler general snippet match
          if (results.length === 0) {
            const generalSnippetRegex = /<a class="result__snippet"[^>]*>([\s\S]*?)<\/a>/g;
            let snippetMatch;
            const fallbackSnippets: string[] = [];
            while ((snippetMatch = generalSnippetRegex.exec(html)) !== null && fallbackSnippets.length < 3) {
              fallbackSnippets.push(snippetMatch[1].replace(/<[^>]*>/g, '').trim());
            }

            const fallbackResults = fallbackSnippets.map((snippet, idx) => ({
              title: `Search Result ${idx + 1}`,
              snippet: htmlDecode(snippet),
              url: 'https://duckduckgo.com'
            }));

            resolve(fallbackResults);
            return;
          }

          resolve(results);
        } catch (err) {
          console.error('[Web Search Parse Error]', err);
          resolve([]);
        }
      });
    });

    req.on('error', (err) => {
      console.error('[Web Search Network Error]', err);
      resolve([]);
    });

    req.on('timeout', () => {
      req.destroy();
      console.warn('[Web Search Timeout] Request aborted.');
      resolve([]);
    });
  });
}

function htmlDecode(input: string): string {
  return input
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/&#39;/g, "'");
}
