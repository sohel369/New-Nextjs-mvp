// Enhanced Confetti Animation Component for Quiz System
// Multiple confetti types and customizable animations

import React, { useEffect, useRef } from 'react';

interface ConfettiProps {
  show: boolean;
  type?: 'celebration' | 'correct' | 'levelup' | 'achievement';
  duration?: number;
  onComplete?: () => void;
}

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
  gravity: number;
  life: number;
}

const QuizConfetti: React.FC<ConfettiProps> = ({ 
  show, 
  type = 'celebration', 
  duration = 3000,
  onComplete 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const confettiRef = useRef<ConfettiPiece[]>([]);
  const startTimeRef = useRef<number>(0);

  // Confetti configurations for different types
  const confettiConfigs = {
    celebration: {
      colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'],
      count: 150,
      gravity: 0.3,
      spread: 360,
      speed: 8
    },
    correct: {
      colors: ['#2ecc71', '#27ae60', '#16a085', '#1abc9c'],
      count: 80,
      gravity: 0.2,
      spread: 180,
      speed: 6
    },
    levelup: {
      colors: ['#f39c12', '#e67e22', '#d35400', '#e74c3c'],
      count: 200,
      gravity: 0.4,
      spread: 360,
      speed: 10
    },
    achievement: {
      colors: ['#9b59b6', '#8e44ad', '#3498db', '#2980b9'],
      count: 120,
      gravity: 0.25,
      spread: 270,
      speed: 7
    }
  };

  // Create confetti pieces
  const createConfetti = (config: typeof confettiConfigs.celebration) => {
    const confetti: ConfettiPiece[] = [];
    const canvas = canvasRef.current;
    if (!canvas) return confetti;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    for (let i = 0; i < config.count; i++) {
      const angle = (Math.random() * config.spread - config.spread / 2) * (Math.PI / 180);
      const speed = Math.random() * config.speed + 2;
      
      confetti.push({
        id: i,
        x: centerX + (Math.random() - 0.5) * 100,
        y: centerY + (Math.random() - 0.5) * 100,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        color: config.colors[Math.floor(Math.random() * config.colors.length)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        gravity: config.gravity,
        life: 1.0
      });
    }

    return confetti;
  };

  // Update confetti animation
  const updateConfetti = (confetti: ConfettiPiece[], deltaTime: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    confetti.forEach(piece => {
      // Update position
      piece.x += piece.vx * deltaTime;
      piece.y += piece.vy * deltaTime;
      
      // Apply gravity
      piece.vy += piece.gravity * deltaTime;
      
      // Update rotation
      piece.rotation += piece.rotationSpeed * deltaTime;
      
      // Fade out over time
      piece.life -= deltaTime * 0.001;
      
      // Bounce off edges
      if (piece.x < 0 || piece.x > canvas.width) {
        piece.vx *= -0.8;
        piece.x = Math.max(0, Math.min(canvas.width, piece.x));
      }
      
      if (piece.y > canvas.height) {
        piece.vy *= -0.6;
        piece.y = canvas.height;
      }
    });

    // Remove dead confetti
    return confetti.filter(piece => piece.life > 0);
  };

  // Draw confetti
  const drawConfetti = (confetti: ConfettiPiece[]) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    confetti.forEach(piece => {
      ctx.save();
      
      // Set opacity based on life
      ctx.globalAlpha = piece.life;
      
      // Move to piece position and rotate
      ctx.translate(piece.x, piece.y);
      ctx.rotate(piece.rotation * Math.PI / 180);
      
      // Draw confetti piece (different shapes based on type)
      ctx.fillStyle = piece.color;
      
      if (type === 'achievement') {
        // Star shape for achievements
        drawStar(ctx, 0, 0, piece.size / 2, piece.size, 5);
      } else if (type === 'levelup') {
        // Diamond shape for level up
        drawDiamond(ctx, 0, 0, piece.size);
      } else {
        // Rectangle for regular confetti
        ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size);
      }
      
      ctx.restore();
    });
  };

  // Draw star shape
  const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, innerRadius: number, outerRadius: number, points: number) => {
    ctx.beginPath();
    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / points;
      const px = x + Math.cos(angle) * radius;
      const py = y + Math.sin(angle) * radius;
      
      if (i === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.closePath();
    ctx.fill();
  };

  // Draw diamond shape
  const drawDiamond = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.beginPath();
    ctx.moveTo(x, y - size / 2);
    ctx.lineTo(x + size / 2, y);
    ctx.lineTo(x, y + size / 2);
    ctx.lineTo(x - size / 2, y);
    ctx.closePath();
    ctx.fill();
  };

  // Animation loop
  const animate = (currentTime: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = currentTime;
    }

    const deltaTime = currentTime - (startTimeRef.current || currentTime);
    const elapsed = currentTime - startTimeRef.current;

    // Update confetti
    confettiRef.current = updateConfetti(confettiRef.current, deltaTime);
    
    // Draw confetti
    drawConfetti(confettiRef.current);

    // Continue animation if confetti exists and time hasn't expired
    if (confettiRef.current.length > 0 && elapsed < duration) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      // Animation complete
      if (onComplete) {
        onComplete();
      }
    }
  };

  // Start confetti animation
  useEffect(() => {
    if (show && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Set canvas size
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Create confetti
        const config = confettiConfigs[type];
        confettiRef.current = createConfetti(config);
        
        // Start animation
        startTimeRef.current = 0;
        animationRef.current = requestAnimationFrame(animate);
      }
    }

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [show, type, duration, onComplete]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!show) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ 
        width: '100vw', 
        height: '100vh',
        background: 'transparent'
      }}
    />
  );
};

export default QuizConfetti;
