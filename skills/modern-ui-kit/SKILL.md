# Modern UI Kit Skill

## Purpose
Provide **production-ready, animated React components** for MicroSaaS applications.
FRONTEND-AGENT **MUST** use these patterns for all UI work.

---

## Required Dependencies

### Option A: Chakra UI
```bash
npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion
```

### Option B: Tailwind + shadcn/ui
```bash
npm install framer-motion clsx tailwind-merge
npx shadcn-ui@latest init
```

---

## Component Library

Each component below has **both Chakra UI and Tailwind versions**.
**COPY THE CODE EXACTLY** - do not modify unless necessary.

---

## 1. GlassCard - Glassmorphism Container

### Option A: Chakra UI Version
```tsx
// src/components/ui/GlassCard.tsx
import { Box, BoxProps } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

const MotionBox = motion(Box);

interface GlassCardProps extends BoxProps {
  children: ReactNode;
}

export function GlassCard({ children, ...props }: GlassCardProps) {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ duration: 0.3 }}
      p={6}
      borderRadius="2xl"
      bg="rgba(255, 255, 255, 0.1)"
      backdropFilter="blur(10px)"
      border="1px solid"
      borderColor="whiteAlpha.200"
      boxShadow="xl"
      {...props}
    >
      {children}
    </MotionBox>
  );
}
```

### Option B: Tailwind Version
```tsx
// src/components/ui/GlassCard.tsx
import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export function GlassCard({ children, className }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'p-6 rounded-2xl',
        'bg-white/10 backdrop-blur-lg',
        'border border-white/20',
        'shadow-xl shadow-black/5',
        className
      )}
    >
      {children}
    </motion.div>
  );
}
```

---

## 2. GradientButton - Primary CTA Button

### Option A: Chakra UI Version
```tsx
// src/components/ui/GradientButton.tsx
import { Button, ButtonProps } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { forwardRef } from 'react';

const MotionButton = motion(Button);

export const GradientButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...props }, ref) => (
    <MotionButton
      ref={ref}
      bgGradient="linear(to-r, purple.500, pink.500)"
      color="white"
      fontWeight="semibold"
      px={6}
      py={3}
      borderRadius="full"
      _hover={{
        bgGradient: 'linear(to-r, purple.600, pink.600)',
        boxShadow: 'lg',
      }}
      _active={{
        transform: 'scale(0.98)',
      }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </MotionButton>
  )
);

GradientButton.displayName = 'GradientButton';
```

### Option B: Tailwind Version
```tsx
// src/components/ui/GradientButton.tsx
import { motion } from 'framer-motion';
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface GradientButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const GradientButton = forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ children, className, ...props }, ref) => (
    <motion.button
      ref={ref}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'px-6 py-3 rounded-full font-semibold text-white',
        'bg-gradient-to-r from-purple-500 to-pink-500',
        'hover:from-purple-600 hover:to-pink-600',
        'hover:shadow-lg transition-shadow',
        'focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2',
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  )
);

GradientButton.displayName = 'GradientButton';
```

---

## 3. PageWrapper - Page Transition Animation

### Option A: Chakra UI Version
```tsx
// src/components/layout/PageWrapper.tsx
import { Box } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

const MotionBox = motion(Box);

const pageVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 }
};

interface PageWrapperProps {
  children: ReactNode;
}

export function PageWrapper({ children }: PageWrapperProps) {
  return (
    <MotionBox
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      minH="100vh"
    >
      {children}
    </MotionBox>
  );
}
```

### Option B: Tailwind Version
```tsx
// src/components/layout/PageWrapper.tsx
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

const pageVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 }
};

interface PageWrapperProps {
  children: ReactNode;
}

export function PageWrapper({ children }: PageWrapperProps) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="min-h-screen"
    >
      {children}
    </motion.div>
  );
}
```

---

## 4. AnimatedList - Staggered List Animation

### Option A: Chakra UI Version
```tsx
// src/components/ui/AnimatedList.tsx
import { Box, VStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

const MotionVStack = motion(VStack);
const MotionBox = motion(Box);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

interface AnimatedListProps {
  children: ReactNode[];
  spacing?: number;
}

export function AnimatedList({ children, spacing = 4 }: AnimatedListProps) {
  return (
    <MotionVStack
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      spacing={spacing}
      align="stretch"
      w="full"
    >
      {children.map((child, i) => (
        <MotionBox key={i} variants={itemVariants}>
          {child}
        </MotionBox>
      ))}
    </MotionVStack>
  );
}
```

