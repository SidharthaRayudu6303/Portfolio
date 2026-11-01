import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as path from 'node:path';
import * as fs from 'node:fs';

// Automatically load local .env if present and environment variables are unset
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath) && typeof process.loadEnvFile === 'function') {
  try {
    process.loadEnvFile(envPath);
  } catch {
    // Ignore if already loaded or partially defined
  }
}

const prisma = new PrismaClient();
const STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{12,}$/;

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (email && password && STRONG_PASSWORD_REGEX.test(password)) {
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    await prisma.adminUser.upsert({
      where: { email },
      update: { passwordHash },
      create: {
        email,
        passwordHash,
        role: 'admin',
        tokenVersion: 1,
      },
    });
    console.log(`✅ Admin account verified/seeded for: ${email}`);
  }

  // Seed 6 Verified Projects
  const verifiedProjects = [
    {
      title: 'GenVision: A Cloud Severity-Aware Transformer-Diffusion Framework for Cloud-Free Satellite Image Reconstruction and Agricultural Analysis',
      slug: 'genvision',
      description:
        'An AI/ML-based satellite image reconstruction framework designed to recover cloud-obscured regions in satellite imagery and support agricultural analysis.',
      problemSolved:
        'Cloud coverage in satellite images can hide important geographical information, affecting remote sensing and agricultural monitoring.',
      whyBuilt:
        'To explore how AI and deep learning can reconstruct missing satellite image regions and improve the usability of remote sensing data.',
      myContribution:
        'Research, System architecture, AI/ML workflow, Frontend development, and Integration.',
      features: [
        'Cloud detection',
        'Cloud severity analysis',
        'Satellite image reconstruction',
        'Temporal image analysis',
        'Agricultural analysis',
      ],
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
      githubUrl: null,
      featured: true,
      order: 1,
    },
    {
      title: 'BhuYanthra — AI-Powered Agricultural Intelligence Platform',
      slug: 'bhuyanthra',
      description:
        'An agricultural intelligence platform that uses satellite imagery and geospatial analysis to support agricultural monitoring and decision-making.',
      problemSolved:
        'Lack of accessible satellite-based agricultural insights and difficulties monitoring agricultural land over time.',
      whyBuilt:
        'To explore how satellite data and AI can help improve agricultural monitoring and decision-making.',
      myContribution:
        'Frontend development, Integration of geospatial data, and Platform development.',
      features: [
        'Satellite imagery visualization',
        'Agricultural monitoring',
        'Geospatial analysis',
        'Remote sensing data integration',
      ],
      techStack: [
        'Next.js',
        'React',
        'Python',
        'ISRO Bhuvan',
        'Sentinel-2',
        'Geospatial Analysis',
      ],
      status: 'In Development',
      liveUrl: null,
      githubUrl: null,
      featured: true,
      order: 2,
    },
    {
      title: 'Robohatch — 3D Printed Products E-commerce Platform',
      slug: 'robohatch',
      description:
        'An e-commerce platform designed for showcasing and selling 3D-printed products through an intuitive online shopping experience.',
      myContribution:
        'Full-stack development, Frontend implementation, Backend API integration, and Deployment.',
      features: [
        'Product listings',
        'Product details',
        'Shopping experience',
        'Backend API integration',
        'Responsive interface',
      ],
      techStack: ['Next.js', 'NestJS', 'TypeScript', 'REST APIs', 'AWS', 'Vercel'],
      status: 'Developed / Deployed',
      liveUrl: 'https://robohatch-platform-web.vercel.app/',
      githubUrl: 'https://github.com/Chandrasekhar246800/robohatch-platform.git',
      featured: true,
      order: 3,
    },
    {
      title: 'SmartDonum — Donation Management Platform',
      slug: 'smartdonum',
      description:
        'A donation management platform connecting donors and beneficiaries to make donations of food, clothing, and books more accessible and organized.',
      myContribution:
        'Frontend development, Application design, API integration, and Platform development.',
      features: [
        'Donation management',
        'Donor and beneficiary workflows',
        'Donation listings',
        'Responsive user interface',
      ],
      techStack: ['React.js', 'Next.js', 'REST APIs', 'MySQL'],
      status: 'Developed / Deployed',
      liveUrl: 'https://smartdonum.vercel.app/',
      githubUrl: 'https://github.com/Chandrasekhar246800/smartdonum.git',
      featured: true,
      order: 4,
    },
    {
      title: 'Autism Screening Platform',
      slug: 'autism-screening-platform',
      description:
        'A web-based autism screening platform designed to provide an accessible interface for screening-related assessments and media submissions.',
      problemSolved:
        'Provides an accessible interface for screening-related assessments and media submissions.',
      myContribution:
        'Frontend development and implementation of application workflows.',
      features: [
        'Landing page',
        'Account creation',
        'Dashboard',
        'Camera scanning interface',
        'Video upload functionality',
      ],
      techStack: ['React', 'Vite', 'TypeScript'],
      status: 'Developed / Deployed',
      liveUrl: 'https://autism-screening-platform.vercel.app/',
      githubUrl: 'https://github.com/SidharthaRayudu6303/autism_screening_platform.git',
      featured: false,
      order: 5,
    },
    {
      title: 'Smart Rental Platform — Equipment and Fleet Management Dashboard',
      slug: 'smart-rental-platform',
      description:
        'An equipment and fleet management platform designed to help monitor rental equipment, track operations, and visualize important business information.',
      myContribution:
        'Frontend development, Dashboard implementation, API integration, and Application development.',
      features: [
        'Equipment tracking',
        'Fleet management dashboard',
        'Analytics',
        'Forecasting',
        'Alerts',
      ],
      techStack: ['React.js', 'Next.js', 'REST APIs', 'Vercel'],
      status: 'Developed / Deployed',
      liveUrl: 'https://cat-hackathon-nu.vercel.app/dashboard',
      githubUrl: 'https://github.com/SidharthaRayudu6303/CAT_Hackathon.git',
      featured: false,
      order: 6,
    },
  ];

  for (const proj of verifiedProjects) {
    await prisma.project.upsert({
      where: { slug: proj.slug },
      update: proj,
      create: proj,
    });
  }
  console.log(`✅ Seeded ${verifiedProjects.length} verified projects.`);

  // Seed Verified Experience
  const existingExp = await prisma.experience.findFirst({
    where: { company: 'Unstop Events' },
  });

  if (!existingExp) {
    await prisma.experience.create({
      data: {
        company: 'Unstop Events',
        role: 'React JS Developer Intern',
        description:
          'Worked on React.js-based frontend development and practical web development tasks.',
        current: false,
        order: 1,
      },
    });
    console.log(`✅ Seeded Unstop Events internship.`);
  }

  // Seed Verified Certifications
  const verifiedCerts = [
    {
      title: 'Understanding Machine Learning',
      issuer: 'DataCamp',
      issueDate: new Date('2025-11-08'),
      order: 1,
    },
    {
      title: 'Python Programming Course',
      issuer: 'CodeTantra, in association with Sathyabama Institute of Science and Technology',
      issueDate: new Date('2025-10-14'),
      order: 2,
    },
    {
      title: 'Python 101 for Data Science',
      issuer: 'Cognitive Class — IBM Developer Skills Network',
      issueDate: new Date('2025-06-24'),
      order: 3,
    },
    {
      title: 'Basics of Python',
      issuer: 'Infosys Springboard',
      issueDate: new Date('2025-06-19'),
      order: 4,
    },
    {
      title: 'Email Writing Skills',
      issuer: 'Infosys Springboard',
      issueDate: new Date('2025-06-23'),
      order: 5,
    },
    {
      title: 'AI Workshop — AI in Mobile Phones',
      issuer: 'Samsung India — Learn with Samsung',
      order: 6,
    },
    {
      title: "AI 2025 — India's Biggest Career Aptitude Test",
      issuer: 'NxtWave Campus',
      issueDate: new Date('2025-01-01'),
      order: 7,
    },
  ];

  for (const cert of verifiedCerts) {
    const existing = await prisma.certification.findFirst({
      where: { title: cert.title },
    });
    if (!existing) {
      await prisma.certification.create({ data: cert });
    }
  }
  console.log(`✅ Verified certifications seeded.`);

  // Seed Education
  const existingEdu = await prisma.education.findFirst({
    where: { institution: 'Sathyabama Institute of Science and Technology' },
  });
  if (!existingEdu) {
    await prisma.education.create({
      data: {
        institution: 'Sathyabama Institute of Science and Technology',
        degree: 'Bachelor of Engineering (B.E.)',
        department: 'Computer Science and Engineering',
        startYear: 2023,
        endYear: 2027,
        cgpa: '8.4 / 10',
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
        order: 1,
      },
    });
    console.log(`✅ Seeded Education records.`);
  }

  // Seed Achievements
  const existingAch = await prisma.achievement.findFirst({
    where: { title: 'Bharatiya Antariksh Hackathon 2026' },
  });
  if (!existingAch) {
    await prisma.achievement.create({
      data: {
        title: 'Bharatiya Antariksh Hackathon 2026',
        category: 'Hackathon',
        description:
          'Selected challenge focused on applying AI/ML-based image inpainting to reconstruct missing regions in temporal remote sensing imagery.',
        year: 2026,
        status: 'Selected for Challenge 12',
        order: 1,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
