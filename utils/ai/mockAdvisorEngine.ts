import studentData from '@/data/student.json';
import collaboratorsData from '@/data/collaborators.json';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  actionCard?: {
    type: string;
    title: string;
    description: string;
    actionText: string;
    actionId: string;
  };
  mentorCard?: {
    id: string;
    name: string;
    department: string;
    expertise: string[];
    rating: number;
    availability: string;
    reason: string;
  };
}

// Session State determined from conversation history
interface SessionState {
  currentTopic: 'general' | 'weak_subjects' | 'gpa_improvement' | 'attendance' | 'mentorship' | 'research' | 'study_plan' | 'skills' | 'diu_info' | 'emotional' | 'partner_matching';
  step: number; // For multi-step questions
  pendingAction?: string;
  lastAskedQuestion?: string;
}

// Helpers for dynamic responses
function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Detect language of the input
function detectLanguage(query: string): 'bangla' | 'banglish' | 'english' {
  const banglaRegex = /[\u0980-\u09FF]/;
  if (banglaRegex.test(query)) return 'bangla';
  
  const banglishKeywords = [
    'amar', 'kemon', 'ki', 'kora', 'uchit', 'hobe', 'kori', 'kon', 'ajke', 'bhalo',
    'porbo', 'dhonnobad', 'amake', 'bolen', 'shathe', 'kotha', 'pore', 'chaichilam',
    'ache', 'karon', 'korte', 'bepare', 'shomporke', 'tumi', 'apni', 'naki', 'ekta',
    'amr', 'kamne', 'korbo'
  ];
  const words = query.split(/\s+/);
  const matchCount = words.filter(w => banglishKeywords.includes(w)).length;
  if (matchCount >= 2 || (matchCount >= 1 && words.length <= 5)) return 'banglish';
  
  return 'english';
}

// Infer session state by scanning the recent message history
function analyzeSessionState(history: ChatMessage[]): SessionState {
  const state: SessionState = { currentTopic: 'general', step: 0 };
  if (history.length <= 1) return state;

  // Search backward for context clues
  for (let i = history.length - 1; i >= 0; i--) {
    const msg = history[i];
    const text = msg.content.toLowerCase();

    if (msg.role === 'assistant') {
      if (text.includes('guidance chaccho') || text.includes('supervisor') || text.includes('mentor') || text.includes('support খুঁজছেন')) {
        state.currentTopic = 'mentorship';
        if (i === history.length - 2) {
          state.step = 1;
        }
        break;
      }
      if (text.includes('study plan') || text.includes('স্টাডি প্ল্যান') || text.includes('roadmap')) {
        state.currentTopic = 'study_plan';
        break;
      }
      if (text.includes('skill') || text.includes('radar') || text.includes('communication') || text.includes('leadership')) {
        state.currentTopic = 'skills';
        break;
      }
    }
  }

  return state;
}

