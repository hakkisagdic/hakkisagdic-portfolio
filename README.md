# 🏢 Customer Stack Template

Template repository for deploying customer applications to Docker Swarm platform.

## 🚀 Quick Start (Automated)

Use the onboarding script for automated setup:

```bash
# Clone infra-swarm-platform (contains onboarding script)
git clone https://github.com/hakkisagdic/infra-swarm-platform.git
cd infra-swarm-platform

# Run onboarding script
./scripts/onboard-customer.sh <customer-name> [options]

# Examples:
./scripts/onboard-customer.sh acme-corp
./scripts/onboard-customer.sh acme-corp --domain acme.com --private
./scripts/onboard-customer.sh portfolio --domain hakkisagdic.dev
```

### Script Options

| Option | Description | Default |
|--------|-------------|---------|
| `--domain DOMAIN` | Custom domain | `<customer>.example.com` |
| `--private` | Create private repo | Public |
| `--org ORG` | GitHub organization | `hakkisagdic` |
| `--acr NAME` | ACR name | `acrswarm123abc` |

## 📋 Manual Setup

If you prefer manual setup:

### 1. Create Repository from Template

```bash
gh repo create <customer-name> --template hakkisagdic/customer-template --public
```

### 2. Configure Repository Variables

Go to: Settings → Secrets and variables → Actions → Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `CUSTOMER_NAME` | Customer identifier | `acme-corp` |
| `ACR_NAME` | Azure Container Registry | `acrswarm123abc` |
| `DOMAIN` | Customer domain | `acme.com` |

### 3. Configure Repository Secrets

Go to: Settings → Secrets and variables → Actions → Secrets

| Secret | Description |
|--------|-------------|
| `ACR_USERNAME` | ACR admin username |
| `ACR_PASSWORD` | ACR admin password |
| `SWARM_HOST` | Swarm manager IP |
| `SWARM_USER` | SSH username (`swarmadmin`) |
| `SWARM_SSH_KEY` | SSH private key |

### 4. Configure DNS

| Record | Type | Value |
|--------|------|-------|
| `customer.com` | A | Swarm Manager IP |
| `dev.customer.com` | A | Swarm Manager IP |
| `staging.customer.com` | A | Swarm Manager IP |

### 5. Create Database Secret (if needed)

```bash
ssh swarmadmin@<SWARM_HOST>
echo "secure-password" | docker secret create <customer>-db-password -
```

## 📁 Repository Structure

```
customer-repo/
├── .github/
│   └── workflows/
│       ├── deploy.yml        # Build & deploy pipeline
│       └── gitflow.yml       # Automated PR creation
├── scripts/
│   └── onboard-customer.sh   # Onboarding automation
├── docker-compose.yml        # Swarm stack definition
├── Dockerfile.example        # Application build template
├── .env.example              # Environment template
└── README.md                 # This file
```

## 🔄 GitFlow Workflow

This template uses a 3-environment GitFlow:

```
┌─────────┐     ┌─────────────┐     ┌──────────┐
│   dev   │ ──▶ │   staging   │ ──▶ │   main   │
└─────────┘     └─────────────┘     └──────────┘
     │                │                   │
     ▼                ▼                   ▼
┌─────────┐     ┌─────────────┐     ┌──────────┐
│ dev.    │     │ staging.    │     │ prod     │
│ domain  │     │ domain      │     │ domain   │
└─────────┘     └─────────────┘     └──────────┘
```

### Deployment Flow

1. **Push to `dev`** → Deploys to dev environment
2. **PR: dev → staging** → Auto-created, deploys to staging when merged
3. **PR: staging → main** → Auto-created, deploys to production when merged

## 🔧 Customization

### Adding Redis

Uncomment the redis service in `docker-compose.yml`:

```yaml
services:
  redis:
    image: redis:7-alpine
    networks:
      - internal
```

### Adding Database

```yaml
services:
  db:
    image: postgres:15-alpine
    secrets:
      - source: ${CUSTOMER_NAME}-db-password
        target: db_password
    environment:
      - POSTGRES_PASSWORD_FILE=/run/secrets/db_password
```

### Multiple Domains

Add Traefik labels for additional routes:

```yaml
labels:
  - "traefik.http.routers.${CUSTOMER_NAME}-api.rule=Host(`api.${DOMAIN}`)"
```

## 🔐 Security

- **Never commit secrets** to the repository
- Use Docker Swarm secrets for sensitive data
- All secrets are injected via GitHub Actions
- SSH keys should have limited scope

## 📞 Support

- **Platform Docs**: https://github.com/hakkisagdic/infra-swarm-platform/docs
- **Issues**: Create an issue in the infra-swarm-platform repo
