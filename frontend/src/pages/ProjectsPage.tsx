import { useState } from 'react';
import {
  Box,
  Heading,
  Flex,
  Select,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  IconButton,
  HStack,
  Text,
  Button,
  Spinner,
  Center,
  useToast,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEdit, FiTrash2, FiPlus, FiDownload } from 'react-icons/fi';
import { PageWrapper } from '../components/layout/PageWrapper';
import { GlassCard } from '../components/ui/GlassCard';
import { GradientButton } from '../components/ui/GradientButton';
import { projectService } from '../services/projectService';
import { useAuth } from '../context/AuthContext';
import { REGIONS, CATEGORIES, PROJECT_STATUSES } from '../types/project';

const statusColorMap: Record<string, string> = {
  'Brand description generated': 'blue',
  'Deck in progress': 'orange',
  'Deck Shared': 'cyan',
  'Client approved': 'green',
  'Client rejected': 'red',
  'Video production in progress': 'yellow',
  'Video submitted for review': 'blue',
  'Video approved': 'teal',
  'Campaign signed up': 'orange',
};

export default function ProjectsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [page, setPage] = useState(1);
  const [regionFilter, setRegionFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchBrand, setSearchBrand] = useState('');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['projects', page, regionFilter, statusFilter, categoryFilter, searchBrand],
    queryFn: () =>
      projectService.getProjects({
        page,
        per_page: 20,
        region: regionFilter || undefined,
        status: statusFilter || undefined,
        category: categoryFilter || undefined,
        brand: searchBrand || undefined,
      }),
  });

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await projectService.deleteProject(id);
      toast({ title: 'Project deleted', status: 'success', duration: 2000 });
      refetch();
    } catch {
      toast({ title: 'Failed to delete', status: 'error', duration: 2000 });
    }
  };

  const handleExport = async () => {
    try {
      const blob = await projectService.exportCSV();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'projects.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      toast({ title: 'Export failed', status: 'error', duration: 2000 });
    }
  };

  return (
    <PageWrapper>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Projects</Heading>
        <HStack spacing={3}>
          <Button leftIcon={<FiDownload />} variant="outline" onClick={handleExport} size="sm">
            Export CSV
          </Button>
          {user?.role === 'marcom' && (
            <GradientButton leftIcon={<FiPlus />} onClick={() => navigate('/projects/new')} size="sm">
              New Project
            </GradientButton>
          )}
        </HStack>
      </Flex>

      <GlassCard mb={6}>
        <Flex gap={4} wrap="wrap">
          <Select placeholder="All Regions" value={regionFilter} onChange={(e) => { setRegionFilter(e.target.value); setPage(1); }} maxW="180px" size="sm">
            {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
          </Select>
          <Select placeholder="All Statuses" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} maxW="220px" size="sm">
            {PROJECT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </Select>
          <Select placeholder="All Categories" value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }} maxW="180px" size="sm">
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>
          <Input placeholder="Search brand..." value={searchBrand} onChange={(e) => { setSearchBrand(e.target.value); setPage(1); }} maxW="200px" size="sm" />
        </Flex>
      </GlassCard>

      <GlassCard>
        {isLoading ? (
          <Center py={10}><Spinner size="xl" color="brand.500" /></Center>
        ) : (
          <>
            <Box overflowX="auto">
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>Region</Th>
                    <Th>Request Date</Th>
                    <Th>City</Th>
                    <Th>Salesperson</Th>
                    <Th>Brand</Th>
                    <Th>Category</Th>
                    <Th>Status</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data?.items.map((project) => (
                    <Tr key={project.id} _hover={{ bg: 'gray.50' }}>
                      <Td fontWeight="medium">{project.region}</Td>
                      <Td>{new Date(project.request_date).toLocaleDateString()}</Td>
                      <Td>{project.city}</Td>
                      <Td>{project.salesperson_name}</Td>
                      <Td fontWeight="medium">{project.brand_name}</Td>
                      <Td>{project.category}</Td>
                      <Td>
                        <Badge colorScheme={statusColorMap[project.status] || 'gray'} borderRadius="full" px={2}>
                          {project.status}
                        </Badge>
                      </Td>
                      <Td>
                        <HStack spacing={1}>
                          <IconButton aria-label="View" icon={<FiEye />} size="xs" variant="ghost" onClick={() => navigate(`/projects/${project.id}`)} />
                          {user?.role === 'marcom' && (
                            <>
                              <IconButton aria-label="Edit" icon={<FiEdit />} size="xs" variant="ghost" onClick={() => navigate(`/projects/${project.id}/edit`)} />
                              <IconButton aria-label="Delete" icon={<FiTrash2 />} size="xs" variant="ghost" colorScheme="red" onClick={() => handleDelete(project.id)} />
                            </>
                          )}
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>

            {data && data.total > 0 && (
              <Flex justify="space-between" align="center" mt={4}>
                <Text fontSize="sm" color="gray.500">
                  Showing {(page - 1) * data.per_page + 1}-{Math.min(page * data.per_page, data.total)} of {data.total}
                </Text>
                <HStack>
                  <Button size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} isDisabled={page <= 1}>
                    Previous
                  </Button>
                  <Button size="sm" onClick={() => setPage((p) => p + 1)} isDisabled={page * data.per_page >= data.total}>
                    Next
                  </Button>
                </HStack>
              </Flex>
            )}

            {data?.items.length === 0 && (
              <Center py={10}>
                <Text color="gray.400">No projects found</Text>
              </Center>
            )}
          </>
        )}
      </GlassCard>
    </PageWrapper>
  );
}
