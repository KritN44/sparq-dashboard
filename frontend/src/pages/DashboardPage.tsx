import { useState } from 'react';
import {
  Heading,
  SimpleGrid,
  Box,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  Spinner,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Button,
  HStack,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { FiUsers, FiCheckCircle, FiVideo, FiFlag, FiCalendar } from 'react-icons/fi';
import { PageWrapper } from '../components/layout/PageWrapper';
import { GlassCard } from '../components/ui/GlassCard';
import { dashboardService } from '../services/dashboardService';
import { DashboardMetrics, PROJECT_STATUSES } from '../types/project';
import { ReactNode } from 'react';

const PIE_COLORS = ['#2E5A9E', '#D4920B', '#2D8B75', '#C75B2A', '#7B4FBF', '#3A8FD6', '#C44D4D', '#5B9E3A', '#8B6F4E'];
const BAR_COLORS = ['#2E5A9E', '#D4920B', '#2D8B75', '#C75B2A', '#C44D4D', '#5B9E3A', '#3A8FD6'];

interface MetricCardProps {
  label: string;
  value: number;
  icon: ReactNode;
  color: string;
}

function MetricCard({ label, value, icon, color }: MetricCardProps) {
  return (
    <GlassCard>
      <Flex align="center" gap={4}>
        <Box p={3} borderRadius="lg" bg={`${color}.50`} color={`${color}.500`}>
          {icon}
        </Box>
        <Stat>
          <StatLabel color="gray.500" fontSize="sm">{label}</StatLabel>
          <StatNumber fontSize="2xl">{value}</StatNumber>
        </Stat>
      </Flex>
    </GlassCard>
  );
}

export default function DashboardPage() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [appliedRange, setAppliedRange] = useState<{ start_date?: string; end_date?: string }>({});

  const { data: metrics, isLoading } = useQuery<DashboardMetrics>({
    queryKey: ['dashboard-metrics', appliedRange],
    queryFn: () => dashboardService.getMetrics(
      appliedRange.start_date || appliedRange.end_date ? appliedRange : undefined
    ),
  });

  const handleApplyFilter = () => {
    setAppliedRange({
      start_date: startDate || undefined,
      end_date: endDate || undefined,
    });
  };

  const handleClearFilter = () => {
    setStartDate('');
    setEndDate('');
    setAppliedRange({});
  };

  if (isLoading) {
    return (
      <Center minH="50vh">
        <Spinner size="xl" color="brand.500" thickness="4px" />
      </Center>
    );
  }

  if (!metrics) {
    return (
      <PageWrapper>
        <Center minH="50vh">
          <Text color="gray.400">Failed to load dashboard metrics</Text>
        </Center>
      </PageWrapper>
    );
  }

  const statusData = PROJECT_STATUSES.map((status, i) => ({
    name: status,
    value: getStatusCount(status, metrics),
    color: PIE_COLORS[i % PIE_COLORS.length],
  })).filter((d) => d.value > 0);

  const hasDateFilter = !!(appliedRange.start_date || appliedRange.end_date);

  return (
    <PageWrapper>
      <Flex justify="space-between" align="center" mb={6} wrap="wrap" gap={4}>
        <Heading size="lg">Dashboard</Heading>
      </Flex>

      <GlassCard mb={6}>
        <Flex align="end" gap={4} wrap="wrap">
          <FormControl maxW="200px">
            <FormLabel fontSize="sm" color="gray.500">
              <Flex align="center" gap={1}><FiCalendar /> From</Flex>
            </FormLabel>
            <Input
              type="date"
              size="sm"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              borderRadius="lg"
            />
          </FormControl>
          <FormControl maxW="200px">
            <FormLabel fontSize="sm" color="gray.500">
              <Flex align="center" gap={1}><FiCalendar /> To</Flex>
            </FormLabel>
            <Input
              type="date"
              size="sm"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              borderRadius="lg"
            />
          </FormControl>
          <HStack>
            <Button size="sm" colorScheme="brand" onClick={handleApplyFilter}>
              Apply
            </Button>
            {hasDateFilter && (
              <Button size="sm" variant="ghost" onClick={handleClearFilter}>
                Clear
              </Button>
            )}
          </HStack>
          {hasDateFilter && (
            <Text fontSize="sm" color="brand.500" fontWeight="medium">
              Filtered: {appliedRange.start_date || 'all'} to {appliedRange.end_date || 'all'}
            </Text>
          )}
        </Flex>
      </GlassCard>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 5 }} spacing={5} mb={8}>
        <MetricCard
          label="Total Projects"
          value={metrics.total_projects}
          icon={<FiFlag size={22} />}
          color="brand"
        />
        <MetricCard
          label="Briefs Approved"
          value={metrics.briefs_approved}
          icon={<FiCheckCircle size={22} />}
          color="green"
        />
        <MetricCard
          label="Videos Generated"
          value={metrics.videos_generated}
          icon={<FiVideo size={22} />}
          color="orange"
        />
        <MetricCard
          label="Videos Approved"
          value={metrics.videos_approved}
          icon={<FiVideo size={22} />}
          color="teal"
        />
        <MetricCard
          label="Campaigns via SparQ"
          value={metrics.campaigns_completed}
          icon={<FiUsers size={22} />}
          color="accent"
        />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mb={6}>
        <GlassCard>
          <Text fontWeight="semibold" mb={4}>Clients by Region</Text>
          <Box h="300px">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.clients_by_region}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="region" fontSize={12} />
                <YAxis allowDecimals={false} fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" fill="#2E5A9E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </GlassCard>

        <GlassCard>
          <Text fontWeight="semibold" mb={4}>Campaigns via SparQ by Region</Text>
          <Box h="300px">
            {metrics.campaigns_by_region.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics.campaigns_by_region}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="region" fontSize={12} />
                  <YAxis allowDecimals={false} fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {metrics.campaigns_by_region.map((_entry, index) => (
                      <Cell key={`camp-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Center h="100%">
                <Text color="gray.400">No campaigns yet</Text>
              </Center>
            )}
          </Box>
        </GlassCard>
      </SimpleGrid>

      <GlassCard mb={6}>
        <Text fontWeight="semibold" mb={4}>Status Distribution</Text>
        <Box h="350px">
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) =>
                    `${name.length > 20 ? name.slice(0, 20) + '...' : name} (${(percent * 100).toFixed(0)}%)`
                  }
                  labelLine
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <Center h="100%">
              <Text color="gray.400">No project data yet</Text>
            </Center>
          )}
        </Box>
      </GlassCard>
    </PageWrapper>
  );
}

function getStatusCount(status: string, metrics: DashboardMetrics): number {
  switch (status) {
    case 'Client approved':
      return metrics.briefs_approved;
    case 'Video submitted for review':
      return Math.max(0, metrics.videos_generated - metrics.videos_approved);
    case 'Video approved':
      return metrics.videos_approved;
    case 'Campaign signed up':
      return metrics.campaigns_completed;
    default:
      return 0;
  }
}
