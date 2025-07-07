import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import './next-appointment-card.css';
import { useNavigate } from 'react-router-dom';
import Background from '../../../../assets/background.png';
import Dote from '../../../../assets/dote.png';
import AlertSnackbar from '../../../../components/alert-snackbar/alert-snackbar';
import DealFormModal from '../../../../components/deal-form-modal/deal-form-modal';
import SelectCustomerModal from '../../../../components/select-customer-modal/select-customer-modal';
// import { api } from '../../../../services/api';
import { api } from '../../../../services/api';
import type { Deal } from '../../../../types/deal';

const NextAppointmentCard: React.FC = () => {
  const [deal, setDeal] = useState<Deal[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addNewDealOpen, setAddNewDealOpen] = useState(false);
  const [selectedCustomerUuid, setSelectedCustomerUuid] = useState<string | null>(null);

  const [, setIsLoading] = useState<boolean>(false);

  // modal fade transition loading
  const [, setIsLoadingModalTransition] = useState(false);

  const defaultImage = 'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg';

  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'saved' | 'deleted'>('saved');

  const navigate = useNavigate();

  const isFetchingRef = useRef(false);

  useEffect(() => {
    void fetchNextAppointment();
  }, []);

  async function fetchNextAppointment(): Promise<void> {
    if (isFetchingRef.current) {
      return;
    }

    isFetchingRef.current = true;
    setIsLoading(true);

    try {
      const response = await api.get<{ data: { items: Deal[] } }>('deals?from=now&order=asc&progress=InProgress,Pending&limit=1&offset=0');
      const responseData = response.data.data;
      console.log('responseData.items', responseData.items);

      setDeal(responseData.items);
    } catch (error) {
      console.error('Failed to fetch upcoming appointments', error);
    } finally {
      isFetchingRef.current = false;
      setIsLoading(false);
      setIsLoadingModalTransition(false);
    }
  }

  // function fetchNextAppointment(): void {
  //   if (isFetchingRef.current) {
  //     return;
  //   }

  //   isFetchingRef.current = true;
  //   setIsLoading(true);

  //   try {
  //     const response = {
  //       data: {
  //         data: {
  //           items: [],
  //           total: 0,
  //         },
  //       },
  //     };
  //     const responseData = response.data.data;
  //     console.log('responseData.items', responseData.items);

  //     setDeal(responseData.items);
  //   } catch (error) {
  //     console.error('Failed to fetch upcoming appointments', error);
  //   } finally {
  //     isFetchingRef.current = false;
  //     setIsLoading(false);
  //     setIsLoadingModalTransition(false);
  //   }
  // }

  function setRefresh(): void {
    void fetchNextAppointment();
  }

  function handleDealClick(dealUuid: string): void {
    void navigate(`/deal-details/${dealUuid}`);
  }

  return (
    <>
      {deal.length > 0 ? (
        deal.map((deal) => (
          <Card key={deal?.uuid} className="card-next-appointment">
            <CardContent>
              <Box className="header-card-next-appointment">
                <Typography variant="h5">Next Appointment</Typography>
                <img className="dote" src={Dote} alt="dote" width={10} height={10} />
              </Box>

              <Box className="address-card-next-appointment">
                <img
                  src={deal?.imageUrl ?? defaultImage}
                  alt="Deal Image"
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                  }}
                />

                <Box marginLeft={1.5} fontSize={14}>
                  <Typography variant="body1" color="white">
                    {deal?.street}
                  </Typography>
                  <Typography variant="body2" color="#D6E1E6">
                    {deal?.city}, {deal?.state} {deal?.zipCode}
                  </Typography>
                </Box>
              </Box>

              <Box className="appointment-card">
                <Box fontSize={14}>
                  <Typography variant="body2" color="#D6E1E6">
                    Appointment Date
                  </Typography>
                  <Typography variant="body1" color="white">
                    {deal?.appointmentDate
                      ? new Date(deal.appointmentDate).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : ''}
                  </Typography>
                </Box>
              </Box>

              <Box className="room-people-card">
                <Box>
                  <Typography variant="body2" color="#D6E1E6">
                    Room Area
                  </Typography>
                  <Typography variant="body1" color="white">
                    {deal?.roomArea} M<sup style={{ fontSize: '0.6em' }}>2</sup>
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="#D6E1E6">
                    People
                  </Typography>
                  <Typography variant="body1" color="white">
                    {deal?.numberOfPeople}
                  </Typography>
                </Box>
              </Box>

              <Box className="footer-card-next-appointment">
                <Box display={'flex'} flexDirection={'column'}>
                  <Typography variant="body2" color="#D6E1E6">
                    Price
                  </Typography>
                  <Typography variant="body1" color="white">
                    ${deal?.price}
                  </Typography>
                </Box>

                <Button className="see-detail-next-appointment" variant="outlined" onClick={() => handleDealClick(deal.uuid)}>
                  See Detail
                </Button>
              </Box>

              <img src={Background} alt="Background" width={300} height={300} className="bg-image-next-appointment" />
            </CardContent>
          </Card>
        ))
      ) : (
        <Card
          className="card-next-appointment"
          sx={{
            height: { xs: 290, sm: 350, md: 400 },
          }}
        >
          <CardContent className="not-found-card-content">
            <Box className="box-content-not-found-next-appointment">
              <CalendarMonthOutlinedIcon className="icon-not-found-next-appointment" />
            </Box>

            <Box className="footer-card-next-appointment-not-found" sx={{ marginTop: 'auto' }}>
              <Button className="add-new-deal-not-found-next-appointment" variant="outlined" color="inherit" onClick={() => setIsModalOpen(true)}>
                Add Deal?
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      <SelectCustomerModal
        open={isModalOpen}
        onClose={(refresh: boolean) => {
          setIsModalOpen(false);
          if (refresh) setRefresh();
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
        onClose={(refresh: boolean) => {
          setAddNewDealOpen(false);
          if (refresh) {
            setRefresh();
          }
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

export default NextAppointmentCard;
