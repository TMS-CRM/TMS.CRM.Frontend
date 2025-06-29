import { Search } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { AppBar, Avatar, Button, Typography } from '@mui/material';
import { Menu, MenuItem } from '@mui/material';
import Grid from '@mui/material/Grid';
import React, { useEffect, useState } from 'react';
// import logo from '../../assets/logo.jpg';
import { useAuth } from '../../hooks/use-auth';
import { useHeader } from '../../hooks/use-header';
import { HeaderModalType } from '../../types/header-context';
import type { Tenant } from '../../types/tenant';
import { mockTenant } from '../../types/tenant';
import AddNewModal from '../add-new-modal/add-new-modal';
import AlertSnackbar from '../alert-snackbar/alert-snackbar';
import CustomerFormModal from '../customer-form-modal/customer-form-modal';
import DealFormModal from '../deal-form-modal/deal-form-modal';
import SelectCustomerModal from '../select-customer-modal/select-customer-modal';
import TaskModal from '../task-form-modal/task-form-modal';
import './header.css';
import NewUserModal from '../user-form-modal/user-form-modal';

const Header: React.FC = () => {
  // const router = useRouter();
  const { title, buttonTitle, modalType } = useHeader();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'saved' | 'deleted'>('saved');
  const [addNewDealOpen, setAddNewDealOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [selectedTenantId, setSelectedTenantId] = useState<number | null>(1);
  const { signOut } = useAuth();

  const [opacity, setOpacity] = useState(1);

  // Avatar menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  function handleAvatarClick(event: React.MouseEvent<HTMLElement>): void {
    setAnchorEl(event.currentTarget);
  }

  function handleMenuClose(): void {
    setAnchorEl(null);
  }

  // Handle switch account action and close the menu
  function handleSwitchAccount(tenantId: number): void {
    setSelectedTenantId(tenantId);
    handleMenuClose();
  }

  async function handleSignOut(): Promise<void> {
    console.log('Signing out...');
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

  function renderModal(): React.ReactNode {
    switch (modalType) {
      case HeaderModalType.newCustomer:
        return (
          <CustomerFormModal
            open={!!isModalOpen}
            onClose={() => setIsModalOpen(false)}
            customerUuid={null}
            onShowSnackbar={(message, severity) => {
              setSnackbarMessage(message);
              setSnackbarSeverity(severity);
              setSnackbarOpen(true);
            }}
          />
        );
      case HeaderModalType.newUser:
        return <NewUserModal open={!!isModalOpen} onClose={() => setIsModalOpen(false)} />;
      case HeaderModalType.newTask:
        return (
          <TaskModal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            taskUuid={null}
            onShowSnackbar={(message, severity) => {
              setSnackbarMessage(message);
              setSnackbarSeverity(severity);
              setSnackbarOpen(true);
            }}
          />
        );
      case HeaderModalType.newDeal:
        return (
          <>
            <SelectCustomerModal
              open={!!isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onCustomerSelected={(customerId) => {
                setSelectedCustomerId(customerId);
                setIsModalOpen(false);
                setAddNewDealOpen(true);
              }}
            />
            {selectedCustomerId && (
              <DealFormModal
                open={addNewDealOpen}
                onClose={() => {
                  setAddNewDealOpen(false);
                }}
                onChangeCustomerRequested={() => {
                  setAddNewDealOpen(false);
                  setIsModalOpen(true);
                }}
                customerId={selectedCustomerId}
              />
            )}
          </>
        );
      case HeaderModalType.generalAddNew:
        return <AddNewModal open={!!isModalOpen} onClose={() => setIsModalOpen(false)} />;
    }
  }

  // function handleIconClick(): void {
  //   // router.push('/');
  // }

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
            {/* <Image onClick={handleIconClick} src={logo} alt="Logo" className="logo-image-header" /> */}
          </Grid>

          <Grid size={{ xs: 0, sm: 5, md: 5, lg: 6 }}>
            <Typography className="title-header" variant="h3">
              {title}
            </Typography>
          </Grid>

          <Grid size={{ xs: 10, sm: 5, md: 5, lg: 5 }} className="header-actions">
            {buttonTitle && (
              <Button
                className="add-new-header"
                variant="contained"
                endIcon={<AddIcon sx={{ color: 'white' }} />}
                onClick={() => setIsModalOpen(true)}
              >
                {buttonTitle}
              </Button>
            )}
            <Search className="search-header" />
            <Avatar
              className="avatar-header"
              src={'https://randomuser.me/api/portraits/women/1.jpg'}
              alt="User"
              onClick={handleAvatarClick}
              sx={{ cursor: 'pointer' }}
            />
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
              {mockTenant.map((tenant: Tenant) => (
                <MenuItem
                  className={`menu-item ${tenant.id === selectedTenantId ? 'selected' : ''}`}
                  key={tenant.id}
                  onClick={() => handleSwitchAccount(tenant.id)}
                >
                  {/* <Image className="avatar-tenant" src={tenant.avatar} alt="Profile" width={30} height={30} /> */}
                  {tenant.name}
                </MenuItem>
              ))}
            </Menu>
            <Button className="logout-button" variant="text" onClick={handleSignOut}>
              <LogoutOutlinedIcon />
            </Button>
          </Grid>
        </Grid>
        {renderModal()}
      </AppBar>
      <AlertSnackbar open={snackbarOpen} message={snackbarMessage} severity={snackbarSeverity} onClose={() => setSnackbarOpen(false)} />
    </>
  );
};

export default Header;
