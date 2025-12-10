#!/bin/bash
#===============================================================================
# Customer Onboarding Script
# Docker Swarm Platform - Automated Customer Repository Setup
#===============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Default values
GITHUB_ORG="hakkisagdic"
TEMPLATE_REPO="customer-template"
ACR_NAME="acrswarm123abc"

#===============================================================================
# Functions
#===============================================================================

print_banner() {
    echo -e "${CYAN}"
    echo "╔═══════════════════════════════════════════════════════════════╗"
    echo "║         Docker Swarm Platform - Customer Onboarding          ║"
    echo "╚═══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

print_step() {
    echo -e "${BLUE}▶ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

usage() {
    echo "Usage: $0 <customer-name> [options]"
    echo ""
    echo "Arguments:"
    echo "  customer-name    Name of the customer (used for repo name)"
    echo ""
    echo "Options:"
    echo "  --domain DOMAIN  Custom domain for the customer (default: <customer>.example.com)"
    echo "  --private        Create private repository (default: public)"
    echo "  --org ORG        GitHub organization (default: $GITHUB_ORG)"
    echo "  --acr NAME       Azure Container Registry name (default: $ACR_NAME)"
    echo "  --help           Show this help message"
    echo ""
    echo "Example:"
    echo "  $0 acme-corp --domain acme.com --private"
    exit 1
}

check_dependencies() {
    print_step "Checking dependencies..."
    
    if ! command -v gh &> /dev/null; then
        print_error "GitHub CLI (gh) is not installed"
        echo "Install: https://cli.github.com/"
        exit 1
    fi
    
    if ! gh auth status &> /dev/null; then
        print_error "GitHub CLI is not authenticated"
        echo "Run: gh auth login"
        exit 1
    fi
    
    if ! command -v git &> /dev/null; then
        print_error "Git is not installed"
        exit 1
    fi
    
    print_success "All dependencies satisfied"
}

#===============================================================================
# Parse Arguments
#===============================================================================

CUSTOMER_NAME=""
DOMAIN=""
PRIVATE_REPO=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --domain)
            DOMAIN="$2"
            shift 2
            ;;
        --private)
            PRIVATE_REPO=true
            shift
            ;;
        --org)
            GITHUB_ORG="$2"
            shift 2
            ;;
        --acr)
            ACR_NAME="$2"
            shift 2
            ;;
        --help)
            usage
            ;;
        -*)
            print_error "Unknown option: $1"
            usage
            ;;
        *)
            if [[ -z "$CUSTOMER_NAME" ]]; then
                CUSTOMER_NAME="$1"
            else
                print_error "Unexpected argument: $1"
                usage
            fi
            shift
            ;;
    esac
done

if [[ -z "$CUSTOMER_NAME" ]]; then
    print_error "Customer name is required"
    usage
fi

# Set default domain if not provided
if [[ -z "$DOMAIN" ]]; then
    DOMAIN="${CUSTOMER_NAME}.example.com"
fi

REPO_NAME="$CUSTOMER_NAME"
REPO_FULL="$GITHUB_ORG/$REPO_NAME"

#===============================================================================
# Main Script
#===============================================================================

print_banner

echo -e "${CYAN}Configuration:${NC}"
echo "  Customer Name: $CUSTOMER_NAME"
echo "  Repository:    $REPO_FULL"
echo "  Domain:        $DOMAIN"
echo "  ACR:           $ACR_NAME"
echo "  Visibility:    $([ "$PRIVATE_REPO" = true ] && echo "Private" || echo "Public")"
echo ""

check_dependencies

# Step 1: Check if repo already exists
print_step "Checking if repository exists..."
if gh repo view "$REPO_FULL" &> /dev/null; then
    print_error "Repository $REPO_FULL already exists!"
    echo "Delete it first or choose a different name."
    exit 1
fi
print_success "Repository name is available"

# Step 2: Create repository from template
print_step "Creating repository from template..."
VISIBILITY_FLAG=""
if [[ "$PRIVATE_REPO" = true ]]; then
    VISIBILITY_FLAG="--private"
else
    VISIBILITY_FLAG="--public"
fi

gh repo create "$REPO_FULL" \
    --template "$GITHUB_ORG/$TEMPLATE_REPO" \
    $VISIBILITY_FLAG \
    --clone=false

print_success "Repository created: https://github.com/$REPO_FULL"

# Wait for GitHub to process
sleep 3

# Step 3: Set repository variables
print_step "Setting repository variables..."

gh variable set CUSTOMER_NAME \
    --repo "$REPO_FULL" \
    --body "$CUSTOMER_NAME"

gh variable set ACR_NAME \
    --repo "$REPO_FULL" \
    --body "$ACR_NAME"

gh variable set DOMAIN \
    --repo "$REPO_FULL" \
    --body "$DOMAIN"

print_success "Variables configured"

# Step 4: Verify branches exist (they should come from template)
print_step "Verifying branches..."
sleep 2

BRANCHES=$(gh api "repos/$REPO_FULL/branches" --jq '.[].name' 2>/dev/null || echo "")
if echo "$BRANCHES" | grep -q "main"; then
    print_success "main branch exists"
else
    print_warning "main branch not found"
fi

if echo "$BRANCHES" | grep -q "dev"; then
    print_success "dev branch exists"
else
    print_warning "dev branch not found - will be created on first push"
fi

if echo "$BRANCHES" | grep -q "staging"; then
    print_success "staging branch exists"
else
    print_warning "staging branch not found - will be created on first push"
fi

# Step 5: Print manual steps
echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Repository setup complete!${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}📋 MANUAL STEPS REQUIRED:${NC}"
echo ""
echo "1. Add repository secrets (Settings → Secrets and variables → Actions):"
echo "   ┌─────────────────┬────────────────────────────────────────┐"
echo "   │ Secret          │ Description                            │"
echo "   ├─────────────────┼────────────────────────────────────────┤"
echo "   │ ACR_USERNAME    │ Azure Container Registry username      │"
echo "   │ ACR_PASSWORD    │ Azure Container Registry password      │"
echo "   │ SWARM_HOST      │ Swarm manager IP address               │"
echo "   │ SWARM_USER      │ SSH username (usually: swarmadmin)     │"
echo "   │ SWARM_SSH_KEY   │ SSH private key for Swarm access       │"
echo "   └─────────────────┴────────────────────────────────────────┘"
echo ""
echo "2. Configure DNS records:"
echo "   ┌──────────────────────────────┬───────┬─────────────────────┐"
echo "   │ Record                       │ Type  │ Value               │"
echo "   ├──────────────────────────────┼───────┼─────────────────────┤"
echo "   │ $DOMAIN                      │ A     │ <SWARM_MANAGER_IP>  │"
echo "   │ dev.$DOMAIN                  │ A     │ <SWARM_MANAGER_IP>  │"
echo "   │ staging.$DOMAIN              │ A     │ <SWARM_MANAGER_IP>  │"
echo "   └──────────────────────────────┴───────┴─────────────────────┘"
echo ""
echo "3. Clone and start development:"
echo "   git clone https://github.com/$REPO_FULL.git"
echo "   cd $REPO_NAME"
echo ""
echo "4. Create database secret on Swarm (if needed):"
echo "   ssh swarmadmin@<SWARM_HOST>"
echo "   echo \"your-db-password\" | docker secret create ${CUSTOMER_NAME}-db-password -"
echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "🔗 Repository: ${GREEN}https://github.com/$REPO_FULL${NC}"
echo -e "📚 Documentation: ${GREEN}https://github.com/$GITHUB_ORG/infra-swarm-platform/docs${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
