-- Update Highlights to AI-focused content
-- Run this script against all environments: DEV, STG, PROD

-- Update Profile headline and summary
UPDATE "Profile"
SET
  headline = 'AI Engineer & DevOps Specialist',
  summary = 'AI Engineer specializing in LLMs, ML pipelines, and intelligent automation. DevOps expert with Docker, Kubernetes, Azure, and cloud-native solutions.',
  "updatedAt" = NOW()
WHERE id = 'default';

-- Update Settings description
UPDATE "Settings"
SET
  "siteDescription" = 'AI Engineer & DevOps Specialist Portfolio'
WHERE id = 'default';

-- Update Highlight 1: AI & Machine Learning
UPDATE "Highlight"
SET
  icon = 'Brain',
  title = 'AI & Machine Learning',
  description = 'Building intelligent systems with LLMs, ML pipelines, and AI-powered automation',
  "updatedAt" = NOW()
WHERE id = 'hl1';

-- Update Highlight 2: AI Engineering
UPDATE "Highlight"
SET
  icon = 'Bot',
  title = 'AI Engineering',
  description = 'Developing AI agents, chatbots, and generative AI applications with modern frameworks',
  "updatedAt" = NOW()
WHERE id = 'hl2';

-- Update Highlight 3: Cloud Architecture
UPDATE "Highlight"
SET
  icon = 'Cloud',
  title = 'Cloud Architecture',
  description = 'Azure & multi-cloud specialist designing scalable AI-ready infrastructure',
  "updatedAt" = NOW()
WHERE id = 'hl3';

-- Update Highlight 4: DevOps & CI/CD
UPDATE "Highlight"
SET
  icon = 'Workflow',
  title = 'DevOps & CI/CD',
  description = 'Automated pipelines with GitHub Actions, Docker Swarm, and Kubernetes',
  "updatedAt" = NOW()
WHERE id = 'hl4';

-- Update Highlight 5: Software Development
UPDATE "Highlight"
SET
  icon = 'Code',
  title = 'Software Development',
  description = 'Full-stack development with Python, TypeScript, Go, and modern frameworks',
  "updatedAt" = NOW()
WHERE id = 'hl5';

-- Update Highlight 6: Security & Infrastructure
UPDATE "Highlight"
SET
  icon = 'Shield',
  title = 'Security & Infrastructure',
  description = 'Zero-trust architecture, IaC with Terraform, and compliance automation',
  "updatedAt" = NOW()
WHERE id = 'hl6';

-- Verify updates
SELECT id, icon, title, description FROM "Highlight" ORDER BY "order";
SELECT id, headline, summary FROM "Profile" WHERE id = 'default';
