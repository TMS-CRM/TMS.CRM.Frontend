import Box from '@mui/material/Box';
import { Outlet } from 'react-router-dom';
import { HeaderProvider } from '../../providers/header-provider';
import Header from '../header/header';
import Menu from '../menu/menu';

const AuthenticatedLayout: React.FC = () => {
  return (
    <HeaderProvider>
      <Box>
        <Header />
        <Box
          sx={{
            margin: {
              xs: '70px 0px 0px 70px',
              md: '90px 0px 0px 90px',
            },
            backgroundColor: '#F6FAFD',
          }}
        >
          <Menu />
          <Outlet />
        </Box>
      </Box>
    </HeaderProvider>
  );
};

export default AuthenticatedLayout;
