# Build and Deployment Guide

## Fixing Deprecated Dependency Warnings

This project uses npm overrides to force modern versions of deprecated packages used by `next-pwa` and Workbox:

- `sourcemap-codec` → `@jridgewell/sourcemap-codec`
- `rollup-plugin-terser` → `@rollup/plugin-terser`
- `rimraf` → v5.0.5+
- `glob` → v10.3.10+ (which no longer depends on `inflight`)

## Available Scripts

### Development
```bash
npm run dev              # Start development server with Turbopack
npm run build:dev        # Build for development
```

### Production Build
```bash
npm run build            # Standard production build
npm run build:pwa        # Production build with PWA enabled
npm run build:vercel     # Build optimized for Vercel
```

### Vercel Deployment
```bash
# Standard deployment (uses build cache)
npm run vercel:deploy

# Force deployment without cache
npm run vercel:deploy:force

# Build locally for Vercel
npm run vercel:build
```

### Clear Build Cache

#### On Vercel Dashboard:
1. Go to your project settings
2. Navigate to "General" → "Build & Development Settings"
3. Use the "Clear Build Cache" button

#### Using Environment Variable:
Set `VERCEL_FORCE_NO_BUILD_CACHE=1` in your Vercel project environment variables (Dashboard → Settings → Environment Variables).

For local testing:
- **Windows PowerShell**: `$env:VERCEL_FORCE_NO_BUILD_CACHE="1"; npm run build`
- **macOS/Linux**: `VERCEL_FORCE_NO_BUILD_CACHE=1 npm run build`
- Or use: `npm run build:vercel:force` (may need `cross-env` package for Windows)

#### Clean Installation (Cross-platform):
```bash
# Windows PowerShell
Remove-Item -Recurse -Force node_modules,package-lock.json -ErrorAction SilentlyContinue; npm install

# macOS/Linux
rm -rf node_modules package-lock.json && npm install

# Or use the npm script (may need adjustment for Windows)
npm run clean:install
```

## Dependency Warnings

### Expected Warnings (Safe to Ignore)
Some deprecated package warnings may still appear during installation, particularly for `inflight`, which is a transitive dependency of older packages. These warnings are informational and won't affect functionality. The npm overrides ensure that modern packages are used wherever possible.

### If Warnings Persist
1. Clear npm cache: `npm cache clean --force`
2. Delete `node_modules` and `package-lock.json`
3. Run `npm install` fresh
4. If issues continue, check `package-lock.json` for any packages that aren't respecting overrides

## Vercel Build Configuration

The `vercel.json` file configures:
- Build command: `npm run build:vercel`
- Install command: `npm install`
- Framework: Next.js
- Region: `iad1` (US East)

To use a different region or modify settings, edit `vercel.json`.

## Troubleshooting

### Build Fails with Dependency Errors
1. Ensure Node.js version matches `.nvmrc` or package.json engines (if specified)
2. Run `npm run clean:install` to get a fresh dependency tree
3. Check that npm version is 9+ (required for overrides support)

### Deprecated Package Warnings in Build Logs
- Most warnings are informational and can be safely ignored
- The overrides in `package.json` handle the critical deprecated packages
- If a specific warning is blocking deployment, add it to the overrides section

### Build Cache Issues
- Use `VERCEL_FORCE_NO_BUILD_CACHE=1` environment variable
- Or run `npm run vercel:deploy:force` from local machine
- Clear cache in Vercel dashboard under project settings

## Next Steps

After running `npm install`, verify the build works:
```bash
npm run build
```

If successful, the build should complete without critical errors. Deprecated package warnings may still appear but won't block deployment.