export function getMockAdvisorResponse(message: string, history: ChatMessage[]): {
  response: string;
  actionCard?: ChatMessage['actionCard'];
  mentorCard?: ChatMessage['mentorCard'];
} {
  const query = message.toLowerCase().trim();
  const lang = detectLanguage(query);
  const session = analyzeSessionState(history);
  
  const studentName = studentData.profile.name.split(' ')[0]; // "Joy"
  const cgpa = studentData.profile.cgpa.toFixed(2);
  const attendanceAvg = studentData.academicSummary.attendanceAvg;
  
  // NEW: RESEARCH PARTNER MATCHING LOGIC
  let partnerMatchingText = '';
  const isPartnerQuery = query.includes('partner') || query.includes('collaborator') || query.includes('teammate') || query.includes('researcher');
  
  if (isPartnerQuery) {
    const domains = ['computer vision', 'artificial intelligence', 'machine learning', 'data science', 'cyber security', 'iot', 'robotics', 'agriculture technology', 'health science', 'microbiology'];
    
    let matchedDomain = domains.find(d => query.includes(d));
    if (!matchedDomain) {
      if (query.includes('cv') || query.includes('computer vision')) matchedDomain = 'computer vision';
      else if (query.includes(' ai ') || query.endsWith(' ai') || query.includes('ai researcher')) matchedDomain = 'artificial intelligence';
      else if (query.includes('ml')) matchedDomain = 'machine learning';
      else if (query.includes('ds')) matchedDomain = 'data science';
    }

    if (matchedDomain) {
      // Extract number of collaborators (1-10)
      let numToFind = 1;
      const numMatch = query.match(/\b(10|[1-9]|one|two|three|four|five|six|seven|eight|nine|ten)\b/);
      if (numMatch) {
        const numStr = numMatch[1];
        const numMap: Record<string, number> = {
          'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
          'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10
        };
        numToFind = parseInt(numStr) || numMap[numStr] || 1;
      }
      
      const exactDomain = matchedDomain === 'iot' ? 'IoT' : matchedDomain.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      const availablePartners = (collaboratorsData as any[]).filter(c => c.primaryDomain.toLowerCase() === matchedDomain);
      const selected = availablePartners.sort(() => 0.5 - Math.random()).slice(0, numToFind);
      
      if (selected.length > 0) {
        let text = `I found ${selected.length} collaborator${selected.length > 1 ? 's' : ''} who are interested in ${exactDomain}.\n\n`;
        selected.forEach((c, idx) => {
          text += `${idx + 1}. ${c.name}\nID: ${c.id}\nPhone: ${c.phone}\nEmail: ${c.email}\n\n`;
        });
        partnerMatchingText = text.trim();
      }
    }
  }

  // Utility to combine responses
  const withPartnerText = (res: string) => {
    return partnerMatchingText ? `${res}\n\n---\n\n${partnerMatchingText}` : res;
  };
  
  // Available Mentors Mock Database
  const mentors = [
    {
      id: 'TCH-003',
      name: 'Tamanna Akter',
      department: 'CIS',
      expertise: ['Database Systems', 'Algorithms', 'Data Mining'],
      rating: 4.8,
      availability: 'Sun, Tue, Thu 2–5 PM',
      reason: 'She is your academic mentor and is currently supervising your EduVision project.'
    },
    {
      id: 'TCH-007',
      name: 'Prof. Arif Hossain',
      department: 'CSE',
      expertise: ['Machine Learning', 'Deep Learning', 'Research Methodology'],
      rating: 4.9,
      availability: 'Mon, Wed 10 AM–1 PM',
      reason: 'Highly recommended for machine learning research guidance and review of your IEEE paper.'
    },
    {
      id: 'TCH-012',
      name: 'Dr. Nasrin Akter',
      department: 'CSE',
      expertise: ['Software Engineering', 'System Design', 'Project Mentoring'],
      rating: 4.7,
      availability: 'Sun, Mon 1–3 PM',
      reason: 'Excellent match for project guidance and verification of your Smart Library system.'
    }
  ];

  // 1. GENERAL DIU / UNIVERSITY INFORMATION INTENT
  if (query.includes('daffodil') || query.includes('diu') || query.includes('university') || query.includes('ashulia') || query.includes('varsity')) {
    if (lang === 'bangla') {
      return {
        response: withPartnerText(`ড্যাফোডিল ইন্টারন্যাশনাল ইউনিভার্সিটি (DIU) বাংলাদেশের অন্যতম জনপ্রিয় একটি বেসরকারি বিশ্ববিদ্যালয়, যা বিশেষ করে টেকনোলজি, ইনোভেশন ও ক্যারিয়ার-ফোকাসড কারিকুলামের জন্য পরিচিত। আশুলিয়ার গ্রিন ক্যাম্পাসটি পড়াশোনার জন্য দারুণ এক পরিবেশ তৈরি করেছে।\n\nআপনি কি ডিইউ-এর কোনো ডিপার্টমেন্ট, আপনার নিজস্ব কোর্স কারিকুলাম, নাকি কোনো ক্লাব অ্যাক্টিভিটি সম্পর্কে জানতে চাচ্ছেন?`)
      };
    } else if (lang === 'banglish') {
      return {
        response: withPartnerText(`Daffodil International University (DIU) technology, research, and coding ecosystem er jonno khub-i popular. Oader Ashulia green campus e shob custom labs ebong facilities royeche.\n\nTumi ki general academic rules, clubs, departments, naki research resources niye specific details jante chao?`)
      };
    } else {
      return {
        response: withPartnerText(`Daffodil International University is a private university in Bangladesh known for technology, innovation, entrepreneurship, and academic programs. Are you asking about DIU in general, your department, research opportunities, or academic support?`)
      };
    }
  }

  // 2. EMOTIONAL / CONFUSED STUDENT SUPPORT INTENT
  if (query.includes('stress') || query.includes('depress') || query.includes('tension') || query.includes('chinta') || query.includes('bhoy') || query.includes('parbona') || query.includes('worried') || query.includes('scared') || query.includes('sad') || query.includes('frustrat')) {
    if (lang === 'bangla') {
      return {
        response: withPartnerText(`আমি বুঝতে পারছি, পড়াশোনার চাপ মাঝে মাঝে অনেক বেশি মনে হতে পারে। CGPA বা সাবজেক্টে কম মার্কস দেখে ঘাবড়ে যাওয়াটা স্বাভাবিক, কিন্তু মনে রাখবেন এটা ঠিক করা সম্ভব। আপনি একা নন, আমি আপনাকে প্রতিটি পদক্ষেপে সাহায্য করব।\n\nচলুন আমরা বড় সিলেবাসটিকে ছোট ছোট ভাগে ভাগ করে ফেলি এবং Tamanna Akter-এর সাথে একটি পরামর্শ সভা বুক করি যাতে উনি সহজ সমাধান দিতে পারেন। কি বলেন?`),
        mentorCard: mentors[0]
      };
    } else if (lang === 'banglish') {
      return {
        response: withPartnerText(`Chinta koro na, exam er pressure e emon feel kora khub-i normal. Database ba Data Structures e grade niye ektu backfoot e thakleo planning thakle easily recover kora jay.\n\nAmi bolbo shob chinta baad diye regular dynamic routines follow koro. Tamanna Akter (tomar mentor) er shathe ektu kotha bolbe? Uni khub helpful.`)
      };
    } else {
      return {
        response: withPartnerText(`I completely understand that semester workloads and grades can feel overwhelming at times. It is completely normal to feel stressed, but please remember that we can turn this around together.\n\nLet's break down the syllabus into manageable tasks and schedule a small friendly chat with Tamanna Akter to get her advice. Would you like to schedule a slot?`),
        mentorCard: mentors[0]
      };
    }
  }

  // 3. MULTI-STEP MENTOR/SUPERVISOR FLOW
  if (session.currentTopic === 'mentorship' && session.step === 1) {
    const isResearch = query.includes('research') || query.includes('thesis') || query.includes('paper') || query.includes('gobeshona') || query.includes('1');
    const isProject = query.includes('project') || query.includes('app') || query.includes('web') || query.includes('dev') || query.includes('3');
    const isAcademic = query.includes('academic') || query.includes('study') || query.includes('grade') || query.includes('marks') || query.includes('fail') || query.includes('recovery') || query.includes('2');

    if (isResearch) {
      if (lang === 'bangla') {
        return {
          response: `রিসার্চ ও থিসিস গাইডেন্সের জন্য **Prof. Arif Hossain** আপনার জন্য সবচেয়ে উপযুক্ত মেন্টর হতে পারেন। তিনি মেশিন লার্নিং ও রিসার্চ মেথডোলজি নিয়ে কাজ করেন।\n\nযেহেতু আপনার "Deep Learning-Based Early Detection of Student Academic Risk" পেপারটি বর্তমানে আন্ডার-রিভিউ অবস্থায় আছে, উনি এটি রিভিশন ও পাবলিকেশনে সরাসরি গাইড করতে পারবেন। ওনার সাথে কি কথা বলতে চান?`,
          mentorCard: mentors[1],
          actionCard: {
            type: 'mentor',
            title: 'Schedule Session with Prof. Arif Hossain',
            description: 'Discuss research scope, methodologies, and thesis publication paths.',
            actionText: 'Schedule with Prof. Arif',
            actionId: 'SCHEDULE_SESSION'
          }
        };
      } else if (lang === 'banglish') {
        return {
          response: `Research and publications area r jonno **Prof. Arif Hossain** (Machine Learning expert) tomar jonno best advisor hobe. Tomar current IEEE paper "Deep Learning-Based Early Detection of Student Academic Risk" niye uni valuable inputs dite parben.\n\nShall we schedule a friendly talk with Prof. Arif Hossain?`,
          mentorCard: mentors[1],
          actionCard: {
            type: 'mentor',
            title: 'Schedule Research Session',
            description: 'Review academic papers and ML model optimization strategies.',
            actionText: 'Schedule with Prof. Arif',
            actionId: 'SCHEDULE_SESSION'
          }
        };
      } else {
        return {
          response: `For research and thesis publications, I highly recommend matching with **Prof. Arif Hossain**. He is an expert in Machine Learning and Research Methodology.\n\nHe can offer specific guidance for your pending paper *"Deep Learning-Based Early Detection of Student Academic Risk"*. Would you like to schedule a session with him?`,
          mentorCard: mentors[1],
          actionCard: {
            type: 'mentor',
            title: 'Schedule Session with Prof. Arif Hossain',
            description: 'Discuss research scope, methodologies, and thesis publication paths.',
            actionText: 'Request Meeting',
            actionId: 'SCHEDULE_SESSION'
          }
        };
      }
    }

    if (isProject) {
      if (lang === 'bangla') {
        return {
          response: `সফ্টওয়্যার প্রজেক্ট ও ডেভেলপমেন্টের জন্য **Dr. Nasrin Akter** আপনার জন্য খুব ভালো মেন্টর হবেন। তিনি সিস্টেম ডিজাইন ও সফটওয়্যার আর্কিটেকচার নিয়ে মেন্টরিং করেন।\n\nআপনার "Smart Library Management System" প্রজেক্টের সুপারভাইজার ভেরিফিকেশনে তিনি গুরুত্বপূর্ণ ফিডব্যাক দিতে পারবেন। ওনার সাথে কানেক্ট করব?`,
          mentorCard: mentors[2],
          actionCard: {
            type: 'mentor',
            title: 'Schedule Session with Dr. Nasrin Akter',
            description: 'Discuss system design, software architectures and project approvals.',
            actionText: 'Schedule with Dr. Nasrin',
            actionId: 'SCHEDULE_SESSION'
          }
        };
      } else if (lang === 'banglish') {
        return {
          response: `Project development logic review and architecture boost up er jonno **Dr. Nasrin Akter** optimal match hobe. Tomar "Smart Library Management System" implementation verify korte uni helpful guide line diben.\n\nShall we schedule a counselling slot with her?`,
          mentorCard: mentors[2],
          actionCard: {
            type: 'mentor',
            title: 'Schedule Session with Dr. Nasrin Akter',
            description: 'Discuss system design, software architectures and project approvals.',
            actionText: 'Schedule Session',
            actionId: 'SCHEDULE_SESSION'
          }
        };
      } else {
        return {
          response: `For software systems, applications, and general project building, **Dr. Nasrin Akter** is highly recommended. She specializes in System Design and software architectures.\n\nShe can help you finalize and verify your "Smart Library Management System". Shall we set up a session with Dr. Nasrin?`,
          mentorCard: mentors[2],
          actionCard: {
            type: 'mentor',
            title: 'Schedule Session with Dr. Nasrin Akter',
            description: 'Discuss system design, software architectures and project approvals.',
            actionText: 'Request Session',
            actionId: 'SCHEDULE_SESSION'
          }
        };
      }
    }

    // Default academic or fallback to mentor
    if (lang === 'bangla') {
      return {
        response: withPartnerText(`একাডেমিক ইম্প্রুভমেন্ট এবং ডাটাবেজ সিস্টেমস কোর্সের জন্য **Tamanna Akter** সবচেয়ে উপযুক্ত। আপনার ডাটাবেজে মার্কস ৪৮% ও উপস্থিতি ৬২%, তাই ওনার সাথে দ্রুত কথা বলা প্রয়োজন।`),
        mentorCard: mentors[0]
      };
    } else if (lang === 'banglish') {
      return {
        response: withPartnerText(`Academic recovery and course progress improvement er jonno **Tamanna Akter** primary advisor. Database Systems e marks 48% and attendance 62% thakay omar help ekhon directly proyojon.`),
        mentorCard: mentors[0]
      };
    } else {
      return {
        response: withPartnerText(`For general academic recovery, **Tamanna Akter** is the best match. Since Database Systems is at 48% and attendance at 62%, booking a session with her will help you get back on track.`),
        mentorCard: mentors[0]
      };
    }
  }

  // Detect general mentorship/supervisor intent
  if (query.includes('mentor') || query.includes('supervisor') || query.includes('teacher') || query.includes('shikkhok') || query.includes('poramorsho')) {
    if (lang === 'bangla') {
      return {
        response: withPartnerText(`আপনার সাথে মেন্টর ম্যাচ করতে আমার সুবিধা হবে যদি আপনি বলেন কোন ক্ষেত্রে আপনার বেশি গাইডেন্স দরকার:\n\n১. **রিসার্চ এবং থিসিস** গাইডেন্স\n২. **একাডেমিক রিকভারি** (যেমন Database বা Data Structures এ পড়াশোনার স্ট্র্যাটেজি)\n৩. **প্রজেক্ট আর্কিটেকচার** ও ভেরিফিকেশন\n\nআপনি কোন এরিয়াতে সাহায্য খুঁজছেন?`)
      };
    } else if (lang === 'banglish') {
      return {
        response: withPartnerText(`Mentor match korar age bolo, tumi mainly kon direct supporting chao? \n\n1. **Research & Publication** (IEEE paper guidance)\n2. **Academic Recovery** (Database & Data Structures grade boost)\n3. **Project Guidance** (App building & verification details)\n\nTomar choice ta bolo, tahole specific suggest korbo.`)
      };
    } else {
      return {
        response: withPartnerText(`To recommend the best faculty advisor, please tell me what kind of support you need most right now:\n\n1. **Research & Publications** (Thesis review and submission advice)\n2. **Academic Recovery** (Improving performance in Database or Data Structures)\n3. **Project Development** (Technical guidance and architecture)\n\nWhich of these matches your focus?`)
      };
    }
  }

  // 4. STUDY PLAN / GPA IMPROVEMENT INTENT
  if (query.includes('study plan') || query.includes('gpa') || query.includes('cgpa') || query.includes('plan') || query.includes('porashona') || query.includes('routine')) {
    const dbMarks = 48;
    const dsMarks = 55;
    
    const introBangla = [
      `আপনার বর্তমান CGPA **${cgpa}**। এটিকে ৩.৫০+ এ নিতে হলে Database Systems (৪৮%) এবং Data Structures (৫৫%) এ গ্রেড বাড়াতে হবে।\n\nএখানে ৭-দিনের একটি স্টাডি রুটিন রেডি করেছি:\n`,
      `চলুন আপনার পড়াশোনা ও গ্রেড বুস্ট করার জন্য একটি প্ল্যান সাজাই। Database Systems এ মার্কস ৪৮% ও উপস্থিতি ৬২% হওয়ায় এটিকে একটু বেশি গুরুত্ব দেওয়া প্রয়োজন।\n\nএখানে ৭-দিনের প্ল্যানটি দেওয়া হলো:\n`
    ];

    const introBanglish = [
      `Tomar current CGPA holo **${cgpa}**. Target 3.50 cross korte hole Database Systems (48%) and Data Structures (55%) er upgrade kora proyojon.\n\n7-day academic plan details:\n`,
      `Database Systems class attendance currently 62% and score 48% thakay immediate priority shuru korte hobe.\n\n7-day study routine plan:\n`
    ];

    const introEnglish = [
      `To improve your overall CGPA from **${cgpa}**, we must target Database Systems (${dbMarks}%) and Data Structures (${dsMarks}%).\n\nHere is your personalized 7-Day study outline:\n`,
      `Your current average attendance is ${attendanceAvg}%, but Database Systems is critical at 62%. Let's secure both attendance and final topics.\n\nCheck out this 7-Day action plan:\n`
    ];

    const planDetailsBangla = 
      `*   **দিন ১-২:** Database Normalization (1NF to BCNF) প্র্যাকটিস করুন।\n` +
      `*   **দিন ৩-৪:** Data Structures এ Binary Search Tree এবং AVL Tree এর ইনসারশন প্র্যাকটিস করুন।\n` +
      `*   **দিন ৫:** SQL Joins এবং Subqueries এর জটিল কুয়েরি রান করুন।\n` +
      `*   **দিন ৬:** Tamanna Akter এর সাথে দেখা করে কঠিন টপিকগুলো আলোচনা করুন।\n` +
      `*   **দিন ৭:** সেলফ-টেস্ট বা মক কুইজে অংশ নিন।\n\nরুটিন অনুযায়ী কাজ করতে স্টাডি প্ল্যানটি একটিভ করতে চান?`;

    const planDetailsBanglish = 
      `*   **Day 1-2:** Database Normalization & Functional Dependency basic constraints practice koro.\n` +
      `*   **Day 3-4:** Data Structures er Tree traversals (Inorder, Preorder, Postorder) complete koro.\n` +
      `*   **Day 5:** SQL queries (group by, joins) analyze kore solve koro.\n` +
      `*   **Day 6:** Consult Tamanna Akter to verify database concepts during counseling hours.\n` +
      `*   **Day 7:** Give a quick mock test on weak topics.\n\nStudy plan active korte chao?`;

    const planDetailsEnglish = 
      `*   **Day 1-2:** Solve 15 database normalization dependency problems.\n` +
      `*   **Day 3-4:** Re-implement BST insertion, deletion and tree traversal algorithms.\n` +
      `*   **Day 5:** Perform SQL Join practices on database schemas.\n` +
      `*   **Day 6:** Meet with your course instructor to clarify hard concepts.\n` +
      `*   **Day 7:** Conduct a self-assessment on the weak course syllabus.\n\nWould you like to activate this study roadmap inside your dashboard?`;

    if (lang === 'bangla') {
      return {
        response: withPartnerText(pickRandom(introBangla) + planDetailsBangla),
        actionCard: {
          type: 'academic',
          title: 'Activate 7-Day Study Plan',
          description: 'Tracks daily tasks and alerts you on Database Systems and Data Structures revisions.',
          actionText: 'Activate Now',
          actionId: 'ACTIVATE_STUDY_PLAN'
        }
      };
    } else if (lang === 'banglish') {
      return {
        response: withPartnerText(pickRandom(introBanglish) + planDetailsBanglish),
        actionCard: {
          type: 'academic',
          title: 'Activate 7-Day Study Plan',
          description: 'Tracks daily tasks and alerts you on Database Systems and Data Structures revisions.',
          actionText: 'Activate Plan',
          actionId: 'ACTIVATE_STUDY_PLAN'
        }
      };
    } else {
      return {
        response: withPartnerText(pickRandom(introEnglish) + planDetailsEnglish),
        actionCard: {
          type: 'academic',
          title: 'Activate 7-Day Study Plan',
          description: 'Tracks daily tasks and alerts you on Database Systems and Data Structures revisions.',
          actionText: 'Activate Plan',
          actionId: 'ACTIVATE_STUDY_PLAN'
        }
      };
    }
  }

  // 5. WEAK SUBJECTS FOCUS INTENT
  if (query.includes('subject') || query.includes('course') || query.includes('focus') || query.includes('weak') || query.includes('porbo') || query.includes('kharap') || query.includes('mark') || query.includes('worried')) {
    if (lang === 'bangla') {
      return {
        response: withPartnerText(`আপনার বর্তমান প্রোফাইল দেখে মনে হচ্ছে **Database Systems (CSE303)** আগে ফোকাস করা উচিত। এই সাবজেক্টে মার্কস ৪৮% এবং উপস্থিতি ৬২%, তাই এটি এখন রিস্ক জোনে আছে।\n\nদ্বিতীয় ঝুঁকিপূর্ণ বিষয় হলো **Data Structures (CSE301)** যেখানে আপনার মার্কস ৫৫%।\n\nআপনি কি ডাটাবেজের প্র্যাকটিস রিসোর্স দেখতে চান?`),
        mentorCard: mentors[0],
        actionCard: {
          type: 'academic',
          title: 'Open Database Practice Resources',
          description: 'Get free access to curated notes, normalization solvers, and previous exam questions.',
          actionText: 'Open Resources',
          actionId: 'OPEN_LIBRARY'
        }
      };
    } else if (lang === 'banglish') {
      return {
        response: withPartnerText(`Tomar current profile dekhe mone hocche **Database Systems** age focus kora uchit. Ei subject e marks 48% and attendance 62%, tai eta akhon risk zone e ache.\n\nData Structures-o list e ache primary items e score 55% er jonno. Ami database materials link open korte pari. Start korbe?`),
        mentorCard: mentors[0],
        actionCard: {
          type: 'academic',
          title: 'Open Database Practice Resources',
          description: 'Get free access to curated notes, normalization solvers, and previous exam questions.',
          actionText: 'Open Resources',
          actionId: 'OPEN_LIBRARY'
        }
      };
    } else {
      return {
        response: withPartnerText(`Looking at your academic metrics, **Database Systems (CSE303)** requires immediate attention. It stands at **48% marks** and **62% class attendance**.\n\nYour next primary concern is **Data Structures (CSE301)** at **55% marks**. Would you like to review relevant Database study materials?`),
        mentorCard: mentors[0],
        actionCard: {
          type: 'academic',
          title: 'Access Learning Resources',
          description: 'View digital library, reference materials, and dynamic algorithm visualization solvers.',
          actionText: 'Open Library',
          actionId: 'OPEN_LIBRARY'
        }
      };
    }
  }

  // 6. RESEARCH INQUIRY
  if (query.includes('research') || query.includes('thesis') || query.includes('paper') || query.includes('gobeshona')) {
    if (lang === 'bangla') {
      return {
        response: withPartnerText(`রিসার্চ ও থিসিসে আপনার ভালো করার সম্ভাবনা রয়েছে। আপনি বর্তমানে জনাব মোঃ সারোয়ার হোসেন মোল্লাের অধীনে *"Deep Learning-Based Early Detection of Student Academic Risk"* নিয়ে কাজ করছেন এবং এটি *IEEE Transactions on Learning Technologies* এ রিভিউতে আছে।\n\nতবে প্রতিযোগিতামূলক পাবলিকেশনের ক্ষেত্রে CGPA ৩.৫০+ হওয়া একটি ভালো স্ট্যান্ডার্ড। তাই বর্তমান সেমিস্টারের কোর কোর্সগুলোতে ফোকাস করা দরকার। রিসার্চ মাইলস্টোন ট্র্যাক করতে চান?`),
        actionCard: {
          type: 'research',
          title: 'Open Research Publication Roadmap',
          description: 'Track publication stages, manuscript edits, and IEEE reviewer feedback deadlines.',
          actionText: 'Open Roadmap',
          actionId: 'RESEARCH_ROADMAP'
        }
      };
    } else if (lang === 'banglish') {
      return {
        response: withPartnerText(`Tomar active paper *"Deep Learning-Based Early Detection of Student Academic Risk"* standard validation system e 'Under Review' level e ase. Supervision under Mr. Md. Sarwar Hossain Mollah.\n\nTechnical details strong, but CGPA 3.42 theke 3.50+ kora essential scholarship application clear korte. Core subjects improve koro details path update korte. Research dashboard open korbo?`),
        actionCard: {
          type: 'research',
          title: 'Open Research Publication Roadmap',
          description: 'Track publication stages, manuscript edits, and IEEE reviewer feedback deadlines.',
          actionText: 'Open Roadmap',
          actionId: 'RESEARCH_ROADMAP'
        }
      };
    } else {
      return {
        response: withPartnerText(`You have an active research manuscript titled *"Deep Learning-Based Early Detection of Student Academic Risk"* currently **Under Review** at IEEE Transactions on Learning Technologies, supervised by Mr. Md. Sarwar Hossain Mollah.\n\nWhile your technical analytical skill is solid, raising your CGPA to **3.50+** is key for global academic grants. Would you like to review your thesis milestone timeline?`),
        actionCard: {
          type: 'research',
          title: 'Open Research Publication Roadmap',
          description: 'Track publication stages, manuscript edits, and IEEE reviewer feedback deadlines.',
          actionText: 'Open Roadmap',
          actionId: 'RESEARCH_ROADMAP'
        }
      };
    }
  }

  // 7. SKILLS RADAR / GAPS / SOFT SKILLS
  if (query.includes('skill') || query.includes('radar') || query.includes('gap') || query.includes('communication') || query.includes('leadership')) {
    if (lang === 'bangla') {
      return {
        response: withPartnerText(`আপনার **Skill Radar** পর্যালোচনায় পাওয়া গেছে:\n\n*   **সবচেয়ে শক্তিশালী দিক:** Problem Solving (৭৮%) এবং Teamwork (৭৫%)\n*   **উন্নতির ক্ষেত্র:** Leadership (৪৮%) এবং Communication (৫২%)\n\nফটোগ্রাফি ক্লাবের সেক্রেটারি হিসেবে আপনার বর্তমান দায়িত্ব লিডারশিপ ও কমিউনিকেশন বাড়ানোর একটি চমৎকার মাধ্যম। এছাড়াও পেন্ডিং ডিবেট ক্লাবের মেম্বারশিপ ভেরিফাই করতে পারেন। চেকলিস্ট দেখতে চান?`),
        actionCard: {
          type: 'skill',
          title: 'Open Skill Radar Checklist',
          description: 'View customized tasks, debate workshops, and leadership modules to raise soft-skill ratings.',
          actionText: 'Open Checklist',
          actionId: 'OPEN_SKILL_RADAR'
        }
      };
    } else if (lang === 'banglish') {
      return {
        response: withPartnerText(`Skill Radar graph check korlam. Tomar parameters:\n*   **Strengths:** Problem Solving (78%) and Teamwork (75%)\n*   **Weak Gaps:** Leadership (48%) and Communication (52%)\n\nPhotography club Secretary updates utilize koro events coordination e. Plus Debate club registration verification completed hole score secure hobe. Soft-skills tracker check korbe?`),
        actionCard: {
          type: 'skill',
          title: 'Open Skill Radar Checklist',
          description: 'View customized tasks, debate workshops, and leadership modules to raise soft-skill ratings.',
          actionText: 'Open Checklist',
          actionId: 'OPEN_SKILL_RADAR'
        }
      };
    } else {
      return {
        response: withPartnerText(`Analyzing your **Skill Radar** records:\n\n*   **Key Strengths:** Problem Solving (78%) and Teamwork (75%).\n*   **Gaps to Address:** Leadership (48%) and Communication (52%).\n\nLeverage your active role as Secretary of the Photography Club to organize events, or complete verification of the pending Debate Club registration to raise communication metrics. Let's inspect your developmental checkpoints.`),
        actionCard: {
          type: 'skill',
          title: 'Open Skill Radar Checklist',
          description: 'View customized tasks, debate workshops, and leadership modules to raise soft-skill ratings.',
          actionText: 'Open Checklist',
          actionId: 'OPEN_SKILL_RADAR'
        }
      };
    }
  }

  // 8. ATTENDANCE INQUIRY
  if (query.includes('attendance') || query.includes('uposthiti') || query.includes('class') || query.includes('presence')) {
    if (lang === 'bangla') {
      return {
        response: withPartnerText(`আপনার গড় ক্লাসের উপস্থিতি **৭১%**।\n\nপ্রধানত **Database Systems (৬২%)** এবং **Data Structures (৬৮%)** এই দুটি সাবজেক্টের উপস্থিতি বিপজ্জনক অবস্থায় রয়েছে। পরীক্ষার এলিজিবিলিটি ঠিক রাখতে পরবর্তী সব ক্লাসে অংশগ্রহণ করা জরুরি। এ নিয়ে জনাব মোঃ সারোয়ার হোসেন মোল্লাের সাথে পরামর্শ করতে পারেন।`),
        mentorCard: mentors[0]
      };
    } else if (lang === 'banglish') {
      return {
        response: withPartnerText(`Tomar overall class presence **71%**. \n\nRisky subject gulo hocche: Database Systems (**62%**) and Data Structures (**68%**). Minimum 75% limit set thakay samner sob classes e active thaka dorkar. advisor er shathe brief slots call korbe?`),
        mentorCard: mentors[0]
      };
    } else {
      return {
        response: withPartnerText(`Your overall average attendance is **71%**.\n\nHowever, **Database Systems is at 62%** and **Data Structures is at 68%**, both violating the 75% standard rule. Missing any more sessions is highly risky. I recommend attending all upcoming classes.`),
        mentorCard: mentors[0]
      };
    }
  }

  // 9. GREETINGS & SMALL TALK
  if (query === 'hi' || query === 'hello' || query === 'hey' || query === 'assalamualaikum' || query === 'salam' || query === 'yo') {
    const greetingsBangla = [
      `আসসালামু আলাইকুম ${studentName}! 😊 আপনার আজকের দিনটি কেমন কাটছে? আপনার প্রোফাইল আমি পর্যবেক্ষণ করেছি। পড়াশোনার কোনো টপিক বা মেন্টর পরামর্শ নিয়ে সাহায্য লাগবে কি?`,
      `হ্যালো ${studentName}! 👋 আশা করি ভালো আছেন। আজ আপনার সেমিস্টার ৬ এর CGPA (${cgpa}), ডাটাবেজ প্রজেক্ট নাকি স্টাডি রুটিন নিয়ে আলোচনা করতে চান?`,
      `হাই ${studentName}! 😊 আমি আপনার একাডেমিক অ্যাসিস্ট্যান্ট। আজ পড়াশোনার কোনো নির্দিষ্ট টপিক বা মেন্টর সিলেকশন নিয়ে কাজ করব?`
    ];

    const greetingsBanglish = [
      `Assalamualaikum ${studentName}! 😊 Kemon colche semester? Tomar CGPA (${cgpa}) and weak subjects updates dekhlam. Study routine plan korbo, naki supervisor suggestions verify korbo?`,
      `Hey there, ${studentName}! 👋 Good to see you. Current Database attendance (62%) niye study checklist custom ready korbo naki general topics details discuss korbo?`,
      `Hi ${studentName}! 😊 Ready to assist you. Skill gaps discuss korbo, naki research paper milestones review korbo?`
    ];

    const greetingsEnglish = [
      `Hello ${studentName}! 😊 Hope you are having a productive day. I've reviewed your active profile statistics. What should we look at first?`,
      `Hey ${studentName}! 👋 Always glad to connect. Let me know if you want to optimize your study patterns, search academic mentors, or verify your library RFID stats!`,
      `Greetings, ${studentName}! 🚀 Let's work on boosting that CGPA (${cgpa}). Shall we check out a study roadmap or map out key weaknesses?`
    ];

    if (lang === 'bangla') return { response: pickRandom(greetingsBangla) };
    if (lang === 'banglish') return { response: pickRandom(greetingsBanglish) };
    return { response: pickRandom(greetingsEnglish) };
  }

  // 10. FALLBACK & GENERAL QUESTIONS (AND PARTNER MATCHING IF ONLY THAT)
  if (partnerMatchingText && !query.includes('grade') && !query.includes('subject') && !query.includes('cgpa')) {
    return { response: partnerMatchingText };
  }

  const fallbackBangla = [
    `আপনার বিষয়টি বুঝতে পেরেছি, ${studentName}। আমাদের মূল লক্ষ্য আপনার সিজিপিএ ৩.৪২ থেকে ৩.৫০+ এ উন্নীত করা এবং ডাটাবেজের ৪৮% স্কোর ও ৬২% উপস্থিতি নিরাপদ সীমায় আনা। এই রিলেটেড কোনো বিশেষ গাইডেন্স লাগবে কি?`,
    `আপনার ফটোগ্রাফি ক্লাবের সেক্রেটারি রোল এবং ল্যাব প্রজেক্টের ভেরিফিকেশন দুটিই প্রোফাইল ভ্যালু বাড়াতে সহায়ক। আপনি কি ডিজিটাল লাইব্রেরি অ্যাক্সেস করতে চান নাকি নতুন কোনো স্টাডি প্ল্যান রেডি করব?`,
    `জনাব মোঃ সারোয়ার হোসেন মোল্লা আপনার মেন্টর হিসেবে নিযুক্ত আছেন। ওনার সাথে আপনার প্রজেক্ট ভেরিফিকেশন বা কুইজ প্রস্তুতি নিয়ে সেশন বুক করতে চাইলে জানাতে পারেন।`
  ];

  const fallbackBanglish = [
    `Ami monitor korchi shob, ${studentName}. Normalization or tree algorithms revisions details check visual check library te search korte pari. Specific resource updates lagbe?`,
    `Database and Data Structures warnings list e clear thakay target marks details boost kora dynamic plans ready korte pari. visual updates links select korbe?`,
    `Tomar research paper status Under Review line e standard checklist link save ache. Mentor session schedule confirm korbe?`
  ];

  const fallbackEnglish = [
    `I understand, ${studentName}. Taking into account your Semester 6 parameters (CGPA ${cgpa}, weak items in DB and DS), how would you like to address this? We can configure a study timeline or schedule counseling.`,
    `Looking at your RFID library logs (52 hours logged), you have great consistency. Let me know if you want book reservation lists or specialized coursework exercises.`,
    `We can map a supervisor request or verify your Smart Library project. Which path suits your schedule best right now?`
  ];

  if (lang === 'bangla') return { response: withPartnerText(pickRandom(fallbackBangla)) };
  if (lang === 'banglish') return { response: withPartnerText(pickRandom(fallbackBanglish)) };
  return { response: withPartnerText(pickRandom(fallbackEnglish)) };
}
