'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Check, X, AlertCircle, User, Mail, Globe } from 'lucide-react';

export default function TestUserDataPage() {
  const { user, loading } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadProfileData();
    }
  }, [user]);

  const loadProfileData = async () => {
    if (!user) return;
    
    setLoadingProfile(true);
    setError(null);
    
    try {
      // Try profiles table first
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profilesError && profilesError.code !== 'PGRST116') {
        console.log('Profiles table failed, trying users table:', profilesError.message);
        
        // Fallback: users table
        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (usersError) {
          setError(`Error loading profile: ${usersError.message}`);
        } else {
          setProfileData(usersData);
        }
      } else {
        setProfileData(profilesData);
      }
    } catch (err) {
      setError(`Unexpected error: ${err instanceof Error ? err.message : 'Unknown'}`);
    } finally {
      setLoadingProfile(false);
    }
  };

  const testProfileUpdate = async () => {
    if (!user) return;
    
    try {
      const testName = `Test User ${Date.now()}`;
      
      // Try to update profiles table first
      const { error: profilesError } = await supabase
        .from('profiles')
        .update({ name: testName })
        .eq('id', user.id);

      if (profilesError) {
        console.log('Profiles table failed, trying users table:', profilesError.message);
        
        // Fallback: users table
        const { error: usersError } = await supabase
          .from('users')
          .update({ name: testName })
          .eq('id', user.id);
        
        if (usersError) {
          setError(`Error updating profile: ${usersError.message}`);
        } else {
          alert('Profile updated successfully!');
          loadProfileData(); // Reload data
        }
      } else {
        alert('Profile updated successfully!');
        loadProfileData(); // Reload data
      }
    } catch (err) {
      setError(`Error updating profile: ${err instanceof Error ? err.message : 'Unknown'}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading authentication...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <X className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Not Authenticated</h1>
          <p className="text-white/70 mb-4">Please sign in to test user data functionality.</p>
          <a href="/auth/login" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">User Data Test</h1>
          <p className="text-white/70">Testing user data flow from authentication to database</p>
        </div>

        {/* Auth User Data */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <User className="w-6 h-6 mr-2" />
            Authentication Data
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-1">User ID</label>
              <span className="text-white text-sm font-mono">{user.id}</span>
            </div>
            <div>
              <label className="block text-white/80 text-sm font-medium mb-1">Email</label>
              <span className="text-white">{user.email}</span>
            </div>
            <div>
              <label className="block text-white/80 text-sm font-medium mb-1">Name</label>
              <span className="text-white">{user.name}</span>
            </div>
            <div>
              <label className="block text-white/80 text-sm font-medium mb-1">Level</label>
              <span className="text-white">{user.level}</span>
            </div>
            <div>
              <label className="block text-white/80 text-sm font-medium mb-1">Total XP</label>
              <span className="text-white">{user.total_xp}</span>
            </div>
            <div>
              <label className="block text-white/80 text-sm font-medium mb-1">Streak</label>
              <span className="text-white">{user.streak}</span>
            </div>
            <div>
              <label className="block text-white/80 text-sm font-medium mb-1">Learning Language</label>
              <span className="text-white">{user.learning_language || 'Not set'}</span>
            </div>
            <div>
              <label className="block text-white/80 text-sm font-medium mb-1">Native Language</label>
              <span className="text-white">{user.native_language || 'Not set'}</span>
            </div>
          </div>
        </div>

        {/* Database Profile Data */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <Mail className="w-6 h-6 mr-2" />
              Database Profile Data
            </h2>
            <button
              onClick={loadProfileData}
              disabled={loadingProfile}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {loadingProfile ? 'Loading...' : 'Refresh'}
            </button>
          </div>
          
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-2 text-red-400">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {loadingProfile ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
              <p className="text-white/70">Loading profile data...</p>
            </div>
          ) : profileData ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-1">ID</label>
                <span className="text-white text-sm font-mono">{profileData.id}</span>
              </div>
              <div>
                <label className="block text-white/80 text-sm font-medium mb-1">Name</label>
                <span className="text-white">{profileData.name}</span>
              </div>
              <div>
                <label className="block text-white/80 text-sm font-medium mb-1">Email</label>
                <span className="text-white">{profileData.email}</span>
              </div>
              <div>
                <label className="block text-white/80 text-sm font-medium mb-1">Level</label>
                <span className="text-white">{profileData.level}</span>
              </div>
              <div>
                <label className="block text-white/80 text-sm font-medium mb-1">Total XP</label>
                <span className="text-white">{profileData.total_xp}</span>
              </div>
              <div>
                <label className="block text-white/80 text-sm font-medium mb-1">Streak</label>
                <span className="text-white">{profileData.streak}</span>
              </div>
              <div>
                <label className="block text-white/80 text-sm font-medium mb-1">Learning Language</label>
                <span className="text-white">
                  {profileData.learning_language || profileData.learning_languages?.[0] || 'Not set'}
                </span>
              </div>
              <div>
                <label className="block text-white/80 text-sm font-medium mb-1">Native Language</label>
                <span className="text-white">
                  {profileData.native_language || profileData.base_language || 'Not set'}
                </span>
              </div>
              <div>
                <label className="block text-white/80 text-sm font-medium mb-1">Created At</label>
                <span className="text-white text-sm">
                  {profileData.created_at ? new Date(profileData.created_at).toLocaleString() : 'Not available'}
                </span>
              </div>
              <div>
                <label className="block text-white/80 text-sm font-medium mb-1">Updated At</label>
                <span className="text-white text-sm">
                  {profileData.updated_at ? new Date(profileData.updated_at).toLocaleString() : 'Not available'}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <p className="text-white/70">No profile data found in database</p>
              <p className="text-white/50 text-sm mt-2">
                This might happen if the user profile wasn't created during signup
              </p>
            </div>
          )}
        </div>

        {/* Test Actions */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Globe className="w-6 h-6 mr-2" />
            Test Actions
          </h2>
          
          <div className="space-y-4">
            <button
              onClick={testProfileUpdate}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Test Profile Update
            </button>
            
            <div className="text-white/70 text-sm">
              <p>This will update your profile name with a timestamp to test database connectivity.</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 text-center">
          <a href="/profile" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors mr-4">
            Go to Profile
          </a>
          <a href="/dashboard" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors">
            Go to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
