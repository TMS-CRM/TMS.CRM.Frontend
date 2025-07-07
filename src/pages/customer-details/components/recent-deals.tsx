import { BusinessCenterOutlined } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import { Box, Button, CardContent, CircularProgress, Container, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './recent-deals.css';
import AlertSnackbar from '../../../components/alert-snackbar/alert-snackbar';
import DealFormModal from '../../../components/deal-form-modal/deal-form-modal';
import EmptyState from '../../../components/empty-state/empty-state';
import SelectCustomerModal from '../../../components/select-customer-modal/select-customer-modal';
// import { api } from '../../../services/api';
import type { Deal } from '../../../types/deal';

interface RecentDealsProps {
  customerUuid: string;
  forceRefresh: boolean;
  onForceRefreshed: () => void;
}

const RecentDeals: React.FC<RecentDealsProps> = (props: RecentDealsProps) => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [totalDeals, setTotalDeals] = useState<number>(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addNewDealOpen, setAddNewDealOpen] = useState(false);
  const [selectedCustomerUuid, setSelectedCustomerUuid] = useState<string | null>(null);

  const [page, setPage] = useState<number>(0);
  const limit = 3;

  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'saved' | 'deleted'>('saved');

  // isLoading controls the UI display for loading state
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // isFetchingRef controls fetching state to avoid duplicates
  const isFetchingRef = useRef(false);

  const navigate = useNavigate();

  // modal fade transition loading
  const [isLoadingModalTransition, setIsLoadingModalTransition] = useState(false);

  useEffect(() => {
    if (props.forceRefresh) {
      goToPage(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props, props.forceRefresh]);

  useEffect(() => {
    void fetchDeals(0);
  }, []);

  // async function fetchDeals(currentPage: number): Promise<void> {
  //   if (isFetchingRef.current) {
  //     return;
  //   }

  //   isFetchingRef.current = true;
  //   setIsLoading(true);

  //   try {
  //     const response = await api.get<{ data: { items: Deal[]; total: number } }>(
  //       `/deals?limit=${limit}&offset=${currentPage * limit}&customerUuid=${props.customerUuid}`,
  //     );
  //     const responseData = response.data.data;

  //     setDeals(responseData.items);
  //     setTotalDeals(responseData.total);
  //   } catch (error) {
  //     console.error('Error fetching activities:', error);
  //   } finally {
  //     isFetchingRef.current = false;
  //     setIsLoading(false);
  //     setIsLoadingModalTransition(false);
  //   }
  // }

  function fetchDeals(currentPage: number): void {
    if (isFetchingRef.current) {
      return;
    }

    isFetchingRef.current = true;
    setIsLoading(true);

    try {
      const response = {
        data: {
          data: {
            items: [],
            total: 0,
          },
        },
      };
      const responseData = response.data.data;

      setDeals(responseData.items);
      setTotalDeals(responseData.total);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      isFetchingRef.current = false;
      setIsLoading(false);
      setIsLoadingModalTransition(false);
    }
  }

  function goToPage(newPage: number): void {
    setPage(newPage);
    void fetchDeals(newPage);
  }

  if (!deals || deals.length === 0) {
    return (
      <CardContent className="recent-deals-header">
        <Box className="not-found-recent-deals-log">
          <BusinessCenterOutlined />
          <Typography variant="body1" className="text-no-recent-deals-found">
            No recent deals found.
          </Typography>
        </Box>
      </CardContent>
    );
  }

  return (
    <>
      {isLoading && deals.length > 0 ? (
        <Grid size={{ xs: 12 }} sx={{ textAlign: 'center', paddingTop: '150px' }}>
          <CircularProgress size={40} />
        </Grid>
      ) : deals.length <= 0 ? (
        <EmptyState icon={<BusinessCenterOutlined />} message="No deals found." />
      ) : (
        <Container className="recent-deals-container" color="secondary">
          <Grid container className="recent-deals-header">
            <Grid size={{ xs: 10, md: 10.5 }}>
              <Typography variant="h5" color="secondary">
                Recent Deals
              </Typography>
            </Grid>
            <Grid size={{ xs: 2, md: 1.5 }}>
              <Button variant="contained" onClick={() => console.log('click')}>
                <AddIcon className="add-new-deal-button" />
              </Button>
            </Grid>
          </Grid>

          {isLoading ? (
            <Grid size={{ xs: 12 }} sx={{ textAlign: 'center', paddingTop: '150px' }}>
              <CircularProgress size={40} />
            </Grid>
          ) : deals.length > 0 ? (
            deals.map((deal) => (
              <Grid container onClick={() => void navigate(`/deal-details/${deal.uuid}`)} key={deal.uuid} className="recent-deals-item">
                <Grid size={{ xs: 3, sm: 2, md: 2, lg: 2 }}>
                  <img src={deal.imageUrl} alt="Deal" width={44} height={44} className="deal-image" />
                </Grid>

                <Grid size={{ xs: 9, sm: 10, md: 10, lg: 10 }} className="recent-deals-details">
                  <Grid container direction="column">
                    <Grid size={{ xs: 12, md: 12 }}>
                      <Typography variant="body1" className="recent-deals-address-detail">
                        {deal.street}, {deal.city}, {deal.state}
                      </Typography>
                    </Grid>

                    <Grid size={{ xs: 12, md: 12 }} container alignItems="center" gap={1}>
                      <Typography variant="body2">
                        {new Date(deal.appointmentDate).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Typography>
                      <Typography variant="body2">•</Typography>
                      <Typography variant="body2">$ {deal.price}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            ))
          ) : (
            <Typography textAlign="center" mt={4} color="text.secondary">
              No customers found.
            </Typography>
          )}

          <Box display="flex" justifyContent="center" alignItems="center" padding={1.5} gap={2}>
            <Button
              variant="text"
              onClick={() => {
                goToPage(Math.max(0, page - 1));
              }}
              disabled={page === 0 || isLoading}
            >
              Back
            </Button>

            <Typography variant="body2" color="text.secondary">
              {totalDeals > 0 ? `${page + 1} of ${Math.ceil(totalDeals / limit)}` : ''}
            </Typography>

            <Button
              variant="text"
              onClick={() => {
                const totalPages = Math.ceil(totalDeals / limit);
                if (page + 1 >= totalPages) return;

                setIsLoadingModalTransition(true);
                goToPage(page + 1);
              }}
              disabled={page + 1 >= Math.ceil(totalDeals / limit) || isLoading || isLoadingModalTransition}
            >
              Load More
            </Button>
          </Box>
        </Container>
      )}

      <SelectCustomerModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        onShowSnackbar={(message, severity) => {
          setSnackbarMessage(message);
          setSnackbarSeverity(severity);
          setSnackbarOpen(true);
        }}
        onCustomerSelected={(customerUuid) => {
          setSelectedCustomerUuid(customerUuid);
          setIsModalOpen(false);
          setIsLoadingModalTransition(true);

          setAddNewDealOpen(true);
          setIsLoadingModalTransition(false);
        }}
      />

      {/* Modal: Deal Form */}
      <DealFormModal
        dealUuid={null}
        open={addNewDealOpen}
        onClose={() => {
          setAddNewDealOpen(false);
        }}
        onChangeCustomerRequested={() => {
          setAddNewDealOpen(false);
          setIsLoadingModalTransition(true);

          setIsModalOpen(true);
          setIsLoadingModalTransition(false);
        }}
        onShowSnackbar={(message, severity) => {
          setSnackbarMessage(message);
          setSnackbarSeverity(severity);
          setSnackbarOpen(true);
        }}
        customerUuid={selectedCustomerUuid ?? undefined}
      />

      <AlertSnackbar open={snackbarOpen} message={snackbarMessage} severity={snackbarSeverity} onClose={() => setSnackbarOpen(false)} />
    </>
  );
};

export default RecentDeals;
