# GitHub OAuth Setup Guide for Suburban Gardener

## Simplified Setup - GitHub Only

This setup uses only GitHub OAuth for simplicity and ease of configuration.

### 1. GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the details:
   - **Application name**: "Suburban Gardener"
   - **Homepage URL**: `http://localhost:3000` (development) or your domain
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
4. Click "Register application"
5. Copy the **Client ID** and generate a **Client Secret**
6. Add these to your `.env.local` file

### 2. Generate NEXTAUTH_SECRET

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

Copy the output and replace `your-secret-key-here-change-this-in-production` in `.env.local`

### 3. Environment Variables

Update your `.env.local` file with:

```bash
# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=Tsh/ow8FyYZdIaIEHHNGgWKGIIKRAnN5WQ+b/f6sMVI=

# GitHub OAuth
GITHUB_CLIENT_ID=Ov23liqyjshjOMKAj089
GITHUB_CLIENT_SECRET=9c5b68523c8fe33633e10fd893c635c161961ef4
```

### 4. Production Setup

For production, update your GitHub OAuth app with:

- **Homepage URL**: `https://suburbangardener.ca`
- **Authorization callback URL**: `https://suburbangardener.ca/api/auth/callback/github`
- **NEXTAUTH_URL**: `https://suburbangardener.ca`

## What's Been Updated

- ✅ NextAuth.js configured with GitHub OAuth only
- ✅ Simplified login page with single GitHub button
- ✅ Dashboard updated to use NextAuth session
- ✅ Auth context updated to use NextAuth
- ✅ Protected routes updated
- ✅ Register page removed (OAuth handles registration)
- ✅ TypeScript types configured
- ✅ Environment variables simplified

## Testing

1. Set up your GitHub OAuth app following steps above
2. Add the credentials to `.env.local`
3. Generate and add `NEXTAUTH_SECRET`
4. Run `npm run dev`
5. Navigate to `/login`
6. Click "Continue with GitHub"
7. Complete OAuth flow
8. You should be redirected to `/dashboard`

## Benefits of GitHub-Only OAuth

- ✅ Simpler setup (only one provider to configure)
- ✅ GitHub has excellent developer tooling
- ✅ No Google Cloud setup required
- ✅ Most developers already have GitHub accounts
- ✅ Secure and reliable authentication
- ✅ Automatic user registration and profile data

Your authentication is now streamlined with just GitHub OAuth!
