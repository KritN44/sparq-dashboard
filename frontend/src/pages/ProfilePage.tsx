import { useState, FormEvent } from 'react';
import {
  Heading,
  VStack,
  Text,
  Badge,
  Box,
  SimpleGrid,
  useToast,
  Divider,
  Avatar,
  Flex,
} from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { PageWrapper } from '../components/layout/PageWrapper';
import { GlassCard } from '../components/ui/GlassCard';
import { GradientButton } from '../components/ui/GradientButton';
import { AnimatedInput } from '../components/ui/AnimatedInput';

export default function ProfilePage() {
  const { user } = useAuth();
  const toast = useToast();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await authService.updateProfile(fullName);
      toast({ title: 'Profile updated', status: 'success', duration: 2000 });
    } catch {
      toast({ title: 'Update failed', status: 'error', duration: 2000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <PageWrapper>
      <Heading size="lg" mb={6}>Profile</Heading>

      <GlassCard maxW="2xl" mx="auto">
        <Flex align="center" gap={4} mb={6}>
          <Avatar size="lg" name={user.full_name || user.email} />
          <Box>
            <Text fontWeight="bold" fontSize="lg">{user.full_name || user.email}</Text>
            <Badge colorScheme="brand" textTransform="capitalize">{user.role}</Badge>
          </Box>
        </Flex>

        <Divider mb={6} />

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={6}>
          <Box>
            <Text fontSize="sm" color="gray.500">Email</Text>
            <Text fontWeight="medium">{user.email}</Text>
          </Box>
          <Box>
            <Text fontSize="sm" color="gray.500">Role</Text>
            <Text fontWeight="medium" textTransform="capitalize">{user.role}</Text>
          </Box>
          <Box>
            <Text fontSize="sm" color="gray.500">Status</Text>
            <Badge colorScheme={user.is_active ? 'green' : 'red'}>
              {user.is_active ? 'Active' : 'Inactive'}
            </Badge>
          </Box>
          <Box>
            <Text fontSize="sm" color="gray.500">Member Since</Text>
            <Text fontWeight="medium">{new Date(user.created_at).toLocaleDateString()}</Text>
          </Box>
        </SimpleGrid>

        <Divider mb={6} />

        <VStack spacing={4} as="form" onSubmit={handleSubmit}>
          <AnimatedInput
            label="Full Name"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <GradientButton
            type="submit"
            w="full"
            isLoading={isSubmitting}
            loadingText="Saving..."
          >
            Update Profile
          </GradientButton>
        </VStack>
      </GlassCard>
    </PageWrapper>
  );
}
