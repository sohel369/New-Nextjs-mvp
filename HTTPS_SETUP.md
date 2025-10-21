# HTTPS Setup for Microphone Access

## Problem
Microphone access requires HTTPS or localhost. The app works on `http://localhost:3000` but not on `http://10.197.0.251:3000` because network IPs require HTTPS for microphone access.

## Solutions

### Option 1: Use HTTPS (Recommended)
1. **For Development with HTTPS:**
   ```bash
   # Install mkcert for local HTTPS certificates
   npm install -g mkcert
   
   # Create local CA
   mkcert -install
   
   # Generate certificates for your IP
   mkcert 10.197.0.251 localhost 127.0.0.1
   
   # This creates:
   # - 10.197.0.251+2.pem
   # - 10.197.0.251+2-key.pem
   ```

2. **Update package.json:**
   ```json
   {
     "scripts": {
       "dev": "next dev --turbopack",
       "dev:https": "next dev --turbopack --experimental-https --experimental-https-key ./10.197.0.251+2-key.pem --experimental-https-cert ./10.197.0.251+2.pem"
     }
   }
   ```

3. **Run with HTTPS:**
   ```bash
   npm run dev:https
   ```

4. **Access via:** `https://10.197.0.251:3000`

### Option 2: Use ngrok (Quick Solution)
1. **Install ngrok:**
   ```bash
   npm install -g ngrok
   ```

2. **Run your app:**
   ```bash
   npm run dev
   ```

3. **In another terminal, create HTTPS tunnel:**
   ```bash
   ngrok http 3000
   ```

4. **Use the HTTPS URL provided by ngrok**

### Option 3: Browser Settings (Temporary)
1. **Chrome:** Add `--unsafely-treat-insecure-origin-as-secure=http://10.197.0.251:3000` to Chrome flags
2. **Not recommended for production**

## Why This Happens
- Browsers require HTTPS for microphone access on non-localhost domains
- This is a security feature to prevent malicious websites from accessing your microphone
- localhost is considered "secure" by browsers even over HTTP

## Production Deployment
For production, always use HTTPS with a proper SSL certificate from Let's Encrypt or your hosting provider.
