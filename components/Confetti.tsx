'use client';

import { useEffect, useState } from 'react';

interface ConfettiProps {
  show: boolean;
  duration?: number;
}

export default function Confetti({ show, duration = 3000 }: ConfettiProps) {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    color: string;
    size: number;
    rotation: number;
    velocity: { x: number; y: number };
  }>>([]);

  useEffect(() => {
    if (show) {
      // Create confetti particles
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -10,
        color: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'][Math.floor(Math.random() * 6)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        velocity: {
          x: (Math.random() - 0.5) * 4,
          y: Math.random() * 3 + 2
        }
      }));
      
      setParticles(newParticles);

      // Animate particles
      const animate = () => {
        setParticles(prev => 
          prev.map(particle => ({
            ...particle,
            x: particle.x + particle.velocity.x,
            y: particle.y + particle.velocity.y,
            rotation: particle.rotation + 5,
            velocity: {
              x: particle.velocity.x * 0.99,
              y: particle.velocity.y + 0.1
            }
          })).filter(particle => particle.y < window.innerHeight + 50)
        );
      };

      const interval = setInterval(animate, 16);
      
      setTimeout(() => {
        clearInterval(interval);
        setParticles([]);
      }, duration);

      return () => clearInterval(interval);
    }
  }, [show, duration]);

  if (!show || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            transform: `rotate(${particle.rotation}deg)`,
            transition: 'all 0.1s ease-out'
          }}
        />
      ))}
    </div>
  );
}