### Option B: Tailwind Version
```tsx
// src/components/ui/AnimatedList.tsx
import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

interface AnimatedListProps {
  children: ReactNode[];
  className?: string;
}

export function AnimatedList({ children, className }: AnimatedListProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn('flex flex-col gap-4 w-full', className)}
    >
      {children.map((child, i) => (
        <motion.div key={i} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
```

---

## 5. MeshBackground - Animated Gradient Background

### Option A: Chakra UI Version
```tsx
// src/components/layout/MeshBackground.tsx
import { Box } from '@chakra-ui/react';

export function MeshBackground() {
  return (
    <Box
      position="fixed"
      inset={0}
      zIndex={-10}
      overflow="hidden"
    >
      <Box
        position="absolute"
        inset={0}
        bgGradient="linear(to-br, purple.50, white, pink.50)"
      />
      <Box
        position="absolute"
        top={0}
        left="25%"
        w="24rem"
        h="24rem"
        bg="purple.200"
        borderRadius="full"
        filter="blur(60px)"
        opacity={0.3}
        animation="pulse 4s ease-in-out infinite"
      />
      <Box
        position="absolute"
        top="33%"
        right="25%"
        w="24rem"
        h="24rem"
        bg="yellow.200"
        borderRadius="full"
        filter="blur(60px)"
        opacity={0.3}
        animation="pulse 4s ease-in-out infinite"
        sx={{ animationDelay: '2s' }}
      />
      <Box
        position="absolute"
        bottom={0}
        left="50%"
        w="24rem"
        h="24rem"
        bg="pink.200"
        borderRadius="full"
        filter="blur(60px)"
        opacity={0.3}
        animation="pulse 4s ease-in-out infinite"
        sx={{ animationDelay: '4s' }}
      />
    </Box>
  );
}
```

### Option B: Tailwind Version
```tsx
// src/components/layout/MeshBackground.tsx
export function MeshBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-pink-50" />
      <div
        className="absolute top-0 left-1/4 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-30 animate-pulse"
      />
      <div
        className="absolute top-1/3 right-1/4 w-96 h-96 bg-yellow-200 rounded-full blur-3xl opacity-30 animate-pulse"
        style={{ animationDelay: '2s' }}
      />
      <div
        className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-200 rounded-full blur-3xl opacity-30 animate-pulse"
        style={{ animationDelay: '4s' }}
      />
    </div>
  );
}
```

---

## 6. PremiumCard - Feature Card with Badge

### Option A: Chakra UI Version
```tsx
// src/components/ui/PremiumCard.tsx
import { Box, Heading, Text, VStack, HStack, Avatar, Badge } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

interface PremiumCardProps {
  title: string;
  description: string;
  author?: string;
  tag?: string;
}

export function PremiumCard({ title, description, author, tag }: PremiumCardProps) {
  return (
    <MotionBox
      whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
      p={6}
      bg="white"
      borderRadius="2xl"
      border="1px solid"
      borderColor="gray.100"
      transition={{ duration: 0.2 }}
    >
      <VStack align="start" spacing={4}>
        {tag && (
          <Badge colorScheme="purple" borderRadius="full" px={3} py={1}>
            {tag}
          </Badge>
        )}
        <Heading size="md" color="gray.800">{title}</Heading>
        <Text color="gray.600" fontSize="sm">{description}</Text>
        {author && (
          <HStack>
            <Avatar size="sm" name={author} />
            <Text fontSize="sm" color="gray.500">{author}</Text>
          </HStack>
        )}
      </VStack>
    </MotionBox>
  );
}
```

### Option B: Tailwind Version
```tsx
// src/components/ui/PremiumCard.tsx
import { motion } from 'framer-motion';

interface PremiumCardProps {
  title: string;
  description: string;
  author?: string;
  tag?: string;
}

export function PremiumCard({ title, description, author, tag }: PremiumCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="p-6 bg-white rounded-2xl border border-gray-100 hover:shadow-2xl transition-shadow"
    >
      <div className="flex flex-col gap-4">
        {tag && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 w-fit">
            {tag}
          </span>
        )}
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
        {author && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center text-sm font-medium text-purple-700">
              {author.charAt(0)}
            </div>
            <span className="text-sm text-gray-500">{author}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
```

