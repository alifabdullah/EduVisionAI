const fs = require('fs');
const path = require('path');

const files = [
  'data/academicData.ts',
  'data/student.json',
  'app/login/student/page.tsx',
  'app/dashboard/teacher/page.tsx',
  'components/academic/StudentLookup.tsx',
  'components/academic/ProjectShowcase.tsx',
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Name replacements
    content = content.replace(/Aryan Hossain/g, 'Joy kumar Yuv');
    content = content.replace(/Aryan/g, 'Joy');
    content = content.replace(/ARYAN/g, 'JOY');
    content = content.replace(/aryan/g, 'joy');
    
    // ID and Roll replacements
    content = content.replace(/STU-2024-001/g, '261-16-010');
    content = content.replace(/261-16-001/g, '261-16-010');
    content = content.replace(/CS21042/g, 'CIS16010');
    content = content.replace(/CSE-21-042/g, 'CIS-16-010');
    
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file}`);
  }
});
