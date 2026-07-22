const fs = require('fs');

let content = fs.readFileSync('data/academicData.ts', 'utf8');

content = content.replace(/quiz:\s*(\d+)/g, (match, p1) => {
  const num = parseInt(p1, 10);
  const outOf15 = Math.round((num / 100) * 15);
  return `quiz: ${outOf15}`;
});

fs.writeFileSync('data/academicData.ts', content);

console.log("Quiz marks updated to be out of 15.");
