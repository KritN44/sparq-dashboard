import { Box } from '@chakra-ui/react';

export function MeshBackground() {
  return (
    <Box position="fixed" inset={0} zIndex={-1} overflow="hidden">
      <Box
        position="absolute"
        inset={0}
        bgGradient="linear(to-br, brand.50, white, accent.50)"
      />
      <Box
        position="absolute"
        top={0}
        left="25%"
        w="24rem"
        h="24rem"
        bg="brand.200"
        borderRadius="full"
        filter="blur(80px)"
        opacity={0.3}
      />
      <Box
        position="absolute"
        bottom={0}
        right="25%"
        w="24rem"
        h="24rem"
        bg="accent.200"
        borderRadius="full"
        filter="blur(80px)"
        opacity={0.3}
      />
    </Box>
  );
}
