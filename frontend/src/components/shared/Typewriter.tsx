'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TypewriterProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  repeat?: boolean;
}

export const Typewriter: React.FC<TypewriterProps> = ({
  text,
  speed = 50,
  delay = 0,
  className = '',
  repeat = false,
}) => {
  const [mounted, setMounted] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    let timeout: NodeJS.Timeout;

    if (delay > 0 && currentIndex === 0 && !isDeleting) {
      timeout = setTimeout(() => {
        setCurrentIndex(0);
      }, delay);
      return () => clearTimeout(timeout);
    }

    const handleTyping = () => {
      if (!isDeleting && currentIndex < text.length) {
        setDisplayText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      } else if (isDeleting && currentIndex > 0) {
        setDisplayText((prev) => prev.slice(0, -1));
        setCurrentIndex((prev) => prev - 1);
      } else if (repeat) {
        if (currentIndex === text.length) {
          timeout = setTimeout(() => setIsDeleting(true), 2000);
        } else if (currentIndex === 0) {
          setIsDeleting(false);
        }
      }
    };

    timeout = setTimeout(handleTyping, isDeleting ? speed / 2 : speed);

    return () => clearTimeout(timeout);
  }, [currentIndex, isDeleting, text, speed, delay, repeat, mounted]);

  if (!mounted) {
    return <span className={className}>&nbsp;</span>;
  }

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={className}
    >
      {displayText}
      <motion.span
        animate={{ opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 0.8 }}
        className="inline-block w-[2px] h-[1.2em] bg-current ml-1 align-middle"
      />
    </motion.span>
  );
};
