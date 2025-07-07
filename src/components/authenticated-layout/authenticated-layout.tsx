import Box from '@mui/material/Box';
import { Outlet } from 'react-router-dom';
import { HeaderProvider } from '../../providers/header-provider';
import Header from '../header/header';
import Menu from '../menu/menu';

const AuthenticatedLayout: React.FC = () => {
  return (
    <HeaderProvider>
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Box
          sx={{
            height: {
              xs: 60,
              sm: 90,
              md: 90,
            },
            flexShrink: 0,
            width: '100%',
          }}
        >
          <Header />
        </Box>

        <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <Box
            sx={{
              width: {
                xs: 60,
                sm: 90,
                md: 90,
              },
              flexShrink: 0,
            }}
          >
            <Menu />
          </Box>

          <Box
            sx={{
              flex: 1,
              overflow: 'auto',
              backgroundColor: '#F6FAFD',
              minHeight: 0,
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </Box>
    </HeaderProvider>
  );
};

export default AuthenticatedLayout;
