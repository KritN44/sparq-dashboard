import {
  Box,
  Heading,
  Text,
  Badge,
  SimpleGrid,
  Button,
  Spinner,
  Center,
  Flex,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiEdit } from 'react-icons/fi';
import { PageWrapper } from '../components/layout/PageWrapper';
import { GlassCard } from '../components/ui/GlassCard';
import { projectService } from '../services/projectService';
import { useAuth } from '../context/AuthContext';

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: () => projectService.getProject(Number(id)),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <Center minH="50vh">
        <Spinner size="xl" color="brand.500" />
      </Center>
    );
  }

  if (!project) {
    return (
      <PageWrapper>
        <Center minH="50vh">
          <Text>Project not found</Text>
        </Center>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Flex justify="space-between" align="center" mb={6}>
        <Button leftIcon={<FiArrowLeft />} variant="ghost" onClick={() => navigate('/projects')}>
          Back to Projects
        </Button>
        {user?.role === 'marcom' && (
          <Button leftIcon={<FiEdit />} colorScheme="brand" variant="outline" onClick={() => navigate(`/projects/${id}/edit`)}>
            Edit
          </Button>
        )}
      </Flex>

      <GlassCard>
        <Heading size="md" mb={4}>{project.brand_name}</Heading>
        <Badge
          colorScheme="brand"
          borderRadius="full"
          px={3}
          py={1}
          mb={6}
          fontSize="sm"
        >
          {project.status}
        </Badge>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mt={4}>
          <Box>
            <Text fontSize="sm" color="gray.500" mb={1}>Region</Text>
            <Text fontWeight="medium">{project.region}</Text>
          </Box>
          <Box>
            <Text fontSize="sm" color="gray.500" mb={1}>Request Date</Text>
            <Text fontWeight="medium">{new Date(project.request_date).toLocaleDateString()}</Text>
          </Box>
          <Box>
            <Text fontSize="sm" color="gray.500" mb={1}>City</Text>
            <Text fontWeight="medium">{project.city}</Text>
          </Box>
          <Box>
            <Text fontSize="sm" color="gray.500" mb={1}>Salesperson</Text>
            <Text fontWeight="medium">{project.salesperson_name}</Text>
          </Box>
          <Box>
            <Text fontSize="sm" color="gray.500" mb={1}>Category</Text>
            <Text fontWeight="medium">{project.category}</Text>
          </Box>
          <Box>
            <Text fontSize="sm" color="gray.500" mb={1}>Created</Text>
            <Text fontWeight="medium">{new Date(project.created_at).toLocaleDateString()}</Text>
          </Box>
          <Box>
            <Text fontSize="sm" color="gray.500" mb={1}>Last Updated</Text>
            <Text fontWeight="medium">
              {project.updated_at ? new Date(project.updated_at).toLocaleDateString() : 'N/A'}
            </Text>
          </Box>
        </SimpleGrid>
      </GlassCard>
    </PageWrapper>
  );
}
