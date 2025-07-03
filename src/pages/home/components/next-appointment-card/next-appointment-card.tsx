import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import './next-appointment-card.css';
import { useNavigate } from 'react-router-dom';
import Background from '../../../../assets/background.png';
import Dote from '../../../../assets/dote.png';
import type { Deal } from '../../../../types/deal';

const NextAppointmentCard: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [deal, setDeal] = useState<Deal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addNewDealOpen, setAddNewDealOpen] = useState(false);
  const [selectedCustomerUuid, setSelectedCustomerUuid] = useState<number | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/require-await
    async function fetchNextAppointment(): Promise<void> {
      try {
        setIsLoading(true);

        // const response = await api.get<{ data: Deal[] }>('/deals?limit=1&offset=0');
        // const deals = response.data.data;

        // const now = new Date();

        // const upcomingDeals = deals?.filter((deal) => new Date(deal.appointmentDate) > now);

        // if (upcomingDeals.length > 0) {
        //   const nextDeal = upcomingDeals.reduce((prev, current) =>
        //     new Date(prev.appointmentDate) < new Date(current.appointmentDate) ? prev : current,
        //   );

        //   setDeal(nextDeal);
        // } else {
        //   setDeal(null);
        // }
      } catch (error) {
        console.error('Failed to fetch upcoming appointments', error);
      } finally {
        setIsLoading(false);
      }
    }

    void fetchNextAppointment();
  }, []);

  if (!deal) {
    return (
      <>
        <Card className="card-next-appointment">
          <CardContent
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box className="box-content-not-found-next-appointment">
              <CalendarMonthOutlinedIcon className="icon-not-found-next-appointment" />
            </Box>
          </CardContent>

          <Box
            sx={{
              padding: 2,
              display: 'flex',
              justifyContent: 'center',
              height: 'auto',
            }}
          >
            <Button className="add-new-deal-not-found-next-appointment" variant="contained" color="secondary" onClick={() => setIsModalOpen(true)}>
              Add Deal?
            </Button>
          </Box>

          <img src={Background} alt="Background" width={300} height={300} className="bg-image-next-appointment" />
        </Card>

        {/* <SelectCustomerModal
          open={!!isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCustomerSelected={(customerUuid) => {
            setSelectedCustomerUuid(customerUuid);
            setIsModalOpen(false);
            setAddNewDealOpen(true);
          }}
        />
        {selectedCustomerUuid && (
          <DealFormModal
            open={addNewDealOpen}
            onClose={() => {
              setAddNewDealOpen(false);
            }}
            onChangeCustomerRequested={() => {
              setAddNewDealOpen(false);
              setIsModalOpen(true);
            }}
            customerUuid={selectedCustomerUuid}
          />
        )} */}
      </>
    );
  }

  function handleDealDetailsClick(e: React.MouseEvent): void {
    e.stopPropagation();
    void navigate(`deal/${deal!.uuid}`);
  }

  return (
    <Card onClick={() => void navigate(`deal/${deal.uuid}`)} className="card-next-appointment">
      <CardContent>
        <Box className="header-card-next-appointment">
          <Typography variant="h5">Next Appointment</Typography>
          <img className="dote" src={Dote} alt="dote" width={10} height={10} />
        </Box>

        <Box className="address-card-next-appointment">
          <img src={deal.imageUrl} alt="Profile" width={44} height={44} style={{ borderRadius: '50%' }} />
          <Box marginLeft={1.5} fontSize={14}>
            <Typography variant="body1" color="white">
              {deal.street}
            </Typography>
            <Typography variant="body2" color="#D6E1E6">
              {deal.city}, {deal.state} {deal.zipCode}
            </Typography>
          </Box>
        </Box>

        <Box className="appointment-card">
          <Box fontSize={14}>
            <Typography variant="body2" color="#D6E1E6">
              Appointment Date
            </Typography>
            <Typography variant="body1" color="white">
              {new Date(deal.appointmentDate)
                .toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
                .replace(',', '')}
            </Typography>
          </Box>
        </Box>

        <Box className="room-people-card">
          <Box>
            <Typography variant="body2" color="#D6E1E6">
              Room Area
            </Typography>
            <Typography variant="body1" color="white">
              {deal.roomArea} M<sup style={{ fontSize: '0.6em' }}>2</sup>
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="#D6E1E6">
              People
            </Typography>
            <Typography variant="body1" color="white">
              {deal.numberOfPeople}
            </Typography>
          </Box>
        </Box>

        <Box className="footer-card-next-appointment">
          <Box display={'flex'} flexDirection={'column'}>
            <Typography variant="body2" color="#D6E1E6">
              Price
            </Typography>
            <Typography variant="body1" color="white">
              ${deal.price}
            </Typography>
          </Box>

          <Button className="see-detail-next-appointment" variant="outlined" onClick={handleDealDetailsClick}>
            See Detail
          </Button>
        </Box>

        <img src={Background} alt="Background" width={300} height={300} className="bg-image-next-appointment" />
      </CardContent>
    </Card>
  );
};

export default NextAppointmentCard;
