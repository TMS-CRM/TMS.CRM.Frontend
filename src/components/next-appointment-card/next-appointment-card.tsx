import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import './next-appointment-card.css';
import { useNavigate } from 'react-router-dom';
import { type Deal, mockDeals } from '../../types/deal';
import DealFormModal from '../deal-form-modal/deal-form-modal';
import SelectCustomerModal from '../select-customer-modal/select-customer-modal';

const NextAppointmentCard: React.FC = () => {
  const navigate = useNavigate();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addNewDealOpen, setAddNewDealOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);

  useEffect(() => {
    if (mockDeals.length > 0) {
      const mostRecentDeal = mockDeals.reduce((prev, current) =>
        new Date(prev.appointmentDate) > new Date(current.appointmentDate) ? prev : current,
      );
      setDeal(mostRecentDeal);
    }
  }, []);

  if (!deal) {
    return (
      <>
        <Card
          className="card-next-appointment"
          // sx={{
          //   height: { xs: 290, sm: 350, md: 400 },
          //   display: 'flex',
          //   flexDirection: 'column',
          //   backgroundColor: '#514ef3',
          // }}
        >
          <CardContent
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box className="box-content-not-found-next-appointment">
              <CalendarMonthOutlinedIcon className="icon-not-found-next-appointment" />
              <Typography sx={{ alignItens: 'centre' }}>No upcoming appointments.</Typography>
            </Box>
          </CardContent>

          <Box
            sx={{
              padding: 2,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Button className="add-new-deal-not-found-next-appointment" variant="contained" color="secondary" onClick={() => setIsModalOpen(true)}>
              Add Deal?
            </Button>
          </Box>

          {/* <Image src={Background} alt="Background" width={300} height={300} className="bg-image-next-appointment" /> */}
        </Card>

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
  }

  function handleDealDetailsClick(e: React.MouseEvent): void {
    e.stopPropagation();
    void navigate(`deal/${deal!.id}`);
  }

  return (
    <Card onClick={() => void navigate(`deal/${deal.id}`)} className="card-next-appointment">
      <CardContent>
        <Box className="header-card-next-appointment">
          <Typography variant="h5">Next Appointment</Typography>
          {/* <Image className="dote" src={Dote} alt="dote" width={10} height={10} /> */}
        </Box>

        <Box className="address-card-next-appointment">
          {/* <Image src={deal.dealPicture} alt="Profile" width={44} height={44} style={{ borderRadius: '50%' }} /> */}
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

        {/* <Image src={Background} alt="Background" width={300} height={300} className="bg-image-next-appointment" /> */}
      </CardContent>
    </Card>
  );
};

export default NextAppointmentCard;