---

## 7. TextReveal - Word-by-Word Animation

### Both Versions (Same Implementation)
```tsx
// src/components/ui/TextReveal.tsx
import { motion } from 'framer-motion';

interface TextRevealProps {
  text: string;
  className?: string;
}

export function TextReveal({ text, className }: TextRevealProps) {
  const words = text.split(' ');

  return (
    <h1 className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.5 }}
          className="inline-block mr-2"
        >
          {word}
        </motion.span>
      ))}
    </h1>
  );
}
```

---

## 8. Input with Animation

### Option A: Chakra UI Version
```tsx
// src/components/ui/AnimatedInput.tsx
import { Input, InputProps, FormControl, FormLabel } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionInput = motion(Input);

interface AnimatedInputProps extends InputProps {
  label?: string;
}

export function AnimatedInput({ label, ...props }: AnimatedInputProps) {
  return (
    <FormControl>
      {label && <FormLabel color="gray.600">{label}</FormLabel>}
      <MotionInput
        whileFocus={{ scale: 1.01, borderColor: 'purple.500' }}
        transition={{ duration: 0.2 }}
        bg="white"
        border="2px solid"
        borderColor="gray.200"
        borderRadius="xl"
        px={4}
        py={3}
        _hover={{ borderColor: 'gray.300' }}
        _focus={{
          borderColor: 'purple.500',
          boxShadow: '0 0 0 3px rgba(139, 92, 246, 0.1)',
        }}
        {...props}
      />
    </FormControl>
  );
}
```

### Option B: Tailwind Version
```tsx
// src/components/ui/AnimatedInput.tsx
import { motion } from 'framer-motion';
import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const AnimatedInput = forwardRef<HTMLInputElement, AnimatedInputProps>(
  ({ label, className, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-600 mb-2">
          {label}
        </label>
      )}
      <motion.input
        ref={ref}
        whileFocus={{ scale: 1.01 }}
        className={cn(
          'w-full px-4 py-3 rounded-xl',
          'bg-white border-2 border-gray-200',
          'hover:border-gray-300',
          'focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10',
          'outline-none transition-colors',
          className
        )}
        {...props}
      />
    </div>
  )
);

AnimatedInput.displayName = 'AnimatedInput';
```

---

## Utility: cn() Function (for Tailwind)

```tsx
// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

## Theme Setup

### Chakra UI Theme
```tsx
// src/lib/theme.ts
import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
  colors: {
    brand: {
      50: '#f5e6ff',
      100: '#dbb8ff',
      200: '#c18aff',
      300: '#a75cff',
      400: '#8d2eff',
      500: '#7400e6',
      600: '#5a00b4',
      700: '#400082',
      800: '#270050',
      900: '#0f0020',
    },
  },
  fonts: {
    heading: `'Inter', sans-serif`,
    body: `'Inter', sans-serif`,
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'purple',
      },
    },
  },
});
```

### Tailwind Config Addition
```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      animation: {
        'pulse': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
};
```

---

## FRONTEND-AGENT Rules

When building any UI, FOLLOW THESE RULES:

1. **WRAP** all pages in `PageWrapper` for transitions
2. **USE** `GlassCard` for card containers
3. **USE** `GradientButton` for primary CTAs
4. **USE** `AnimatedList` for any list of items
5. **ADD** `MeshBackground` on landing/auth pages
6. **USE** `AnimatedInput` for form inputs
7. **EVERY** interactive element MUST have hover/tap animation

---

## Accessibility

Always respect user preferences:
```tsx
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Use in components:
<motion.div
  animate={{ opacity: 1 }}
  transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
/>
```

---

## Quick Reference

| Component | Use For |
|-----------|---------|
| GlassCard | Any card/container |
| GradientButton | Primary actions (Login, Submit, Save) |
| PageWrapper | Wrap every page component |
| AnimatedList | Lists of cards, items, search results |
| MeshBackground | Landing page, Login/Register pages |
| PremiumCard | Feature cards, blog posts, products |
| TextReveal | Hero headlines, section titles |
| AnimatedInput | All form inputs |
