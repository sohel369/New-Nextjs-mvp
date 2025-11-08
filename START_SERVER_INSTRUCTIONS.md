# 🚀 Start Development Server

## The Problem
"fetch failed" error means your Next.js development server is **not running**.

## The Solution

### Option 1: Start Server in Terminal (Recommended)

1. **Open a terminal** in your project folder
2. **Run this command**:
   ```bash
   npm run dev
   ```

3. **Wait for it to start** - You should see:
   ```
   ✓ Ready in X.Xs
   ○ Local: http://localhost:3000
   ```

4. **Check for Supabase initialization** - Look for:
   ```
   [signup-api] ✅ Supabase admin client initialized with URL: https://uaijcvhvyurbnfmkqnqt.supabase.co
   ```

5. **Try signup again** - The server should now be running

### Option 2: Check if Server is Already Running

1. **Open your browser** and go to: http://localhost:3000
2. **If the page loads** - Server is running, try signup again
3. **If the page doesn't load** - Server is not running, start it with Option 1

## Verify Server is Running

After starting the server, you should be able to:
- ✅ Access http://localhost:3000 in your browser
- ✅ See your app's homepage
- ✅ Try signing up without "fetch failed" error

## Common Issues

### Port 3000 Already in Use
If you get an error about port 3000 being in use:
```bash
# Use a different port
npm run dev -- -p 3001
```
Then access: http://localhost:3001

### Server Crashes on Start
1. Check terminal for error messages
2. Make sure `.env` file exists in project root
3. Verify Node.js is installed: `node --version`
4. Try reinstalling dependencies: `npm install`

## Next Steps After Server Starts

1. ✅ Server is running
2. ✅ Set up database tables (run `database/SETUP_PROFILES_TABLE.sql` in Supabase)
3. ✅ Try signup again

