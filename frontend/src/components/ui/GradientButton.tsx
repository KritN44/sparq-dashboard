import { Button, ButtonProps } from '@chakra-ui/react';
import { motion } from 'framer-motion';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MotionButton = motion(Button as any) as React.FC<ButtonProps & { whileHover?: object; whileTap?: object }>;

export function GradientButton({ children, ...props }: ButtonProps) {
  return (
    <MotionButton
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      bgGradient="linear(to-r, purple.500, pink.500)"
      color="white"
      fontWeight="semibold"
      borderRadius="full"
      px={6}
      py={3}
      _hover={{
        bgGradient: 'linear(to-r, purple.600, pink.600)',
        shadow: 'lg',
      }}
      {...props}
    >
      {children}
    </MotionButton>
  );
}
