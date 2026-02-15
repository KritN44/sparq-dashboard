import { FormControl, FormErrorMessage, FormLabel, Input, InputProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

export interface AnimatedInputProps extends InputProps {
  label?: string;
  error?: string;
  isRequired?: boolean;
}

export const AnimatedInput = forwardRef<HTMLInputElement, AnimatedInputProps>(
  ({ label, error, isRequired, ...props }, ref) => (
    <FormControl isInvalid={!!error} isRequired={isRequired}>
      {label && <FormLabel fontSize="sm" fontWeight="medium">{label}</FormLabel>}
      <Input
        ref={ref}
        borderRadius="xl"
        border="2px solid"
        borderColor={error ? 'red.500' : 'gray.200'}
        _focus={{ borderColor: 'purple.500', shadow: 'outline' }}
        px={4}
        py={3}
        {...props}
      />
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  )
);

AnimatedInput.displayName = 'AnimatedInput';
