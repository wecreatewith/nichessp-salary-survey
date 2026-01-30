'use client';

import { useState, useEffect, useCallback } from 'react';

export function MatrixEasterEgg() {
  const [isMatrix, setIsMatrix] = useState(false);

  const toggleMatrix = useCallback(() => {
    setIsMatrix((prev) => !prev);
  }, []);

  useEffect(() => {
    if (isMatrix) {
      document.body.classList.add('matrix-mode');
    } else {
      document.body.classList.remove('matrix-mode');
    }
    return () => {
      document.body.classList.remove('matrix-mode');
    };
  }, [isMatrix]);

  return (
    <>
      {/* Matrix rain canvas */}
      {isMatrix && <MatrixRain />}

      {/* Toggle button */}
      <button
        onClick={toggleMatrix}
        className={`fixed bottom-4 right-4 z-50 w-8 h-8 rounded-full text-xs font-mono transition-all duration-300 ${
          isMatrix
            ? 'bg-black border-2 border-green-500 text-green-500 shadow-[0_0_10px_#00ff00]'
            : 'bg-gray-200 text-gray-400 hover:bg-gray-300 opacity-30 hover:opacity-100'
        }`}
        title={isMatrix ? 'Exit the Matrix' : '🐇'}
      >
        {isMatrix ? '⬡' : '◉'}
      </button>
    </>
  );
}

function MatrixRain() {
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.id = 'matrix-canvas';
    canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      pointer-events: none;
    `;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789$%&@#';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#0f0';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resize);
      canvas.remove();
    };
  }, []);

  return null;
}

export default MatrixEasterEgg;
