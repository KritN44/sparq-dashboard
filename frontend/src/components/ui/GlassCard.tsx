import { Box, BoxProps } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MotionBox = motion(Box as any) as React.FC<BoxProps & { initial?: object; animate?: object }>;

interface GlassCardProps extends BoxProps {
  children: ReactNode;
}

export function GlassCard({ children, ...props }: GlassCardProps) {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      p={6}
      borderRadius="xl"
      bg="white"
      shadow="lg"
      border="1px solid"
      borderColor="gray.100"
      _hover={{ shadow: 'xl' }}
      {...props}
    >
      {children}
    </MotionBox>
  );
}
