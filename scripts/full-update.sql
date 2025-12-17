-- Full update script for all environments
-- Creates Highlight table if missing, then updates/inserts data

-- Step 1: Create Highlight table if not exists
CREATE TABLE IF NOT EXISTS "Highlight" (
    "id" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Highlight_pkey" PRIMARY KEY ("id")
);

-- Step 2: Add Prisma migration record if table was created
INSERT INTO "_prisma_migrations" (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count)
SELECT
    gen_random_uuid()::text,
    'manual_migration',
    NOW(),
    '20251215150000_add_highlight',
    NULL,
    NULL,
    NOW(),
    1
WHERE NOT EXISTS (
    SELECT 1 FROM "_prisma_migrations" WHERE migration_name = '20251215150000_add_highlight'
);

-- Step 3: Insert/Update Profile
INSERT INTO "Profile" (id, name, headline, summary, location, email, linkedin, github, "createdAt", "updatedAt")
VALUES (
  'default',
  'Hakki Sagdic',
  'AI Engineer & DevOps Specialist',
  'AI Engineer specializing in LLMs, ML pipelines, and intelligent automation. DevOps expert with Docker, Kubernetes, Azure, and cloud-native solutions.',
  'Istanbul, Turkey',
  'hakkisagdic@gmail.com',
  'https://linkedin.com/in/hakkisagdic',
  'https://github.com/hakkisagdic',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  headline = EXCLUDED.headline,
  summary = EXCLUDED.summary,
  "updatedAt" = NOW();

-- Step 4: Insert/Update Settings
INSERT INTO "Settings" (id, "siteTitle", "siteDescription", theme, "primaryColor", "accentColor", "showParticles", "showGrid", "showScanlines", "particleCount", "animationSpeed")
VALUES (
  'default',
  'Hakki Sagdic',
  'AI Engineer & DevOps Specialist Portfolio',
  'cyberpunk',
  '#00f0ff',
  '#f000ff',
  true,
  true,
  true,
  100,
  1.0
)
ON CONFLICT (id) DO UPDATE SET
  "siteDescription" = EXCLUDED."siteDescription";

-- Step 5: Insert/Update Highlights
INSERT INTO "Highlight" (id, icon, title, description, "order", "createdAt", "updatedAt")
VALUES
  ('hl1', 'Brain', 'AI & Machine Learning', 'Building intelligent systems with LLMs, ML pipelines, and AI-powered automation', 0, NOW(), NOW()),
  ('hl2', 'Bot', 'AI Engineering', 'Developing AI agents, chatbots, and generative AI applications with modern frameworks', 1, NOW(), NOW()),
  ('hl3', 'Cloud', 'Cloud Architecture', 'Azure & multi-cloud specialist designing scalable AI-ready infrastructure', 2, NOW(), NOW()),
  ('hl4', 'Workflow', 'DevOps & CI/CD', 'Automated pipelines with GitHub Actions, Docker Swarm, and Kubernetes', 3, NOW(), NOW()),
  ('hl5', 'Code', 'Software Development', 'Full-stack development with Python, TypeScript, Go, and modern frameworks', 4, NOW(), NOW()),
  ('hl6', 'Shield', 'Security & Infrastructure', 'Zero-trust architecture, IaC with Terraform, and compliance automation', 5, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  icon = EXCLUDED.icon,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  "order" = EXCLUDED."order",
  "updatedAt" = NOW();

-- Step 6: Verify
SELECT '=== Profile ===' AS section;
SELECT id, headline, LEFT(summary, 50) || '...' AS summary FROM "Profile" WHERE id = 'default';

SELECT '=== Highlights ===' AS section;
SELECT id, icon, title FROM "Highlight" ORDER BY "order";
