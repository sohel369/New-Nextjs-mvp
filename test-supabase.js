#!/usr/bin/env node

/**
 * Supabase Connection Test Script
 * 
 * This script tests the Supabase connection using environment variables from .env.local
 * 
 * Usage:
 *   node test-supabase.js
 * 
 * Requirements:
 *   - .env.local file with Supabase credentials
 *   - npm install dotenv @supabase/supabase-js (if not already installed)
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'cyan');
}

function logHeader(message) {
  console.log('\n' + '='.repeat(60));
  log(message, 'bold');
  console.log('='.repeat(60) + '\n');
}

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function testSupabaseConnection() {
  logHeader('Supabase Connection Test');
  
  // Step 1: Check environment variables
  logInfo('Step 1: Checking environment variables...');
  
  if (!supabaseUrl) {
    logError('NEXT_PUBLIC_SUPABASE_URL is not set in .env.local');
    return false;
  }
  logSuccess(`Supabase URL found: ${supabaseUrl}`);
  
  if (!supabaseAnonKey) {
    logError('NEXT_PUBLIC_SUPABASE_ANON_KEY is not set in .env.local');
    return false;
  }
  logSuccess(`Supabase Anon Key found: ${supabaseAnonKey.substring(0, 20)}...`);
  
  if (!supabaseServiceKey) {
    logWarning('SUPABASE_SERVICE_ROLE_KEY is not set (optional for basic tests)');
  } else {
    logSuccess(`Supabase Service Key found: ${supabaseServiceKey.substring(0, 20)}...`);
  }
  
  // Step 2: Initialize Supabase client
  logInfo('\nStep 2: Initializing Supabase client...');
  
  let supabase;
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
      }
    });
    logSuccess('Supabase client created successfully');
  } catch (error) {
    logError(`Failed to create Supabase client: ${error.message}`);
    return false;
  }
  
  // Step 3: Test basic connection
  logInfo('\nStep 3: Testing basic connection...');
  
  try {
    // Test if we can reach Supabase
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(0);
    
    if (error) {
      // If it's a permission error, the connection is working but RLS might be blocking
      if (error.code === 'PGRST116' || error.message.includes('no rows')) {
        logSuccess('Connection successful (table exists, no rows returned - expected)');
      } else if (error.code === '42501' || error.message.includes('permission')) {
        logWarning('Connection successful but RLS policies may be blocking access');
        logInfo(`Error details: ${error.message}`);
      } else if (error.code === '42P01' || error.message.includes('does not exist')) {
        logError(`Table 'profiles' does not exist: ${error.message}`);
        logInfo('Please create the profiles table in your Supabase database');
      } else {
        logError(`Connection test failed: ${error.message}`);
        logInfo(`Error code: ${error.code || 'N/A'}`);
        logInfo(`Error details: ${JSON.stringify(error, null, 2)}`);
      }
    } else {
      logSuccess('Basic connection test passed');
    }
  } catch (error) {
    logError(`Connection test failed with exception: ${error.message}`);
    return false;
  }
  
  // Step 4: Test authentication
  logInfo('\nStep 4: Testing authentication system...');
  
  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      logWarning(`Session check: ${sessionError.message} (expected if not logged in)`);
    } else {
      if (sessionData.session) {
        logSuccess(`Active session found for user: ${sessionData.session.user.email || sessionData.session.user.id}`);
      } else {
        logInfo('No active session (expected for test script)');
      }
    }
  } catch (error) {
    logWarning(`Auth test failed: ${error.message}`);
  }
  
  // Step 5: Test table access
  logInfo('\nStep 5: Testing table access...');
  
  const tablesToTest = ['profiles', 'users', 'quiz_history'];
  
  for (const tableName of tablesToTest) {
    try {
      logInfo(`Testing table: ${tableName}...`);
      
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1)
        .maybeSingle();
      
      if (error) {
        if (error.code === '42P01') {
          logWarning(`Table '${tableName}' does not exist`);
        } else if (error.code === '42501') {
          logWarning(`Table '${tableName}' exists but RLS is blocking access`);
        } else if (error.code === 'PGRST116') {
          logSuccess(`Table '${tableName}' exists and is accessible (no rows found)`);
        } else {
          logWarning(`Table '${tableName}' access issue: ${error.message}`);
        }
      } else {
        logSuccess(`Table '${tableName}' is accessible`);
        if (data) {
          logInfo(`  Sample data found: ${JSON.stringify(data, null, 2).substring(0, 100)}...`);
        }
      }
    } catch (error) {
      logWarning(`Error testing table '${tableName}': ${error.message}`);
    }
  }
  
  // Step 6: Test with service role key (if available)
  if (supabaseServiceKey) {
    logInfo('\nStep 6: Testing with service role key...');
    
    try {
      const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      });
      
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('count')
        .limit(0);
      
      if (error) {
        if (error.code === '42P01') {
          logWarning('Service role: Table does not exist');
        } else {
          logWarning(`Service role test: ${error.message}`);
        }
      } else {
        logSuccess('Service role key works correctly');
      }
    } catch (error) {
      logWarning(`Service role test failed: ${error.message}`);
    }
  }
  
  // Step 7: Test connection health
  logInfo('\nStep 7: Testing connection health...');
  
  try {
    const startTime = Date.now();
    const { error } = await supabase
      .from('profiles')
      .select('count')
      .limit(0);
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    if (responseTime < 500) {
      logSuccess(`Connection is fast (${responseTime}ms)`);
    } else if (responseTime < 2000) {
      logWarning(`Connection is slow (${responseTime}ms)`);
    } else {
      logError(`Connection is very slow (${responseTime}ms)`);
    }
  } catch (error) {
    logWarning(`Health check failed: ${error.message}`);
  }
  
  // Summary
  logHeader('Test Summary');
  logSuccess('Supabase connection test completed!');
  logInfo('\nIf you see any errors:');
  logInfo('1. Check that your .env.local file has the correct credentials');
  logInfo('2. Verify your Supabase project is active');
  logInfo('3. Check RLS policies if you see permission errors');
  logInfo('4. Ensure tables exist in your Supabase database');
  
  return true;
}

// Run the test
testSupabaseConnection()
  .then((success) => {
    if (success) {
      log('\n✅ All tests completed', 'green');
      process.exit(0);
    } else {
      log('\n❌ Some tests failed', 'red');
      process.exit(1);
    }
  })
  .catch((error) => {
    logError(`\nFatal error: ${error.message}`);
    console.error(error);
    process.exit(1);
  });

