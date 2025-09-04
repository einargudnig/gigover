# GitHub Secrets Setup Guide

This guide provides step-by-step instructions for configuring all required secrets for the GitHub Actions workflows.

## 🔐 Accessing GitHub Secrets

1. Go to your repository on GitHub
2. Click **Settings** (in the repository, not your account)
3. Click **Secrets and variables** → **Actions**
4. Click **New repository secret** to add each secret

## 🔥 Firebase Configuration

### 1. Firebase Service Accounts

**For staging and production environments:**

```bash
# Generate service account key files
firebase projects:list
firebase use your-staging-project-id
firebase iam:get-service-accounts

# Download the service account JSON files from Firebase Console
# Go to Project Settings → Service Accounts → Generate new private key
```

**Required Secrets:**
- `FIREBASE_SERVICE_ACCOUNT_STAGING`: Contents of staging service account JSON
- `FIREBASE_SERVICE_ACCOUNT_PRODUCTION`: Contents of production service account JSON
- `FIREBASE_PROJECT_ID_STAGING`: Your staging project ID (e.g., `gigover-staging`)
- `FIREBASE_PROJECT_ID_PRODUCTION`: Your production project ID (e.g., `gigover-prod`)

### 2. Firebase CLI Token

```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login and generate token
firebase login:ci

# Copy the token that's generated
```

**Required Secret:**
- `FIREBASE_TOKEN`: The token from the command above

### 3. Firebase App Distribution IDs

Get these from Firebase Console → App Distribution:

**Required Secrets:**
- `FIREBASE_ANDROID_APP_ID`: Android app ID (format: `1:123456789:android:abc123`)
- `FIREBASE_IOS_APP_ID`: iOS app ID (format: `1:123456789:ios:def456`)

## 📱 Android App Signing

### 1. Generate/Export Keystore

If you don't have a keystore:
```bash
keytool -genkey -v -keystore gigover-release-key.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias gigover-key
```

If you have an existing keystore, use that file.

### 2. Convert Keystore to Base64

```bash
# Convert keystore to base64
base64 -i gigover-release-key.jks -o keystore.txt

# Copy the contents of keystore.txt
cat keystore.txt
```

**Required Secrets:**
- `ANDROID_KEYSTORE_BASE64`: Base64 content from above
- `ANDROID_KEYSTORE_PASSWORD`: Password for the keystore file
- `ANDROID_KEY_PASSWORD`: Password for the key (might be same as keystore)
- `ANDROID_KEY_ALIAS`: Key alias (e.g., `gigover-key`)

## 🍎 iOS App Signing

### 1. Export Development Certificate

From Keychain Access on macOS:
1. Find your iOS Development/Distribution certificate
2. Right-click → Export → Save as .p12 file
3. Set a password when prompted

### 2. Convert Certificate to Base64

```bash
# Convert certificate to base64
base64 -i certificate.p12 -o certificate.txt
cat certificate.txt
```

### 3. Export Provisioning Profile

1. Go to Apple Developer Portal → Certificates, IDs & Profiles
2. Download your provisioning profile (.mobileprovision file)
3. Convert to base64:

```bash
base64 -i profile.mobileprovision -o profile.txt
cat profile.txt
```

**Required Secrets:**
- `IOS_CERTIFICATE_BASE64`: Base64 content of .p12 certificate
- `IOS_CERTIFICATE_PASSWORD`: Password set when exporting certificate
- `IOS_PROVISIONING_PROFILE_BASE64`: Base64 content of .mobileprovision
- `IOS_KEYCHAIN_PASSWORD`: Any secure password (used for temporary keychain)

## 🏪 App Store Connect API

### 1. Create API Key

1. Go to App Store Connect → Users and Access → Keys
2. Click the "+" button to create a new API key
3. Give it "Developer" role
4. Download the .p8 file

### 2. Get API Key Information

**Required Secrets:**
- `APPSTORE_ISSUER_ID`: Found in Users and Access → Keys (Issuer ID at the top)
- `APPSTORE_API_KEY_ID`: The Key ID from the API key you created
- `APPSTORE_API_PRIVATE_KEY`: Contents of the .p8 file

```bash
# Get the contents of the .p8 file
cat AuthKey_XXXXXXXXXX.p8
```

## 🤖 Google Play Console

### 1. Create Service Account

1. Go to Google Cloud Console for your project
2. IAM & Admin → Service Accounts → Create Service Account
3. Grant "Service Account User" role
4. Create and download JSON key

### 2. Link to Play Console

1. Go to Google Play Console → Setup → API access
2. Link the service account you created
3. Grant necessary permissions (at minimum: "Release to testing tracks")

**Required Secret:**
- `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON`: Contents of the JSON file

## ✅ Verification Checklist

After adding all secrets, verify they're correctly configured:

### Firebase Secrets ✓
- [ ] `FIREBASE_SERVICE_ACCOUNT_STAGING`
- [ ] `FIREBASE_SERVICE_ACCOUNT_PRODUCTION`
- [ ] `FIREBASE_PROJECT_ID_STAGING`
- [ ] `FIREBASE_PROJECT_ID_PRODUCTION`
- [ ] `FIREBASE_TOKEN`
- [ ] `FIREBASE_ANDROID_APP_ID`
- [ ] `FIREBASE_IOS_APP_ID`

### Android Secrets ✓
- [ ] `ANDROID_KEYSTORE_BASE64`
- [ ] `ANDROID_KEYSTORE_PASSWORD`
- [ ] `ANDROID_KEY_PASSWORD`
- [ ] `ANDROID_KEY_ALIAS`

### iOS Secrets ✓
- [ ] `IOS_CERTIFICATE_BASE64`
- [ ] `IOS_CERTIFICATE_PASSWORD`
- [ ] `IOS_PROVISIONING_PROFILE_BASE64`
- [ ] `IOS_KEYCHAIN_PASSWORD`

### App Store Secrets ✓
- [ ] `APPSTORE_ISSUER_ID`
- [ ] `APPSTORE_API_KEY_ID`
- [ ] `APPSTORE_API_PRIVATE_KEY`

### Google Play Secrets ✓
- [ ] `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON`

## 🚨 Security Best Practices

1. **Never commit secrets to code**: Always use GitHub secrets
2. **Rotate secrets regularly**: Update certificates and keys annually
3. **Limit permissions**: Give service accounts minimal required permissions
4. **Monitor access**: Review who has access to secrets regularly
5. **Use separate environments**: Different secrets for staging/production

## 🐛 Common Issues

### Firebase Issues
- **Permission denied**: Check service account has necessary Firebase roles
- **Project not found**: Verify project IDs are correct
- **Token expired**: Regenerate Firebase CLI token

### Android Issues
- **Keystore errors**: Verify base64 encoding is correct (no line breaks)
- **Wrong passwords**: Double-check keystore and key passwords
- **Alias not found**: Ensure key alias matches exactly

### iOS Issues
- **Certificate invalid**: Check certificate hasn't expired
- **Profile mismatch**: Ensure provisioning profile matches bundle ID
- **Keychain issues**: iOS keychain password is just for temporary keychain

### Testing Secrets
Test your secrets configuration by:
1. Creating a test branch
2. Making a small change to trigger workflows
3. Checking the Actions tab for any secret-related errors

---

## 📞 Getting Help

If you encounter issues:
1. Check the specific workflow logs in the Actions tab
2. Verify secret names match exactly (case-sensitive)
3. Ensure all required secrets are present
4. Check that service accounts have proper permissions

Remember: It's normal for the first workflow runs to fail until all secrets are properly configured!