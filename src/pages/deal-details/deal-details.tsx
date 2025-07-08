import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import { Avatar, Box, Button, CircularProgress, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ActivityFormCard from './components/activity-form-card/activity-form-card';
import ActivityList from './components/activity-list/activity-list';
import AlertSnackbar from '../../components/alert-snackbar/alert-snackbar';
import DealModal from '../../components/deal-form-modal/deal-form-modal';
import { useHeader } from '../../hooks/use-header';
import { api } from '../../services/api';
import type { DealWithCustomer } from '../../types/deal';
import './deal-details.css';

const DealDetails: React.FC = () => {
  const { setTitle } = useHeader();

  const { uuid: dealUuid } = useParams();
  const [deal, setDeal] = useState<DealWithCustomer | null>(null);
  const [editDealOpen, setEditDealOpen] = useState(false);
  const [forceRefreshActivityList, setForceRefreshActivityList] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'saved' | 'deleted'>('saved');

  const defaultImage = 'https://archive.org/download/placeholder-image/placeholder-image.jpg';

  // isLoading controls the UI display for loading state
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // isFetchingRef controls fetching state to avoid duplicates
  const isFetchingRef = useRef(false);

  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    setTitle('Deal Details');
  }, [setTitle]);

  useEffect(() => {
    void fetchDeal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchDeal(): Promise<void> {
    if (isFetchingRef.current) {
      return;
    }

    isFetchingRef.current = true;
    setIsLoading(true);

    try {
      const response = await api.get<{ data: DealWithCustomer }>(`/deals/${dealUuid}`);
      const responseData = response.data.data;
      setDeal(responseData);
    } catch (error) {
      console.error('Failed to fetch customer', error);
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }

  useEffect(() => {
    const state = location.state as { snackbarMessage?: string; snackbarSeverity?: 'saved' | 'deleted'; refresh?: boolean } | null;

    if (state?.snackbarMessage) {
      setSnackbarMessage(state.snackbarMessage);
      setSnackbarSeverity(state.snackbarSeverity ?? 'saved');
      setSnackbarOpen(true);
    }

    // Clean up: remove state only after it's been used
    setTimeout(() => {
      window.history.replaceState({}, document.title);
    }, 0);
  }, []);

  function setPageAndRefresh(): void {
    void fetchDeal();
  }

  async function handleDelete(): Promise<void> {
    if (!dealUuid) return;

    try {
      await api.delete(`/deals/${dealUuid}`);
      await navigate('/deals', {
        state: {
          snackbarMessage: 'Deal deleted',
          snackbarSeverity: 'deleted',
          refresh: true,
        },
      });
    } catch (error) {
      console.error('Error deleting deal:', error);
      setSnackbarMessage('Failed to delete deal');
      setSnackbarSeverity('deleted');
      setSnackbarOpen(true);
    }
  }

  return (
    <>
      <Grid container spacing={3} padding={0}>
        {isLoading ? (
          <Grid size={{ xs: 12 }} sx={{ textAlign: 'center', paddingTop: '150px' }}>
            <CircularProgress size={40} />
          </Grid>
        ) : (
          <>
            <Grid size={{ xs: 12, sm: 12, md: 8, lg: 8 }} sx={{ pt: 3, pl: 3 }}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                  <Grid container spacing={3} alignItems="center" className="customer-details-deal-page">
                    <Grid size={{ xs: 12, sm: 12, md: 1, lg: 1 }}>
                      <Avatar src={deal?.customer.avatar} alt={deal?.customer.firstName} className="avatar-deal-page" />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 12, md: 3, lg: 3 }}>
                      <Typography variant="body2">Customer</Typography>
                      <Typography variant="body1" className="typography-deal-page">
                        {deal?.customer.firstName} {deal?.customer.lastName}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 12, md: 5, lg: 5 }}>
                      <Typography variant="body2">Email</Typography>
                      <Typography variant="body1" className="typography-deal-page">
                        {deal?.customer.email}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 12, md: 3, lg: 3 }}>
                      <Typography variant="body2">Phone</Typography>
                      <Typography variant="body1" className="typography-deal-page">
                        {deal?.customer.phone}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Box className="deal-details-address-container">
                    <Box className="deal-details-text">
                      <Typography variant="h2">{deal?.street},</Typography>
                      <Typography variant="h2">
                        {deal?.city}, {deal?.state} {deal?.zipCode}
                      </Typography>
                    </Box>
                    <Box className="deal-details-actions">
                      <Button className="button-actions-id-page" onClick={() => setEditDealOpen(true)}>
                        <DriveFileRenameOutlineOutlinedIcon className="icon-deal-page" />
                      </Button>
                      <Button
                        className="button-actions-id-page"
                        onClick={() => {
                          void handleDelete();
                        }}
                      >
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
                          {deal?.progress ? deal.progress.charAt(0).toUpperCase() + deal.progress.slice(1).toLowerCase() : ''}
                        </Typography>
                      </Box>
                      <Box className="deal-info-column">
                        <Typography variant="body2">Appointment Date</Typography>
                        <Typography variant="body1" className="typography-deal-page">
                          {deal?.appointmentDate
                            ? new Date(deal.appointmentDate).toLocaleString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })
                            : ''}
                        </Typography>
                      </Box>
                    </Box>

                    <Box className="deal-info-row">
                      <Box className="deal-info-column">
                        <Typography variant="body2">Room Area</Typography>
                        <Typography variant="body1" className="typography-deal-page">
                          {deal?.roomArea} M&sup2;
                        </Typography>
                      </Box>
                      <Box className="deal-info-column">
                        <Typography variant="body2">Number of people</Typography>
                        <Typography variant="body1" className="typography-deal-page">
                          {deal?.numberOfPeople}
                        </Typography>
                      </Box>
                    </Box>

                    <Box className="deal-info-row">
                      <Box className="deal-info-column">
                        <Typography variant="body2">Price</Typography>
                        <Typography variant="body1" className="typography-deal-page">
                          {deal?.price}
                        </Typography>
                      </Box>
                      <Box className="deal-info-column">
                        <Typography variant="body2">Room Access</Typography>
                        <Typography variant="body1" className="typography-deal-page">
                          {deal?.roomAccess}
                        </Typography>
                      </Box>
                    </Box>

                    <Box>
                      <Typography variant="body2">Special Instructions</Typography>
                      <Typography className="special-instructions">{deal?.specialInstructions}</Typography>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, md: 4, lg: 5 }} className="deal-image-container">
                    <img className="deal-image-deal-page" src={deal?.imageUrl ?? defaultImage} alt="Deal" width={320} height={320} />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid size={{ xs: 12, md: 4, lg: 4 }}>
              <ActivityFormCard
                dealUuid={dealUuid!}
                onActivityCreated={() => {
                  setForceRefreshActivityList(true);
                }}
                onShowSnackbar={(message, severity) => {
                  setSnackbarMessage(message);
                  setSnackbarSeverity(severity);
                  setSnackbarOpen(true);
                }}
              />

              <ActivityList
                dealUuid={dealUuid!}
                forceRefresh={forceRefreshActivityList}
                onForceRefreshed={() => {
                  setForceRefreshActivityList(false);
                }}
              />
            </Grid>
          </>
        )}
      </Grid>

      <DealModal
        open={editDealOpen}
        onClose={(refresh: boolean) => {
          setEditDealOpen(false);
          if (refresh) {
            setPageAndRefresh();
          }
        }}
        dealUuid={dealUuid!}
      />

      <AlertSnackbar open={snackbarOpen} message={snackbarMessage} severity={snackbarSeverity} onClose={() => setSnackbarOpen(false)} />
    </>
  );
};

export default DealDetails;
