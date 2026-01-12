
import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  useNeuralBorder?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', delay = 0, useNeuralBorder = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay, 
        type: 'spring', 
        stiffness: 100, 
        damping: 15 
      }}
      className={`glass rounded-2xl p-6 ${useNeuralBorder ? 'neural-border' : ''} glass-hover ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
