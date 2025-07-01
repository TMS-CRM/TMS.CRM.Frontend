'use client';

import { BusinessCenterOutlined } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Card, Container, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// import DealFormModal from '../../../components/deal-form-modal';
import DealFormModal from '../../../components/deal-form-modal/deal-form-modal';
import EmptyState from '../../../components/empty-state/empty-state';
// import SelectCustomerModal from '../../../components/select-customer-modal';
import SelectCustomerModal from '../../../components/select-customer-modal/select-customer-modal';
import type { Deal } from '../../../types/deal';
import './recent-deals.css';

const RecentDeals: React.FC = () => {
  const [deals, setDeals] = useState<Deal[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addNewDealOpen, setAddNewDealOpen] = useState(false);
  const [selectedCustomerUuid, setSelectedCustomerUuid] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // const isFetchingRef = useRef(false);

  // const { uuid: customerUuid } = useParams();
  // const [page, setPage] = useState<number>(0);
  // const limit = 3;

  const navigate = useNavigate();

  // async function fetchDeals(currentPage: number): Promise<void> {
  //   try {
  //     if (isFetchingRef.current) {
  //       return;
  //     }

  //     isFetchingRef.current = true;
  //     setIsLoading(true);

  //     const response = await api.get<{ data: { items: Deal[] } }>(`/deals?limit=${limit}&offset=${page * limit}`);
  //     const responseData = response.data.data;
  //     console.log(responseData);

  //     setDeals((prevDeals) => (currentPage === 0 ? responseData.items : [...prevDeals, ...responseData.items]));
  //   } catch (error) {
  //     console.error('Error fetching deals:', error);
  //   } finally {
  //     setIsLoading(false);
  //     isFetchingRef.current = false;
  //   }
  // }

  // useEffect(() => {
  //   void fetchDeals(page);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // function setPageAndRefresh(newPage: number): void {
  //   setPage(newPage);
  //   void fetchDeals(newPage);
  // }

  function handleDealClick(dealUuid: string): void {
    void navigate(`/deal-details/${dealUuid}`);
  }

  // const renderModal = () => (
  //   <>
  //     <SelectCustomerModal
  //       open={!!isModalOpen}
  //       onClose={() => setIsModalOpen(false)}
  //       onCustomerSelected={(customerId) => {
  //         setSelectedCustomerUuid(customerId);
  //         setIsModalOpen(false);
  //         setAddNewDealOpen(true);
  //       }}
  //     />
  //     {selectedCustomerId && (
  //       <DealFormModal
  //         open={addNewDealOpen}
  //         onClose={() => setAddNewDealOpen(false)}
  //         onChangeCustomerRequested={() => {
  //           setAddNewDealOpen(false);
  //           setIsModalOpen(true);
  //         }}
  //         customerId={selectedCustomerId}
  //       />
  //     )}
  //   </>
  // );

  const hasDeals = deals.length > 0;

  if (!hasDeals) {
    return (
      <Container>
        <Grid container marginTop={3}>
          <Grid size={{ xs: 10, md: 10.5 }}>
            <Typography variant="h5" color="secondary">
              Recent Deals
            </Typography>
          </Grid>
          <Grid size={{ xs: 2, md: 1.5 }}>
            <Button variant="contained" onClick={() => setIsModalOpen(true)}>
              <AddIcon className="add-new-deal-button" />
            </Button>
          </Grid>
        </Grid>
        <EmptyState icon={<BusinessCenterOutlined />} message="No deals found." />
      </Container>
    );
  }

  return (
    <>
      <Container className="recent-deals-container" color="secondary">
        <Grid container className="recent-deals-header">
          <Grid size={{ xs: 10, md: 10.5 }}>
            <Typography variant="h5" color="secondary">
              Recent Deals
            </Typography>
          </Grid>
          <Grid size={{ xs: 2, md: 1.5 }}>
            <Button variant="contained" onClick={() => setIsModalOpen(true)}>
              <AddIcon className="add-new-deal-button" />
            </Button>
          </Grid>
        </Grid>

        {deals.map((deal: Deal) => (
          <Grid container key={deal.uuid} onClick={() => handleDealClick(deal.uuid)} className="recent-deals-item">
            <Grid size={{ xs: 3, sm: 2, md: 2, lg: 2 }}>
              <img src={deal.dealPicture} alt="Deal" width={44} height={44} className="deal-image" />
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
        ))}

        <Box className="pagination-controls">
          {/* <Button variant="text" onClick={goBack} disabled={currentIndex === 0}>
          Back
        </Button> */}
          {/* <Typography variant="body2">
          {currentPage} of {totalPages}
        </Typography> */}
          <Button
            variant="outlined"
            disabled={isLoading}
            // onClick={() => setPageAndRefresh(page + 1)}
            sx={{ marginTop: '16px', justifyContent: 'center', display: 'flex' }}
          >
            Load more
          </Button>
        </Box>
      </Container>
      <SelectCustomerModal
        open={!!isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCustomerSelected={(customerId) => {
          setSelectedCustomerUuid(customerId);
          setIsModalOpen(false);
          setAddNewDealOpen(true);
        }}
      />
      {selectedCustomerUuid && (
        <DealFormModal
          open={addNewDealOpen}
          onClose={() => setAddNewDealOpen(false)}
          onChangeCustomerRequested={() => {
            setAddNewDealOpen(false);
            setIsModalOpen(true);
          }}
          customerUuid={selectedCustomerUuid}
        />
      )}
    </>
  );
};

export default RecentDeals;
