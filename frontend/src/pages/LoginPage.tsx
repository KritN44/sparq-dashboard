import { useState, FormEvent } from 'react';
import { Box, Flex, Text, VStack, useToast, Image } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MeshBackground } from '../components/layout/MeshBackground';
import { GlassCard } from '../components/ui/GlassCard';
import { GradientButton } from '../components/ui/GradientButton';
import { AnimatedInput } from '../components/ui/AnimatedInput';
import { PageWrapper } from '../components/layout/PageWrapper';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate('/projects');
    } catch {
      toast({
        title: 'Login failed',
        description: 'Invalid email or password',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageWrapper>
      <MeshBackground />
      <Flex minH="100vh" align="center" justify="center">
        <GlassCard maxW="md" w="full" p={8}>
          <VStack spacing={6} as="form" onSubmit={handleSubmit}>
            <Box textAlign="center">
              <Image
                src={new URL('../assets/SparQ - Logo.png', import.meta.url).href}
                alt="SparQ"
                w="240px"
                mx="auto"
                mb={2}
              />
              <Text color="gray.500" mt={2}>
                Sign in to your account
              </Text>
            </Box>

            <AnimatedInput
              label="Email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isRequired
            />

            <AnimatedInput
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isRequired
            />

            <GradientButton
              type="submit"
              w="full"
              isLoading={isSubmitting}
              loadingText="Signing in..."
            >
              Sign In
            </GradientButton>
          </VStack>
        </GlassCard>
      </Flex>
    </PageWrapper>
  );
}
