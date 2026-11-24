import type { Work } from '../components/WorkScroll'

const orbitalUrl = 'https://orbital.chavanpratik-pc.workers.dev/demo#space=home&view=overview'

export const workCategories: Work[] = [
  {
    id: 'design', title: 'Design', description: 'Interfaces & Interactions', layout: 'list',
    projects: [{
      title: 'Orbital', description: 'A calmer space for complex work.',
      href: orbitalUrl, action: 'Explore the interface',
    }],
  },
  {
    id: 'engineering', title: 'Build', description: 'Products & Systems', layout: 'list',
    projects: [
      { title: 'Focused', description: 'Tasks, project boards, and focused work.', href: 'https://github.com/neutr0nian/focused', action: 'View on GitHub' },
      { title: 'Raft', description: 'Consensus across distributed nodes.', href: 'https://github.com/neutr0nian/raft_algorithm', action: 'View on GitHub' },
      { title: 'Tesla Trips', description: 'Planning the journey ahead.', href: 'https://www.tesla.com/trips', action: 'Visit Tesla Trips' },
      { title: 'Tesla Drive', description: 'From curiosity to a demo drive.', href: 'https://www.tesla.com/drive', action: 'Visit Tesla Drive' },
    ],
  },
  {
    id: 'visualizations', title: 'Visuals', description: 'Algorithmic Explorations', layout: 'list',
    projects: [
      { title: 'BFS & DFS', description: 'Two ways to explore a maze.', href: 'https://github.com/neutr0nian/path_visualizer', action: 'View on GitHub' },
      { title: 'N-body simulation', description: 'A gravitational playground in p5.js. Click the canvas to add bodies.', href: 'https://editor.p5js.org/neutr0nian/sketches/jYmwak400', action: 'Open in p5.js' },
    ],
  },
  {
    id: 'experiments', title: 'Spark', description: 'Ideas & Prototypes', layout: 'list',
    projects: [
      { title: 'Rancho', description: 'A study notebook that draws ideas live.', href: 'https://github.com/neutr0nian/rancho', action: 'View on GitHub' },
      { title: 'Orbital', description: 'Exploring a connected team workspace.', href: orbitalUrl, action: 'Explore demo' },
      { title: 'Stack Overflow', description: 'A fresh take on questions and discovery.', href: 'https://github.com/neutr0nian/stack-overflow', action: 'View on GitHub' },
    ],
  },
]
