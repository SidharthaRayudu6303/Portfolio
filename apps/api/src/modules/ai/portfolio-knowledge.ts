export interface PortfolioProject {
  name: string;
  slug: string;
  description: string;
  techStack: string[];
}

export interface PortfolioData {
  name: string;
  role: string;
  location: string;
  summary: string;
  skills: string[];
  projects: PortfolioProject[];
  education: string;
  contact: {
    availability: string;
    note: string;
  };
}

export const verifiedPortfolioData: PortfolioData = {
  name: 'Sidhartha',
  role: 'Full-Stack Software Engineer & AI / 3D Web Developer',
  location: 'India',
  summary:
    'Full-stack software engineer specializing in scalable web platforms, high-performance backends, modern interactive user experiences, machine learning applications, and cloud architecture.',
  skills: [
    'React',
    'Next.js',
    'TypeScript',
    'JavaScript',
    'Node.js',
    'NestJS',
    'Python',
    'SQL',
    'AWS',
    'Machine Learning',
  ],
  projects: [
    {
      name: 'GenVision',
      slug: 'genvision',
      description:
        'Advanced computer vision and generative AI platform designed for high-accuracy image processing, intelligent analysis, and automated neural visual workflows.',
      techStack: ['Python', 'Machine Learning', 'Next.js', 'TypeScript', 'FastAPI'],
    },
    {
      name: 'BhuYanthra',
      slug: 'bhuyanthra',
      description:
        'Geospatial intelligence and mapping analytics platform leveraging location telemetry, spatial queries, and high-performance data processing.',
      techStack: ['TypeScript', 'React', 'Next.js', 'SQL', 'AWS'],
    },
    {
      name: 'Robohatch',
      slug: 'robohatch',
      description:
        'Robotics automation and hardware/software orchestration system engineered for intelligent monitoring, control loops, and autonomous task execution.',
      techStack: ['Python', 'Machine Learning', 'Node.js', 'TypeScript'],
    },
    {
      name: 'SmartDonum',
      slug: 'smartdonum',
      description:
        'Transparent resource allocation and donation management platform featuring automated verification workflows, real-time status tracking, and secure auditability.',
      techStack: ['Next.js', 'React', 'Node.js', 'SQL', 'AWS'],
    },
    {
      name: 'Autism Screening Platform',
      slug: 'autism-screening-platform',
      description:
        'Early digital developmental screening platform utilizing behavioral evaluation metrics and machine learning models for accessible assessment.',
      techStack: ['Machine Learning', 'Python', 'React', 'Next.js', 'SQL'],
    },
    {
      name: 'Smart Rental Platform',
      slug: 'smart-rental-platform',
      description:
        'Modern end-to-end property management and rental system featuring verified tenant workflows, dynamic listings, and secure agreement management.',
      techStack: ['Next.js', 'TypeScript', 'NestJS', 'SQL', 'AWS'],
    },
  ],
  education:
    'Bachelor of Technology in Computer Science & Engineering, focused on software architecture, systems programming, and applied artificial intelligence.',
  contact: {
    availability: 'Open for full-stack engineering roles, technical challenges, and innovative software collaborations.',
    note: 'You can reach Sidhartha directly via the on-site Contact form, verified LinkedIn, or email.',
  },
};
