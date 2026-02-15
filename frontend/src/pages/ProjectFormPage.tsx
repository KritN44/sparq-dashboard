import { useState, useEffect, FormEvent } from 'react';
import { Box, Heading, VStack, Select, useToast, Button, Flex, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FiArrowLeft } from 'react-icons/fi';
import { PageWrapper } from '../components/layout/PageWrapper';
import { GlassCard } from '../components/ui/GlassCard';
import { GradientButton } from '../components/ui/GradientButton';
import { AnimatedInput } from '../components/ui/AnimatedInput';
import { projectService } from '../services/projectService';
import {
  Region,
  Category,
  ProjectStatus,
  REGIONS,
  CATEGORIES,
  PROJECT_STATUSES,
  ProjectCreateData,
} from '../types/project';

function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}

export default function ProjectFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const toast = useToast();

  const [region, setRegion] = useState<Region>('TN');
  const [requestDate, setRequestDate] = useState(todayISO());
  const [city, setCity] = useState('');
  const [salespersonName, setSalespersonName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [category, setCategory] = useState<Category>('FMCG');
  const [status, setStatus] = useState<ProjectStatus>('Brand description generated');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: existingProject } = useQuery({
    queryKey: ['project', id],
    queryFn: () => projectService.getProject(Number(id)),
    enabled: isEdit,
  });

  useEffect(() => {
    if (existingProject) {
      setRegion(existingProject.region);
      setRequestDate(existingProject.request_date);
      setCity(existingProject.city);
      setSalespersonName(existingProject.salesperson_name);
      setBrandName(existingProject.brand_name);
      setCategory(existingProject.category);
      setStatus(existingProject.status);
    }
  }, [existingProject]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const projectData: ProjectCreateData = {
      region,
      request_date: requestDate,
      city,
      salesperson_name: salespersonName,
      brand_name: brandName,
      category,
      status,
    };

    try {
      if (isEdit) {
        await projectService.updateProject(Number(id), projectData);
        toast({ title: 'Project updated', status: 'success', duration: 2000 });
      } else {
        await projectService.createProject(projectData);
        toast({ title: 'Project created', status: 'success', duration: 2000 });
      }
      navigate('/projects');
    } catch {
      toast({
        title: isEdit ? 'Update failed' : 'Creation failed',
        status: 'error',
        duration: 2000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageWrapper>
      <Flex mb={6}>
        <Button leftIcon={<FiArrowLeft />} variant="ghost" onClick={() => navigate('/projects')}>
          Back to Projects
        </Button>
      </Flex>

      <GlassCard maxW="2xl" mx="auto">
        <Heading size="md" mb={6}>
          {isEdit ? 'Edit Project' : 'New Project'}
        </Heading>

        <VStack spacing={5} as="form" onSubmit={handleSubmit}>
          <Box w="full">
            <Select value={region} onChange={(e) => setRegion(e.target.value as Region)}>
              {REGIONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </Select>
          </Box>

          <FormControl isRequired>
            <FormLabel fontSize="sm" fontWeight="medium">Request Date</FormLabel>
            <Input
              type="date"
              value={requestDate}
              onChange={(e) => setRequestDate(e.target.value)}
              borderRadius="xl"
              border="2px solid"
              borderColor="gray.200"
              _focus={{ borderColor: 'brand.500', shadow: 'outline' }}
            />
          </FormControl>

          <AnimatedInput
            label="City"
            placeholder="Enter city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            isRequired
          />

          <AnimatedInput
            label="Salesperson Name"
            placeholder="Enter salesperson name"
            value={salespersonName}
            onChange={(e) => setSalespersonName(e.target.value)}
            isRequired
          />

          <AnimatedInput
            label="Brand Name"
            placeholder="Enter brand name"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            isRequired
          />

          <Box w="full">
            <Select value={category} onChange={(e) => setCategory(e.target.value as Category)}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>
          </Box>

          <Box w="full">
            <Select value={status} onChange={(e) => setStatus(e.target.value as ProjectStatus)}>
              {PROJECT_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Select>
          </Box>

          <GradientButton
            type="submit"
            w="full"
            isLoading={isSubmitting}
            loadingText={isEdit ? 'Updating...' : 'Creating...'}
          >
            {isEdit ? 'Update Project' : 'Create Project'}
          </GradientButton>
        </VStack>
      </GlassCard>
    </PageWrapper>
  );
}
