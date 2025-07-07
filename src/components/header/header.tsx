import { Search } from '@mui/icons-material';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { AppBar, Avatar, Button, Typography } from '@mui/material';
import { Menu, MenuItem } from '@mui/material';
import Grid from '@mui/material/Grid';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.jpg';
import { useAuth } from '../../hooks/use-auth';
import { useHeader } from '../../hooks/use-header';
import { api } from '../../services/api';
import type { Tenant } from '../../types/tenant';
import './header.css';

const Header: React.FC = () => {
  const { button, title } = useHeader();
  const [selectedTenantUuid, setSelectedTenantUuid] = useState<string | null>();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const navigate = useNavigate();

  const { signOut } = useAuth();

  const { user } = useAuth();

  const [opacity, setOpacity] = useState(1);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const defaultAvatar: string = 'https://www.gravatar.com/avatar/?d=mp&f=y';

  // isLoading controls the UI display for loading state
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const isFetchingRef = useRef(false);

  async function fetchTenants(): Promise<void> {
    if (isFetchingRef.current || !user?.uuid) return;

    isFetchingRef.current = true;
    setIsLoading(true);

    try {
      const response = await api.get<{ data: Tenant[] }>(`/users/${user.uuid}/tenants`);
      const responseData = response.data.data;

      setTenants(() => responseData);
    } catch (error) {
      console.error('Error fetching tenants:', error);
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }

  useEffect(() => {
    void fetchTenants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uuid]);

  function handleAvatarClick(event: React.MouseEvent<HTMLElement>): void {
    setAnchorEl(event.currentTarget);
  }

  function handleMenuClose(): void {
    setAnchorEl(null);
  }

  function handleSwitchAccount(tenantUuid: string): void {
    setSelectedTenantUuid(tenantUuid);
    handleMenuClose();
  }

  async function handleSignOut(): Promise<void> {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout failed', error);
    }
  }

  useEffect(() => {
    const handleScroll = (): void => setOpacity(window.scrollY > 50 ? 0.7 : 1);
    window.addEventListener('scroll', handleScroll);
    return (): void => window.removeEventListener('scroll', handleScroll);
  }, []);

  function handleIconClick(): void {
    void navigate(`/`);
  }

  return (
    <>
      <AppBar
        sx={{
          backgroundColor: `rgba(246, 250, 253, ${opacity})`,
          boxShadow: 'none',
          transition: 'background-color 0.9s',
        }}
      >
        <Grid container className="header-container">
          <Grid size={{ xs: 2, sm: 2, md: 2, lg: 1 }} className="logo-header">
            <img onClick={handleIconClick} src={logo} alt="Logo" className="logo-image-header" />
          </Grid>

          <Grid size={{ xs: 0, sm: 5, md: 5, lg: 6 }}>
            <Typography className="title-header" variant="h3">
              {title}
            </Typography>
          </Grid>

          <Grid size={{ xs: 10, sm: 5, md: 5, lg: 5 }} className="header-actions">
            <>{button}</>
            <Search className="search-header" />
            <Avatar className="avatar-header" src={defaultAvatar} alt="User" onClick={handleAvatarClick} sx={{ cursor: 'pointer' }} />
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={open}
              onClose={handleMenuClose}
              onClick={handleMenuClose}
              slotProps={{
                paper: {
                  className: 'custom-menu-paper',
                  elevation: 0,
                },
              }}
            >
              {tenants?.map((tenant: Tenant) => (
                <MenuItem
                  className={`menu-item ${tenant.uuid === selectedTenantUuid ? 'selected' : ''}`}
                  key={tenant.uuid}
                  onClick={() => handleSwitchAccount(tenant.uuid)}
                >
                  <img className="avatar-tenant" src={tenant.avatar} alt="Profile" width={30} height={30} />
                  {tenant.name}
                </MenuItem>
              ))}
            </Menu>
            <Button
              className="logout-button"
              variant="text"
              onClick={() => {
                void handleSignOut();
              }}
            >
              <LogoutOutlinedIcon />
            </Button>
          </Grid>
        </Grid>
      </AppBar>
    </>
  );
};

export default Header;
