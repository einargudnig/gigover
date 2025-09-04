# GitHub Actions CI/CD Setup

This repository now includes comprehensive GitHub Actions workflows for automated testing, building, and deployment across all platforms.

## 🔄 Workflows Overview

### 1. **Main CI/CD Pipeline** (`.github/workflows/main.yml`)
- **Triggers**: Push to `main`/`develop`, Pull Requests
- **Features**:
  - Smart change detection (only builds affected projects)
  - Parallel builds for web, new-frontend, frontend, and functions
  - Automatic staging deployments for PRs
  - Production deployments on main branch

### 2. **Mobile App CI** (`.github/workflows/mobile.yml`)
- **Triggers**: Changes to `app/` directory, releases
- **Features**:
  - Flutter code analysis and testing
  - Android APK/AAB builds
  - iOS builds (on macOS runners)
  - Firebase App Distribution for test builds
  - Automatic store publishing on releases

### 3. **Firebase Functions CI** (`.github/workflows/functions.yml`)
- **Triggers**: Changes to `functions/` directory
- **Features**:
  - TypeScript compilation checks
  - Staging deployments for PRs
  - Production deployments on main
  - Security vulnerability scanning

### 4. **Security & Quality Checks** (`.github/workflows/security.yml`)
- **Triggers**: All pushes/PRs, weekly scheduled scans
- **Features**:
  - Dependency vulnerability scanning
  - CodeQL security analysis
  - Secret scanning with TruffleHog
  - Code quality checks (ESLint, TypeScript, Prettier)
  - Performance budget monitoring

### 5. **Release Management** (`.github/workflows/release.yml`)
- **Triggers**: Manual dispatch, Git tags
- **Features**:
  - Automated version bumping
  - Multi-platform builds
  - Production deployments
  - GitHub release creation with artifacts
  - Team notifications

## 🚀 Getting Started

### Prerequisites
1. Set up required secrets (see [Required Secrets](#required-secrets) below)
2. Configure Firebase projects for staging and production
3. Set up mobile app signing certificates

### Initial Setup
1. **Enable GitHub Actions**: Actions are automatically enabled when workflows are added
2. **Configure Branch Protection**: 
   - Go to Settings → Branches
   - Add protection rules for `main` branch
   - Require status checks to pass
   - Require pull request reviews

3. **Set up Environments**:
   - Go to Settings → Environments
   - Create `staging` and `production` environments
   - Configure required reviewers for production

## 🔐 Required Secrets

Configure these secrets in your GitHub repository (Settings → Secrets and variables → Actions):

### Firebase Secrets
```
FIREBASE_SERVICE_ACCOUNT_STAGING      # Firebase service account for staging
FIREBASE_SERVICE_ACCOUNT_PRODUCTION   # Firebase service account for production
FIREBASE_PROJECT_ID_STAGING           # Staging project ID
FIREBASE_PROJECT_ID_PRODUCTION        # Production project ID
FIREBASE_TOKEN                        # Firebase CLI token
FIREBASE_ANDROID_APP_ID               # Android app ID for App Distribution
FIREBASE_IOS_APP_ID                   # iOS app ID for App Distribution
```

### Mobile App Signing
```
# Android
ANDROID_KEYSTORE_BASE64               # Base64 encoded keystore file
ANDROID_KEYSTORE_PASSWORD             # Keystore password
ANDROID_KEY_PASSWORD                  # Key password
ANDROID_KEY_ALIAS                     # Key alias

# iOS
IOS_CERTIFICATE_BASE64                # Base64 encoded certificate
IOS_CERTIFICATE_PASSWORD              # Certificate password
IOS_PROVISIONING_PROFILE_BASE64       # Base64 encoded provisioning profile
IOS_KEYCHAIN_PASSWORD                 # Keychain password

# App Store Connect
APPSTORE_ISSUER_ID                    # App Store Connect issuer ID
APPSTORE_API_KEY_ID                   # API key ID
APPSTORE_API_PRIVATE_KEY              # Private key content
```

### Google Play Console
```
GOOGLE_PLAY_SERVICE_ACCOUNT_JSON      # Service account JSON for Play Console
```

## 🌊 Workflow Triggers

### Automatic Triggers
- **Push to main**: Full CI/CD pipeline + production deployment
- **Push to develop**: Full CI/CD pipeline (no deployment)
- **Pull Requests**: CI checks + staging deployment
- **File changes**: Smart detection runs only relevant workflows
- **Weekly schedule**: Security scans (Sundays 2 AM UTC)

### Manual Triggers
- **Release Creation**: Go to Actions → Release Management → Run workflow
- **Emergency Deployment**: Re-run any workflow from the Actions tab

## 📱 Mobile App Deployment

### Development Builds
- **Automatic**: Built on every push to main
- **Distribution**: Automatically distributed via Firebase App Distribution
- **Testing**: Available to "testers" group in Firebase

### Release Builds
- **Trigger**: Create a Git tag (e.g., `v1.2.3`)
- **Android**: Uploads to Google Play Console as draft
- **iOS**: Uploads to TestFlight for review

### Creating a Release
```bash
# Create and push a tag
git tag v1.2.3
git push origin v1.2.3

# Or use the GitHub UI to create a release
```

## 🔍 Monitoring & Debugging

### Workflow Status
- Check the Actions tab in your GitHub repository
- Green checkmarks indicate successful runs
- Red X marks indicate failures (click for details)

### Common Issues
1. **Secrets not configured**: Check secrets are set correctly
2. **Firebase permissions**: Ensure service accounts have proper roles
3. **Mobile signing**: Verify certificates and provisioning profiles
4. **Build failures**: Check logs in the specific job that failed

### Notifications
- Failed workflows automatically notify via GitHub
- Successful releases include team notifications
- Security issues generate weekly reports

## 🛠 Customization

### Adding New Projects
1. Update the matrix strategy in relevant workflows
2. Add new paths to change detection filters
3. Configure Firebase hosting if needed

### Modifying Build Steps
- Edit the workflow files in `.github/workflows/`
- Test changes on a feature branch first
- Use `workflow_dispatch` for manual testing

### Environment-Specific Configs
- Use GitHub environments for different deployment targets
- Configure different secrets per environment
- Set up approval requirements for production

## 📊 Performance Optimization

### Build Caching
- Node.js dependencies are cached automatically
- Flutter dependencies are cached
- Build artifacts are cached between jobs

### Parallel Execution
- Projects build in parallel when possible
- Matrix strategies maximize runner efficiency
- Smart change detection reduces unnecessary builds

### Resource Usage
- Ubuntu runners for most jobs (faster, cheaper)
- macOS runners only for iOS builds (required)
- Artifact retention policies to manage storage

## 🔄 Maintenance

### Regular Tasks
- Review security scan reports weekly
- Update dependency versions quarterly
- Rotate secrets annually
- Monitor build performance monthly

### Upgrading Workflows
- GitHub Actions versions are pinned for stability
- Update action versions in a coordinated manner
- Test workflow changes thoroughly before merging

---

## 🚨 Important Notes

1. **First Run**: Initial workflow runs may fail due to missing secrets - this is expected
2. **iOS Builds**: Require macOS runners and Apple Developer account setup
3. **Firebase Projects**: Must be created and configured before deployments work
4. **Branch Protection**: Highly recommended to prevent bypassing CI checks
5. **Secrets Security**: Never commit secrets to the repository - use GitHub secrets only

For support or questions about the CI/CD setup, check the workflow logs or create an issue in the repository.