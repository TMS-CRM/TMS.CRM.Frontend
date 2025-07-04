/* eslint-disable @typescript-eslint/no-unsafe-return */

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { PeopleAltOutlined } from '@mui/icons-material';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import { Avatar, Box, Button, Card, CardContent, Typography } from '@mui/material';
import './customer-card.css';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmptyState from '../../../../components/empty-state/empty-state';
import { api } from '../../../../services/api';
import type { Customer } from '../../../../types/customer';

const EditIcon = <DriveFileRenameOutlineOutlinedIcon className="edit-icon-customer-card" />;

const CustomerCard: React.FC = () => {
  // const [customerUuid, setCustomerUuid] = useState<number | null>(null);
  const navigate = useNavigate();

  const isFetchingRef = useRef(false);

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page] = useState(0);
  const limit = 3;

  useEffect(() => {
    void fetchCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  async function fetchCustomers(): Promise<void> {
    if (isFetchingRef.current) {
      return;
    }

    isFetchingRef.current = true;
    setIsLoading(true);

    try {
      const response = await api.get(`/customers?limit=${limit}&offset=${page * limit}`);
      const responseData = response.data.data;

      setCustomers((prevCustomers) => (page === 0 ? responseData.items : [...prevCustomers, ...responseData.items]));
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }

  if (isLoading) {
    return <EmptyState message={'Loading tasks...'} />;
  }

  const hasCustomers = customers.length > 0;

  if (!hasCustomers) {
    return (
      <Card
        className="customer-card"
        sx={{
          height: { xs: 290, sm: 350, md: 400 },
        }}
      >
        <CardContent>
          <Box className="header-customer-card">
            <Typography variant="h5" color="secondary">
              Customers
            </Typography>
          </Box>

          <Box className="not-found-customer-card">
            <PeopleAltOutlined className="icon-not-found-card" />
            <Typography>No customers found.</Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  function handleCustomerClick(): void {
    void navigate('/customers');
  }

  return (
    <Card className="customer-card">
      <CardContent>
        <Box className="header-customer-card">
          <Typography variant="h5" color="secondary">
            Customers
          </Typography>
          <Button className="text-button-recent-deal" onClick={handleCustomerClick} variant="text" color="primary">
            View All
          </Button>
        </Box>

        <Box>
          {customers.map((customer: Customer) => (
            <Fragment key={customer.uuid}>
              <Box
                onClick={(): void => {
                  void navigate(`customer-details/${customer.uuid}`);
                }}
                className="customer"
              >
                <Avatar src={customer.avatar} alt={`${customer.firstName} ${customer.lastName}`} />
                <Box width="100%">
                  <Typography variant="body1">
                    {customer.firstName} {customer.lastName}
                  </Typography>
                  <Typography variant="body2">{customer.email}</Typography>
                </Box>
                <Box className="edit-icon-customer-card" marginLeft={1}>
                  {EditIcon}
                </Box>
              </Box>
            </Fragment>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default CustomerCard;
