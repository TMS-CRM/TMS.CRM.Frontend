import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import React, { useEffect, useState } from 'react';
import IconCustomers from '../../assets/icon-customer.png';
import IconDeals from '../../assets/icon-deals.png';
import CounterCard from './components/counter-card/counter-card';
import CustomersCard from './components/customer-card/customers-card';
import RecentDealsCard from './components/recent-deals-card/recent-deals-card';
import TaskCard from './components/task-card/task-card';
import AddNewModal from '../../components/add-new-modal/add-new-modal';
import DealProgressCard from '../../components/deal-progress-card/deal-progress-card';
import { useHeader } from '../../hooks/use-header';
import NextAppointmentCard from './components/next-appointment-card/next-appointment-card';

const Home: React.FC = () => {
  const { setTitle, setButton } = useHeader();
  // const [customerCount, setCustomerCount] = useState<number>(0);
  const [dealCount, setDealCount] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // setCustomerCount(mockCustomers.length);
    // setDealCount(mockDeals.length);
    // If using an API, you can fetch the counts here:
    // fetch('/api/customers')
    //   .then((response) => response.json())
    //   .then((data) => setCustomerCount(data.length));
    // fetch('/api/deals')
    //   .then((response) => response.json())
    //   .then((data) => setDealCount(data.length));
  }, []);

  useEffect(() => {
    setTitle('Dashboard');
    setButton(
      <Button className="add-new-header" variant="contained" endIcon={<AddIcon sx={{ color: 'white' }} />} onClick={() => setIsModalOpen(true)}>
        Add new
      </Button>,
    );
  }, [setTitle, setButton]);

  return (
    <>
      <Grid container sx={{ padding: { xs: '12px', sm: '0px', md: '0px' } }}>
        <Grid size={{ xs: 12, md: 4, lg: 2.5 }} sx={{ padding: { xs: '12px', sm: '16px', md: '24px' } }}>
          <Grid container>
            <Grid size={{ xs: 12, sm: 6, md: 12, lg: 12 }}>
              <NextAppointmentCard />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 12, lg: 12 }}>
              <CounterCard title="Customers" count={0} iconCounter={IconCustomers} />
              <CounterCard title="Deals" count={dealCount} iconCounter={IconDeals} />
            </Grid>
          </Grid>
        </Grid>

        <Grid size={{ xs: 12, md: 8, lg: 6 }} sx={{ padding: { xs: '12px, 12px, 12px, 0', sm: '16px 16px 16px 0', md: '24px 24px 24px 0' } }}>
          <RecentDealsCard />
          <DealProgressCard />
        </Grid>

        <Grid size={{ xs: 12, md: 12, lg: 3.5 }}>
          <CustomersCard />
          <TaskCard />
        </Grid>
      </Grid>
      <AddNewModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default Home;
