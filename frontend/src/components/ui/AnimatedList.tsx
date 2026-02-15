import { Box } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

const MotionBox = motion(Box);

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

interface AnimatedListProps {
  children: ReactNode[];
}

export function AnimatedList({ children }: AnimatedListProps) {
  return (
    <MotionBox initial="hidden" animate="visible" variants={container}>
      {children.map((child, i) => (
        <MotionBox key={i} variants={item}>
          {child}
        </MotionBox>
      ))}
    </MotionBox>
  );
}
