const fs = require('fs');
const domains = ['Computer Vision', 'Artificial Intelligence', 'Machine Learning', 'Data Science', 'Cyber Security', 'IoT', 'Robotics', 'Agriculture Technology', 'Health Science', 'Microbiology'];
const firstNames = ['Sarah', 'Rahim', 'Nafisa', 'Arif', 'Tahmina', 'Kamrul', 'Sumaiya', 'Fahim', 'Nusrat', 'Tariq', 'Sadia', 'Imran', 'Farzana', 'Hasan', 'Ayesha', 'Mehedi', 'Jannat', 'Sabbir', 'Mahiya', 'Riyad'];
const lastNames = ['Ahmed', 'Hasan', 'Islam', 'Rahman', 'Akter', 'Uddin', 'Khan', 'Chowdhury', 'Hossain', 'Khatun'];

const collaborators = [];
let idCounter = 1;

for (const domain of domains) {
  for (let i = 0; i < 10; i++) {
    const fname = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lname = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = fname + ' ' + lname;
    const emailPrefix = fname.toLowerCase() + '.' + domain.split(' ')[0].toLowerCase();
    
    collaborators.push({
      id: `241-15-${idCounter.toString().padStart(3, '0')}`,
      name: name,
      department: 'CSE',
      batch: '15th',
      role: 'Student',
      primaryDomain: domain,
      skills: [domain, 'Python', 'Research'],
      researchInterests: [domain, 'Innovation'],
      collaborationAvailability: 'High',
      phone: '+8801' + Math.floor(100000000 + Math.random() * 900000000),
      email: `${emailPrefix}@eduvision.edu`
    });
    idCounter++;
  }
}

fs.writeFileSync('data/collaborators.json', JSON.stringify(collaborators, null, 2));
console.log('Created data/collaborators.json with ' + collaborators.length + ' profiles.');
