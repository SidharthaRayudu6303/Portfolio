export interface PortfolioProject {
  name: string;
  slug: string;
  description: string;
  problemSolved?: string;
  myContribution?: string;
  techStack: string[];
  status: string;
  liveUrl?: string;
  githubUrl?: string;
}

export interface PortfolioData {
  name: string;
  legalName: string;
  role: string;
  location: string;
  email: string;
  phone: string;
  tagline: string;
  summary: string;
  careerObjective: string;
  currentlyLookingFor: string;
  availability: string;
  interests: string[];
  currentlyLearning: string[];
  skills: {
    programmingLanguages: string[];
    frontend: string[];
    backend: string[];
    databases: string[];
    cloud: string[];
    tools: string[];
    aiMl: string[];
  };
  projects: PortfolioProject[];
  education: {
    institution: string;
    degree: string;
    department: string;
    startYear: number;
    expectedGraduation: number;
    cgpa: string;
    coursework: string[];
    academicAchievement: string;
  };
  experience: {
    company: string;
    role: string;
    type: string;
    responsibilities: string;
    technologies: string[];
  }[];
  hackathons: {
    title: string;
    year: number;
    challenge: string;
    status: string;
    description: string;
  }[];
  certifications: {
    title: string;
    issuer: string;
    date?: string;
    type?: string;
  }[];
  profiles: {
    linkedin: string;
    leetcode: string;
    hackerrank: string;
    github?: string;
  };
}

