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
} from 'recharts';
import { FiUsers, FiCheckCircle, FiVideo, FiFlag } from 'react-icons/fi';
import { PageWrapper } from '../components/layout/PageWrapper';
import { GlassCard } from '../components/ui/GlassCard';
import { dashboardService } from '../services/dashboardService';
import { DashboardMetrics, PROJECT_STATUSES } from '../types/project';
import { ReactNode } from 'react';

const PIE_COLORS = ['#805AD5', '#D53F8C', '#DD6B20', '#38A169', '#E53E3E', '#D69E2E', '#9F7AEA', '#319795', '#ED64A6'];

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
  const { data: metrics, isLoading } = useQuery<DashboardMetrics>({
    queryKey: ['dashboard-metrics'],
    queryFn: () => dashboardService.getMetrics(),
  });

  if (isLoading) {
    return (
      <Center minH="50vh">
        <Spinner size="xl" color="purple.500" thickness="4px" />
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

  return (
    <PageWrapper>
      <Heading size="lg" mb={6}>Dashboard</Heading>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={5} mb={8}>
        <MetricCard
          label="Total Projects"
          value={metrics.total_projects}
          icon={<FiFlag size={22} />}
          color="purple"
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
          label="Campaigns Completed"
          value={metrics.campaigns_completed}
          icon={<FiUsers size={22} />}
          color="pink"
        />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        <GlassCard>
          <Text fontWeight="semibold" mb={4}>Clients by Region</Text>
          <Box h="300px">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.clients_by_region}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="region" fontSize={12} />
                <YAxis allowDecimals={false} fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" fill="#805AD5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </GlassCard>

        <GlassCard>
          <Text fontWeight="semibold" mb={4}>Status Distribution</Text>
          <Box h="300px">
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) =>
                      `${name.length > 15 ? name.slice(0, 15) + '...' : name} (${(percent * 100).toFixed(0)}%)`
                    }
                    labelLine
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Center h="100%">
                <Text color="gray.400">No project data yet</Text>
              </Center>
            )}
          </Box>
        </GlassCard>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mt={6}>
        <GlassCard>
          <Stat>
            <StatLabel color="gray.500">Videos Approved</StatLabel>
            <StatNumber fontSize="3xl" color="teal.500">{metrics.videos_approved}</StatNumber>
          </Stat>
        </GlassCard>
        <GlassCard>
          <Stat>
            <StatLabel color="gray.500">Campaigns via SparQ</StatLabel>
            <StatNumber fontSize="3xl" color="pink.500">{metrics.campaigns_completed}</StatNumber>
          </Stat>
        </GlassCard>
      </SimpleGrid>
    </PageWrapper>
  );
}

function getStatusCount(status: string, metrics: DashboardMetrics): number {
  switch (status) {
    case 'Client approved':
      return metrics.briefs_approved;
    case 'Video submitted for review':
    case 'Video approved':
      return status === 'Video approved' ? metrics.videos_approved : metrics.videos_generated - metrics.videos_approved;
    case 'Campaign signed up':
      return metrics.campaigns_completed;
    default:
      return 0;
  }
}
