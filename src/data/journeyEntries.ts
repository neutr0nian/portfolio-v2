export type JourneyMotif = 'cloud' | 'sun' | 'fuji' | 'blossom' | 'torii' | 'cat' | 'fan' | 'koi' | 'daruma'

export type JourneyEntry = {
  id: string
  year: string
  period?: string
  company: string
  location?: string
  role: string
  description?: string
  highlights?: string[]
  sections?: { title: string; period?: string; highlights: string[] }[]
  technologies?: string[]
  credentialUrl?: string
  programUrl?: string
  motif: JourneyMotif
}

export const journeyEntries: JourneyEntry[] = [
  {
    id: 'tomato-tech',
    year: '2019–2021',
    company: 'Tomato Tech',
    role: 'Frontend Engineer',
    motif: 'cloud',
  },
  {
    id: 'sportz',
    year: '2021',
    period: 'Feb – Aug 2021',
    company: 'Sportz Interactive',
    location: 'India',
    role: 'Associate Software Engineer',
    motif: 'sun',
    description: 'Built accessible sports experiences for three clients, turning designs and product requirements into frontend features.',
    highlights: [
      'Developed sports interfaces with Vue.js and TypeScript, alongside jQuery and Stimulus.',
      'Partnered with designers to build web components that followed WCAG accessibility guidelines.',
      'Delivered features within a 10-person agile team, working with product teams to clarify requirements and incorporate updates.',
    ],
    technologies: ['Vue.js', 'TypeScript', 'jQuery', 'Stimulus', 'Sass'],
  },
  {
    id: 'suny',
    year: '2021–2023',
    period: 'Aug 2021 – Feb 2023',
    company: 'University at Buffalo',
    location: 'New York, US',
    role: 'Master of Science in Computer Science',
    motif: 'fuji',
    description: 'Deepened my foundations in algorithms, distributed systems, and databases, then applied my full-stack skills to a course project management tool for faculty.',
    sections: [
      {
        title: 'Graduate study',
        highlights: [
          'Studied algorithm analysis, distributed systems, machine learning, blockchain development, and database systems.',
          'Implemented Raft consensus in Python across five server nodes and one client, covering leader election, log replication, and fault tolerance with Docker and socket programming.',
        ],
      },
      {
        title: 'Full Stack Developer · Volunteer',
        period: 'Mar – May 2023',
        highlights: [
          'Built a dashboard to help professors manage course projects, taking the application from Figma prototypes to a working interface.',
          'Connected React routing and shared state to REST APIs built with Node.js, Express, and Sequelize.',
          'Deployed the application on Apache and set up CI/CD to streamline releases.',
        ],
      },
    ],
    technologies: ['React', 'Node.js', 'Express', 'Sequelize', 'Figma', 'Apache', 'Python', 'Docker'],
  },
  {
    id: 'marketplace',
    year: '2022',
    period: 'May – Dec 2022',
    company: 'Your Online Marketplace',
    location: 'New York, US',
    role: 'Software Engineer Intern',
    motif: 'blossom',
    description: 'Built inventory management features across the frontend and serverless backend, supporting store operations and making it easier to report issues.',
    highlights: [
      'Delivered 10+ frontend features with React, Redux, and Semantic UI, including application state management.',
      'Developed AWS Lambda functions in Node.js and Ruby for an event-driven inventory system, connecting to the database and monitoring activity in CloudWatch.',
      'Created a feedback flow with email notifications so users could report bugs and share feedback from the tool.',
    ],
    technologies: ['React', 'Redux', 'Semantic UI', 'Node.js', 'Ruby', 'AWS Lambda', 'CloudWatch'],
  },
  {
    id: 'meta-design',
    year: '2023',
    period: 'Issued Jan 2023',
    company: 'Meta',
    role: 'Principles of UX/UI Design',
    motif: 'koi',
    description: 'Strengthened my approach to designing useful, accessible interfaces, connecting user research with visual decisions and interactive prototypes in Figma.',
    sections: [{
      title: 'What I learned',
      highlights: [
        'Translate research into user personas and design decisions grounded in people’s needs.',
        'Evaluate interfaces for usability, accessibility, and consistency, including navigation patterns and form design.',
        'Use typography, visual hierarchy, and grids to make content easier to understand across screen sizes.',
        'Move from wireframes to detailed mockups and interactive Figma prototypes, using reusable components and design systems.',
        'Plan usability tests, share prototypes, and refine interactions through feedback and iteration.',
      ],
    }],
    credentialUrl: 'https://www.coursera.org/account/accomplishments/records/MKYY5C6AKZ87',
  },
  {
    id: 'tesla-engineer',
    year: '2023',
    period: 'Jul 2023',
    company: 'Tesla',
    location: 'California, US',
    role: 'Software Engineer',
    motif: 'torii',
    description: 'Built customer-facing experiences that help people explore Tesla vehicles and charging options, while improving the systems and shared code behind them.',
    highlights: [
      'Revamped the Demo Drive experience with React, TypeScript, and SCSS, reducing code duplication by 30% through a more modular implementation.',
      'Designed and developed Help Me Choose and Help Me Charge to support vehicle and charging discovery.',
      'Shipped full-stack features for Locale Selector, Tesla Chat, and Location Services using React and Node.js.',
      'Refactored Node.js and PHP APIs, bringing response times down from 4–5 seconds to 2 seconds.',
      'Improved frontend consistency with reusable component libraries, ESLint, and shared development practices, partnering with design, product, and QA on accessible interfaces.',
      'Mentored an intern through planning, development, and release of a product launch.',
    ],
    technologies: ['React', 'TypeScript', 'SCSS', 'Node.js', 'PHP', 'ESLint'],
  },
  {
    id: 'calarts-design',
    year: '2024',
    period: 'Issued May 2024',
    company: 'CalArts',
    role: 'UI / UX Design Specialization',
    motif: 'fan',
    description: 'Completed a four-course specialization from the California Institute of the Arts, developing a visual design approach to the full UX process, from understanding users to shaping coherent, interactive experiences.',
    sections: [
      {
        title: 'Visual design',
        highlights: ['Use color, typography, composition, and interface conventions to establish hierarchy and make screens feel clear and consistent.'],
      },
      {
        title: 'UX process',
        highlights: ['Develop ideas around user needs, map the structure of an application, and connect individual screens into a purposeful experience.'],
      },
      {
        title: 'Strategy and structure',
        highlights: ['Define a website’s audience, goals, and scope, then organize its content into information architecture, sitemaps, and interaction sequences.'],
      },
      {
        title: 'Prototyping for the web',
        highlights: ['Translate research and planning into wireframes, detailed mockups, and clickable prototypes, accounting for responsive layouts, mobile constraints, and web typography.'],
      },
    ],
    credentialUrl: 'https://www.coursera.org/account/accomplishments/specialization/WPRJ25XWXS32',
  },
  {
    id: 'tesla-senior',
    year: '2026–Present',
    company: 'Tesla',
    location: 'California, US',
    role: 'Senior Software Engineer',
    motif: 'cat',
    description: 'Promoted to Senior Software Engineer in 2026.',
  },
  {
    id: 'ixdf-product-design',
    year: '2026',
    period: '2026 · In progress',
    company: 'IxDF',
    role: 'Product Designer',
    motif: 'daruma',
    description: 'Currently studying product design with the Interaction Design Foundation, developing my approach to research, interaction design, and testing product ideas.',
    sections: [{
      title: 'Learning focus',
      highlights: [
        'Understand user needs through research and translate findings into product design decisions.',
        'Explore ideas through wireframes, prototypes, and interaction design.',
        'Evaluate usability, refine visual design, and use evidence to guide iteration.',
      ],
    }],
    programUrl: 'https://ixdf.org/career-programs/product-designer-plus-ai',
  },
]
