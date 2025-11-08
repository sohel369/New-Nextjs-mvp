'use client';

import React, { useState } from 'react';
import { useNotificationDemo } from '../hooks/useNotificationDemo';
import { Zap, ZapOff } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Demo button component to enable/disable notification demo mode
 * Place this anywhere in your dashboard to test notifications
 */
export function NotificationDemoButton() {
  const [demoEnabled, setDemoEnabled] = useState(false);
  useNotificationDemo(demoEnabled, 60); // 60 second intervals

  return (
    <motion.button
      onClick={() => setDemoEnabled(!demoEnabled)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`fixed bottom-24 right-4 z-40 flex items-center gap-2 px-4 py-2 rounded-full shadow-lg transition-all ${
        demoEnabled
          ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
          : 'bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 text-white'
      }`}
      title={demoEnabled ? 'Disable demo mode' : 'Enable demo mode (notifications every 60s)'}
    >
      {demoEnabled ? (
        <>
          <Zap className="w-4 h-4" />
          <span className="text-sm font-medium">Demo ON</span>
        </>
      ) : (
        <>
          <ZapOff className="w-4 h-4" />
          <span className="text-sm font-medium">Demo OFF</span>
        </>
      )}
    </motion.button>
  );
}