export const verifiedPortfolioData: PortfolioData = {
  name: 'SIDHARTHA RAYUDU',
  legalName: 'Madhavarapu Sidhartha Rayudu',
  role: 'Full-Stack Developer & AI/ML Enthusiast',
  location: 'Kakinada, East Godavari, Andhra Pradesh, India',
  email: 'madhavarapusidhartharayudu@gmail.com',
  phone: '+91 6303075505',
  tagline: 'Building scalable web applications and intelligent solutions to solve real-world problems.',
  summary:
    'Computer Science and Engineering student passionate about full-stack development, software engineering, and artificial intelligence. Enjoys transforming ideas into practical applications by combining modern web technologies, backend systems, databases, and AI/ML.',
  careerObjective:
    'To begin my career as a software developer where I can contribute to real-world engineering problems, build scalable applications and continuously grow as a software engineer.',
  currentlyLookingFor: 'Software Developer, Full-Stack Developer, AI/ML Engineer opportunities',
  availability: 'Open to opportunities (Internships, Full-time roles, Selected freelance opportunities)',
  interests: [
    'Full-Stack Development',
    'Backend Engineering',
    'Artificial Intelligence',
    'Machine Learning',
    'Cloud Computing',
    'Problem Solving',
  ],
  currentlyLearning: [
    'Advanced Backend Development',
    'Machine Learning',
    'Cloud Technologies',
    'Data Structures and Algorithms',
  ],
  skills: {
    programmingLanguages: ['Python', 'JavaScript', 'TypeScript'],
    frontend: ['React.js', 'Next.js', 'HTML5', 'CSS3', 'Tailwind CSS', 'Vite'],
    backend: ['Node.js', 'NestJS', 'REST APIs'],
    databases: ['MySQL', 'PostgreSQL', 'Amazon RDS'],
    cloud: ['AWS', 'AWS EC2', 'AWS Amplify', 'Vercel'],
    tools: ['Git', 'GitHub', 'GitHub Actions', 'VS Code', 'Figma', 'Postman'],
    aiMl: [
      'Machine Learning',
      'Deep Learning Fundamentals',
      'Computer Vision',
      'Image Classification',
      'Geospatial Analysis',
      'Python',
    ],
  },
  projects: [
    {
      name: 'GenVision',
      slug: 'genvision',
      description:
        'A Cloud Severity-Aware Transformer-Diffusion Framework for Cloud-Free Satellite Image Reconstruction and Agricultural Analysis. Designed to recover cloud-obscured regions in satellite imagery and support agricultural analysis.',
      problemSolved:
        'Cloud coverage in satellite images can hide important geographical information, affecting remote sensing and agricultural monitoring.',
      myContribution: 'Research, System architecture, AI/ML workflow, Frontend development, Integration.',
      techStack: [
        'Next.js',
        'React',
        'Python processing services',
        'Transformers',
        'Diffusion Models',
        'Computer Vision',
        'Image Inpainting',
      ],
      status: 'Final-year project — In Development',
      liveUrl: 'https://gen-vision-nu.vercel.app/',
    },
    {
      name: 'BhuYanthra',
      slug: 'bhuyanthra',
      description:
        'AI-Powered Agricultural Intelligence Platform that uses satellite imagery and geospatial analysis to support agricultural monitoring and decision-making.',
      problemSolved:
        'Lack of accessible satellite-based agricultural insights and difficulties monitoring agricultural land over time.',
      myContribution: 'Frontend development, Integration of geospatial data, Platform development.',
      techStack: ['Next.js', 'React', 'Python', 'ISRO Bhuvan', 'Sentinel-2', 'Geospatial Analysis'],
      status: 'In Development',
    },
    {
      name: 'Robohatch',
      slug: 'robohatch',
      description:
        '3D Printed Products E-commerce Platform designed for showcasing and selling 3D-printed products through an online shopping experience.',
      myContribution: 'Full-stack development, Frontend implementation, Backend API integration, Deployment.',
      techStack: ['Next.js', 'NestJS', 'TypeScript', 'REST APIs', 'AWS', 'Vercel'],
      status: 'Developed / Deployed',
      liveUrl: 'https://robohatch-platform-web.vercel.app/',
      githubUrl: 'https://github.com/Chandrasekhar246800/robohatch-platform.git',
    },
    {
      name: 'SmartDonum',
      slug: 'smartdonum',
      description:
        'Donation Management Platform connecting donors and beneficiaries to make donations of food, clothing, and books more accessible and organized.',
      myContribution: 'Frontend development, Application design, API integration, Platform development.',
      techStack: ['React.js', 'Next.js', 'REST APIs', 'MySQL'],
      status: 'Developed / Deployed',
      liveUrl: 'https://smartdonum.vercel.app/',
      githubUrl: 'https://github.com/Chandrasekhar246800/smartdonum.git',
    },
    {
      name: 'Autism Screening Platform',
      slug: 'autism-screening-platform',
      description:
        'Web-based autism screening platform designed to provide an accessible interface for screening-related assessments and media submissions.',
      myContribution: 'Frontend development, Implementation of application workflows.',
      techStack: ['React', 'Vite', 'TypeScript'],
      status: 'Developed / Deployed',
      liveUrl: 'https://autism-screening-platform.vercel.app/',
      githubUrl: 'https://github.com/SidharthaRayudu6303/autism_screening_platform.git',
    },
    {
      name: 'Smart Rental Platform',
      slug: 'smart-rental-platform',
      description:
        'Equipment and Fleet Management Dashboard designed to help monitor rental equipment, track operations, and visualize important business information.',
      myContribution: 'Frontend development, Dashboard implementation, API integration, Application development.',
      techStack: ['React.js', 'Next.js', 'REST APIs', 'Vercel'],
      status: 'Developed / Deployed',
      liveUrl: 'https://cat-hackathon-nu.vercel.app/dashboard',
      githubUrl: 'https://github.com/SidharthaRayudu6303/CAT_Hackathon.git',
    },
  ],
  education: {
    institution: 'Sathyabama Institute of Science and Technology',
    degree: 'Bachelor of Engineering (B.E.)',
    department: 'Computer Science and Engineering',
    startYear: 2023,
    expectedGraduation: 2027,
    cgpa: '8.37 / 10',
    coursework: [
      'Data Structures and Algorithms',
      'Object-Oriented Programming',
      'Database Management Systems',
      'Operating Systems',
      'Computer Networks',
      'Machine Learning',
      'Artificial Intelligence',
      'Software Engineering',
    ],
    academicAchievement: 'Bharatiya Antariksh Hackathon 2026 — Challenge 12 selection (Selected for Challenge 12).',
  },
  experience: [
    {
      company: 'Robohatch',
      role: 'Software Developer Intern',
      type: 'Internship (Jan 2026 – May 2026)',
      responsibilities:
        'Developed and maintained 20+ responsive web pages for a production e-commerce platform using React.js and Tailwind CSS. Implemented core workflows (catalogue, custom design upload, cart, checkout) and integrated REST APIs.',
      technologies: ['React.js', 'Tailwind CSS', 'REST APIs', 'Postman', 'GitHub'],
    },
    {
      company: 'Unstop Events',
      role: 'React JS Developer Intern',
      type: 'Part-time Internship (10 June 2025 – 15 December 2025)',
      responsibilities:
        'Worked on React.js-based frontend development and practical web development tasks.',
      technologies: ['React.js', 'JavaScript'],
    },
  ],
  hackathons: [
    {
      title: 'Bharatiya Antariksh Hackathon 2026',
      year: 2026,
      challenge:
        'Challenge 12 — Fill in Missing Regions from Temporal Remote Sensing Images using AI/ML-based Inpainting',
      status: 'Selected for Challenge 12',
      description:
        'Selected challenge focused on applying AI/ML-based image inpainting to reconstruct missing regions in temporal remote sensing imagery.',
    },
    {
      title: 'CAT Hackathon',
      year: 2025,
      challenge: 'Smart Rental Platform — Equipment and Fleet Management Dashboard',
      status: 'Project Submission / Deployed',
      description:
        'Engineered an equipment and fleet management platform to monitor rental equipment, track operations and visualize important business information.',
    },
  ],
  certifications: [
    {
      title: 'National Coding Aptitude Test (NCAT) 2025 — Ranked 4,237 among 2.1 lakh+ participants',
      issuer: 'National Coding Aptitude Test (NCAT)',
      date: 'January 15, 2025',
      type: 'National Competition / Top ~2%',
    },
    {
      title: 'Understanding Machine Learning',
      issuer: 'DataCamp',
      date: 'November 8, 2025 (2 Hours)',
    },
    {
      title: 'Python Programming Course',
      issuer: 'CodeTantra in association with Sathyabama Institute of Science and Technology',
      date: 'October 14, 2025',
    },
    {
      title: 'Python 101 for Data Science',
      issuer: 'Cognitive Class — IBM Developer Skills Network',
      date: 'June 24, 2025',
      type: 'Certificate of Completion',
    },
    {
      title: 'TCS iON Career Edge — Young Professional',
      issuer: 'Tata Consultancy Services (TCS iON)',
      date: 'July 1, 2025',
      type: 'Professional Certification',
    },
    {
      title: 'Basics of Python',
      issuer: 'Infosys Springboard',
      date: 'June 19, 2025',
    },
    {
      title: 'Email Writing Skills',
      issuer: 'Infosys Springboard',
      date: 'June 23, 2025',
    },
    {
      title: 'AI Workshop — AI in Mobile Phones',
      issuer: 'Samsung India — Learn with Samsung',
      type: 'Workshop Participation / Learning Certificate',
    },
    {
      title: "AI 2025 — India's Biggest Career Aptitude Test",
      issuer: 'NxtWave Campus',
      date: '2025',
      type: 'Certificate of Participation',
    },
  ],
  profiles: {
    linkedin: 'https://www.linkedin.com/in/sidhartha-rayudu-madhavarapu-039b84318/',
    leetcode: 'https://leetcode.com/u/WPETOvKlww/',
    hackerrank: 'https://www.hackerrank.com/profile/madhavarapusidh1',
    github: 'https://github.com/SidharthaRayudu6303',
  },
};
