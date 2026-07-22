const fs = require('fs');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/Aryan Hossain/g, 'Joy kumar Yuv');
  content = content.replace(/Aryan/g, 'Joy');
  content = content.replace(/CS21042/g, 'CIS16010');
  content = content.replace(/CSE-21-042/g, 'CIS-16-010');
  fs.writeFileSync(filePath, content);
}

replaceInFile('d:/EduVision-AI/app/dashboard/teacher/page.tsx');
replaceInFile('d:/EduVision-AI/components/academic/StudentLookup.tsx');
replaceInFile('d:/EduVision-AI/data/academicData.ts');

console.log("Replacements done.");
