import AddIcon from '@mui/icons-material/Add';
import { CircularProgress } from '@mui/material';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import IconCustomers from '../../assets/icon-customer.png';
import IconDeals from '../../assets/icon-deals.png';
import CounterCard from './components/counter-card/counter-card';
import CustomersCard from './components/customer-card/customers-card';
import DealProgressCard from './components/deal-progress-card/deal-progress-card';
import RecentDealsCard from './components/recent-deals-card/recent-deals-card';
import TaskCard from './components/task-card/task-card';
import AddNewModal from '../../components/add-new-modal/add-new-modal';
import { useHeader } from '../../hooks/use-header';
import NextAppointmentCard from './components/next-appointment-card/next-appointment-card';
import { api } from '../../services/api';

const Home: React.FC = () => {
  const { setTitle, setButton } = useHeader();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [customerRefreshKey, setCustomerRefreshKey] = useState<number>(0);
  const [dealRefreshKey, setDealRefreshKey] = useState<number>(0);

  const [totalDeals, setTotalDeals] = useState<number>(0);
  const [totalCustomers, setTotalCustomers] = useState<number>(0);
  const [page] = useState<number>(0);
  const limit = 10;

  // isLoading controls the UI display for loading state
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const isFetchingDealsRef = useRef(false);
  const isFetchingCustomersRef = useRef(false);

  const navigate = useNavigate();

  async function fetchDeals(): Promise<void> {
    if (isFetchingDealsRef.current) {
      return;
    }

    setIsLoading(true);
    isFetchingDealsRef.current = true;

    try {
      const response = await api.get<{ data: { total: number } }>(`/deals?limit=${limit}&offset=${page * limit}`);
      const responseData = response.data.data;

      setTotalDeals(responseData.total);
    } catch (error) {
      console.error('Error fetching deals:', error);
    } finally {
      isFetchingDealsRef.current = false;
      setIsLoading(false);
    }
  }

  async function fetchCustomers(): Promise<void> {
    if (isFetchingCustomersRef.current) {
      return;
    }

    isFetchingCustomersRef.current = true;
    setIsLoading(true);

    try {
      const response = await api.get<{ data: { total: number } }>(`/customers?limit=${limit}&offset=${page * limit}`);

      const responseData = response.data.data;

      setTotalCustomers(responseData.total);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setIsLoading(false);
      isFetchingCustomersRef.current = false;
    }
  }

  useEffect(() => {
    void fetchCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    void fetchDeals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      {isLoading ? (
        <Grid size={{ xs: 12 }} sx={{ textAlign: 'center', paddingTop: '150px' }}>
          <CircularProgress size={40} />
        </Grid>
      ) : (
        <Grid container sx={{ padding: { xs: '12px', sm: '0px', md: '0px' } }}>
          <Grid size={{ xs: 12, md: 4, lg: 2.5 }} sx={{ padding: { xs: '12px', sm: '16px', md: '24px' } }}>
            <Grid container>
              <Grid size={{ xs: 12, sm: 6, md: 12, lg: 12 }}>
                <NextAppointmentCard refreshKey={dealRefreshKey} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 12, lg: 12 }}>
                <CounterCard title="Customers" count={totalCustomers} iconCounter={IconCustomers} onClick={() => void navigate(`/customers`)} />
                <CounterCard title="Deals" count={totalDeals} iconCounter={IconDeals} onClick={() => void navigate(`/deals`)} />
              </Grid>
            </Grid>
          </Grid>

          <Grid size={{ xs: 12, md: 8, lg: 6 }} sx={{ padding: { xs: '12px, 12px, 12px, 0', sm: '16px 16px 16px 0', md: '24px 24px 24px 0' } }}>
            <RecentDealsCard refreshKey={dealRefreshKey} />
            <DealProgressCard refreshKey={dealRefreshKey} />
          </Grid>

          <Grid size={{ xs: 12, md: 12, lg: 3.5 }}>
            <CustomersCard refreshKey={customerRefreshKey} />
            <TaskCard />
          </Grid>
        </Grid>
      )}
      <AddNewModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        onCustomerCreated={() => setCustomerRefreshKey((prev) => prev + 1)}
        onDealCreated={() => setDealRefreshKey((prev) => prev + 1)}
      />
    </>
  );
};

export default Home;
