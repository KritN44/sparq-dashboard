import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';

const theme = extendTheme({
  colors: {
    brand: {
      50: '#EBF0F7',
      100: '#C9D6E8',
      200: '#A3B8D8',
      300: '#7A99C7',
      400: '#5179B3',
      500: '#2E5A9E',
      600: '#244882',
      700: '#1B3766',
      800: '#1B2A4A',
      900: '#0F1A2E',
    },
    accent: {
      50: '#FFF8E6',
      100: '#FFEDB3',
      200: '#FFE080',
      300: '#FFD24D',
      400: '#FFC31A',
      500: '#D4920B',
      600: '#B87A08',
      700: '#9A6306',
      800: '#7D4E04',
      900: '#5C3803',
    },
  },
  fonts: {
    heading: `'Inter', sans-serif`,
    body: `'Inter', sans-serif`,
  },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ChakraProvider>
  </React.StrictMode>
);
