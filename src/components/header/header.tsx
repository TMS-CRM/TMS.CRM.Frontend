import { Search } from '@mui/icons-material';
import CheckIcon from '@mui/icons-material/Check';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { AppBar, Avatar, Backdrop, Box, Button, CircularProgress, Divider, Fade, IconButton, Tooltip, Typography } from '@mui/material';
import { Menu, MenuItem } from '@mui/material';
import Grid from '@mui/material/Grid';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.jpg';
import { useAuth } from '../../hooks/use-auth';
import { useHeader } from '../../hooks/use-header';
import { api } from '../../services/api';
// import type { Tenant } from '../../types/tenant';
import './header.css';
import type { Tenant } from '../../types/auth-context';
import CommandSearchModal from './components/search-modal/search-modal';

const Header: React.FC = () => {
  const { button, title } = useHeader();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const navigate = useNavigate();

  const { signOut, switchTenant } = useAuth();

  const { user, tenantUuid } = useAuth();

  const [opacity, setOpacity] = useState(1);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  const defaultAvatar: string = 'https://www.gravatar.com/avatar/?d=mp&f=y';
  const defaultTenantAvatar = 'https://www.gravatar.com/avatar/?d=identicon&f=y';

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingTenantTransition, setIsLoadingTenantTransition] = useState(false);

  const isFetchingRef = useRef(false);

  async function fetchTenants(): Promise<void> {
    if (isFetchingRef.current || !user?.uuid) return;

    isFetchingRef.current = true;
    setIsLoading(true);

    try {
      const response = await api.get<{ data: Tenant[] }>(`/users/${user.uuid}/tenants`);
      const responseData = response.data.data;

      setTenants(() => responseData.sort((a, b) => a.name.localeCompare(b.name)));
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

  async function handleSwitchAccount(tenant: Tenant): Promise<void> {
    setIsLoading(true);
    setIsLoadingTenantTransition(true);
    await switchTenant({ tenantUuid: tenant.uuid });
    setIsLoading(false);
    setIsLoadingTenantTransition(false);

    // setSelectedTenantUuid(tenantUuid);
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
      <Backdrop open={isLoadingTenantTransition} sx={{ zIndex: 1500 }}>
        <CircularProgress color="inherit" />
      </Backdrop>

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
            <Search
              className="search-header"
              onClick={() => {
                setIsSearchOpen(true);
              }}
            />
            <Tooltip title="Switch account">
              <IconButton
                onClick={handleAvatarClick}
                size="small"
                sx={{ ml: 2 }}
                aria-controls={open ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
              >
                <Avatar src={defaultAvatar} alt="User" sx={{ width: 40, height: 40 }} />
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={open}
              onClose={handleMenuClose}
              TransitionComponent={Fade}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  borderRadius: 2,
                  minWidth: 220,
                  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                  p: 1,
                },
              }}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <Typography variant="caption" sx={{ pl: 2, pb: 0.5, fontWeight: 500, color: 'text.secondary' }}>
                Switch account
              </Typography>

              <Divider sx={{ my: 1.5 }} />

              {tenants?.map((tenant: Tenant) => {
                const isSelected = tenant.uuid === tenantUuid;

                return (
                  <MenuItem
                    key={tenant.uuid}
                    onClick={() => {
                      handleMenuClose();
                      void handleSwitchAccount(tenant);
                    }}
                    selected={isSelected}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      borderRadius: 1,
                      backgroundColor: isSelected ? 'action.selected' : 'transparent',
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    }}
                  >
                    <Avatar
                      src={tenant.avatar || defaultTenantAvatar}
                      alt={tenant.name}
                      sx={{ width: 30, height: 30 }}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = defaultTenantAvatar;
                      }}
                    />
                    <Box flex={1} fontSize="0.875rem">
                      {tenant.name}
                    </Box>
                    {isSelected && <CheckIcon fontSize="small" color="primary" />}
                  </MenuItem>
                );
              })}
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

      <CommandSearchModal open={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Header;
