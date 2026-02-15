import {
  Box,
  Flex,
  Text,
  VStack,
  Icon,
  Divider,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiFolder, FiPlus, FiUser, FiLogOut, FiBarChart2 } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { ReactNode } from 'react';

interface NavItemProps {
  to: string;
  icon: ReactNode;
  label: string;
}

function NavItem({ to, icon, label }: NavItemProps) {
  return (
    <Box
      as={NavLink}
      to={to}
      w="full"
      px={4}
      py={3}
      borderRadius="lg"
      _hover={{ bg: 'purple.50', color: 'purple.600' }}
      _activeLink={{ bg: 'purple.100', color: 'purple.700', fontWeight: 'semibold' }}
      transition="all 0.2s"
      display="flex"
      alignItems="center"
      gap={3}
    >
      {icon}
      <Text fontSize="sm">{label}</Text>
    </Box>
  );
}

interface SidebarLayoutProps {
  children: ReactNode;
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Flex minH="100vh">
      <Box
        w="250px"
        bg="white"
        borderRight="1px solid"
        borderColor="gray.200"
        py={6}
        display="flex"
        flexDirection="column"
      >
        <Box px={6} mb={8}>
          <Text fontSize="xl" fontWeight="bold" bgGradient="linear(to-r, purple.500, pink.500)" bgClip="text">
            Sparq Dashboard
          </Text>
        </Box>

        <VStack spacing={1} px={3} flex={1}>
          {user?.role === 'management' && (
            <NavItem to="/dashboard" icon={<Icon as={FiBarChart2} />} label="Dashboard" />
          )}

          <NavItem to="/projects" icon={<Icon as={FiFolder} />} label="Projects" />

          {user?.role === 'marcom' && (
            <NavItem to="/projects/new" icon={<Icon as={FiPlus} />} label="New Project" />
          )}

          <NavItem to="/profile" icon={<Icon as={FiUser} />} label="Profile" />
        </VStack>

        <Divider my={4} />

        <Box px={3}>
          <Menu>
            <MenuButton w="full" px={4} py={3} borderRadius="lg" _hover={{ bg: 'gray.50' }}>
              <Flex align="center" gap={3}>
                <Avatar size="sm" name={user?.full_name || user?.email} />
                <Box textAlign="left">
                  <Text fontSize="sm" fontWeight="medium" noOfLines={1}>
                    {user?.full_name || user?.email}
                  </Text>
                  <Text fontSize="xs" color="gray.500" textTransform="capitalize">
                    {user?.role}
                  </Text>
                </Box>
              </Flex>
            </MenuButton>
            <MenuList>
              <MenuItem icon={<FiUser />} onClick={() => navigate('/profile')}>Profile</MenuItem>
              <MenuItem icon={<FiLogOut />} onClick={handleLogout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Box>

      <Box flex={1} bg="gray.50" overflowY="auto">
        {children}
      </Box>
    </Flex>
  );
}
