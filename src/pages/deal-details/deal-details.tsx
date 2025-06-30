'use client';

import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import { Avatar, Box, Button, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ActivityFormCard from '../../components/activity-form-card/activity-form-card';
import ActivityCard from '../../components/activity-log-card/activity-card';
import AlertSnackbar from '../../components/alert-snackbar/alert-snackbar';
import DealModal from '../../components/deal-form-modal/deal-form-modal';
import { useHeader } from '../../hooks/use-header';
import type { Customer } from '../../types/customer';
import type { Deal } from '../../types/deal';
import { api } from '@/services/api';

import '../deals-details.css';
import './page.css';

export default function Page(): React.ReactElement {
  const { setTitle, setButtonTitle } = useHeader();
  const { id } = useParams();

  const [deal, setDeal] = useState<Deal | undefined>(undefined);
  const [customer, setCustomer] = useState<Customer | undefined>(undefined);
  const [editDealOpen, setEditDealOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'saved' | 'deleted'>('saved');

  // Set page header on mount
  useEffect(() => {
    setTitle('Deal Details');
    if (setButtonTitle) setButtonTitle(undefined);
  }, [setTitle, setButtonTitle]);

  async function fetchCustomer() {
    try {
      setIsLoading(true);
      const response = await api.get(`/tasks?limit=${limit}&offset=${page * limit}`);
      const responseData = response.data.data;

      setTasks((prevTasks) => (page === 0 ? responseData.items : [...prevTasks, ...responseData.items]));

      setTotalTasks(responseData.total);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchDeal() {
    try {
      setIsLoading(true);
      const response = await api.get(`/tasks?limit=${limit}&offset=${page * limit}`);
      const responseData = response.data.data;

      setTasks((prevTasks) => (page === 0 ? responseData.items : [...prevTasks, ...responseData.items]));

      setTotalTasks(responseData.total);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setIsLoading(false);
    }
  }

  // Fetch deal and customer when id changes
  useEffect(() => {
    if (!id) return;

    const selectedDeal = mockDeals.find((d) => d.id === Number(id));
    setDeal(selectedDeal);

    if (selectedDeal) {
      const selectedCustomer = mockCustomers.find((c) => c.id === selectedDeal.customerId);
      setCustomer(selectedCustomer);
    }
  }, [id]);

  // Handle deal not found
  if (!deal) {
    return (
      <Box className="not-found-deals-log">
        <BusinessCenterOutlinedIcon />
        <Typography variant="body1" className="text-no-deals-found">
          No deals found.
        </Typography>
      </Box>
    );
  }

  // Handle customer not found
  if (!customer) {
    return (
      <Box>
        <Typography variant="h6">Customer not found</Typography>
      </Box>
    );
  }

  // Handlers
  function handleDelete(): void {
    setSnackbarMessage('Deal Deleted');
    setSnackbarSeverity('deleted');
    setSnackbarOpen(true);
  }

  function handleSnackbarClose(): void {
    setSnackbarOpen(false);
  }

  return (
    <>
      <Grid container spacing={3} padding={0}>
        <Grid size={{ xs: 12, sm: 12, md: 8, lg: 8 }} sx={{ pt: 3, pl: 3 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <Grid container spacing={3} alignItems="center" className="customer-details-deal-page">
                <Grid size={{ xs: 12, sm: 12, md: 1, lg: 1 }}>
                  <Avatar src={customer.avatar} alt={customer.firstName} className="avatar-deal-page" />
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 3, lg: 3 }}>
                  <Typography variant="body2">Customer</Typography>
                  <Typography variant="body1" className="typography-deal-page">
                    {customer.firstName} {customer.lastName}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 5, lg: 5 }}>
                  <Typography variant="body2">Email</Typography>
                  <Typography variant="body1" className="typography-deal-page">
                    {customer.email}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 3, lg: 3 }}>
                  <Typography variant="body2">Phone</Typography>
                  <Typography variant="body1" className="typography-deal-page">
                    {customer.phone}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Box className="deal-details-address-container">
                <Box className="deal-details-text">
                  <Typography variant="h2">{deal.street},</Typography>
                  <Typography variant="h2">
                    {deal.city}, {deal.state} {deal.zipCode}
                  </Typography>
                </Box>
                <Box className="deal-details-actions">
                  <Button className="button-actions-id-page" onClick={() => setEditDealOpen(true)}>
                    <DriveFileRenameOutlineOutlinedIcon className="icon-deal-page" />
                  </Button>
                  <Button className="button-actions-id-page" onClick={handleDelete}>
                    <DeleteOutlineOutlinedIcon className="icon-deal-page" />
                  </Button>
                </Box>
              </Box>
            </Grid>

            <Grid container size={{ xs: 12 }} className="deal-info-container">
              <Grid size={{ xs: 12, md: 8, lg: 7 }}>
                <Box className="deal-info-row">
                  <Box className="deal-info-column">
                    <Typography variant="body2">Progress</Typography>
                    <Typography variant="body1" className="typography-deal-page">
                      {deal.progress.charAt(0).toUpperCase() + deal.progress.slice(1).toLowerCase()}
                    </Typography>
                  </Box>
                  <Box className="deal-info-column">
                    <Typography variant="body2">Appointment Date</Typography>
                    <Typography variant="body1" className="typography-deal-page">
                      {new Date(deal.appointmentDate).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Typography>
                  </Box>
                </Box>

                <Box className="deal-info-row">
                  <Box className="deal-info-column">
                    <Typography variant="body2">Room Area</Typography>
                    <Typography variant="body1" className="typography-deal-page">
                      {deal.roomArea} M&sup2;
                    </Typography>
                  </Box>
                  <Box className="deal-info-column">
                    <Typography variant="body2">Number of people</Typography>
                    <Typography variant="body1" className="typography-deal-page">
                      {deal.numberOfPeople}
                    </Typography>
                  </Box>
                </Box>

                <Box className="deal-info-row">
                  <Box className="deal-info-column">
                    <Typography variant="body2">Price</Typography>
                    <Typography variant="body1" className="typography-deal-page">
                      {deal.price}
                    </Typography>
                  </Box>
                  <Box className="deal-info-column">
                    <Typography variant="body2">Room Access</Typography>
                    <Typography variant="body1" className="typography-deal-page">
                      {deal.roomAccess}
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="body2">Special Instructions</Typography>
                  <Typography className="special-instructions">{deal.specialInstructions}</Typography>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, md: 4, lg: 5 }} className="deal-image-container">
                <img className="deal-image-deal-page" src={deal.dealPicture} alt="Deal" width={320} height={320} priority />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid size={{ xs: 12, md: 4, lg: 4 }}>
          <ActivityFormCard onActivityCreated={() => console.log('Activity created!')} />
          <ActivityCard />
        </Grid>
      </Grid>

      <DealModal open={editDealOpen} onClose={() => setEditDealOpen(false)} dealId={Number(id)} />

      <AlertSnackbar open={snackbarOpen} message={snackbarMessage} severity={snackbarSeverity} onClose={handleSnackbarClose} />
    </>
  );
}
