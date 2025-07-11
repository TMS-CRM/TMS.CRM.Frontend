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

interface CustomerCardProps {
  refreshKey: number;
}

const CustomerCard: React.FC<CustomerCardProps> = (props: CustomerCardProps) => {
  // const [customerUuid, setCustomerUuid] = useState<number | null>(null);
  const navigate = useNavigate();

  const isFetchingRef = useRef(false);

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [page] = useState(0);
  const limit = 3;

  useEffect(() => {
    void fetchCustomers(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.refreshKey]);

  async function fetchCustomers(currentPage: number): Promise<void> {
    if (isFetchingRef.current) {
      return;
    }

    isFetchingRef.current = true;
    setIsLoading(true);

    try {
      const response = await api.get<{ data: { items: Customer[]; total: number } }>(`/customers?limit=${limit}&offset=${page * limit}`);
      const responseData = response.data.data;

      setCustomers((prevCustomers) => (currentPage === 0 ? responseData.items : [...prevCustomers, ...responseData.items]));
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      isFetchingRef.current = false;
      setIsLoading(false);
    }
  }

  // function fetchCustomers(): void {
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

  //     setCustomers((prevCustomers) => (page === 0 ? responseData.items : [...prevCustomers, ...responseData.items]));
  //   } catch (error) {
  //     console.error('Error fetching tasks:', error);
  //   } finally {
  //     setIsLoading(false);
  //     isFetchingRef.current = false;
  //   }
  // }

  function handleCustomerClick(): void {
    void navigate('/customers');
  }

  return (
    <>
      <Card className="customer-card">
        {isLoading ? (
          <EmptyState message="Loading customers..." />
        ) : customers.length === 0 ? (
          <EmptyState message="No customers found." icon={<PeopleAltOutlined />} />
        ) : (
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
        )}
      </Card>
    </>
  );
};

export default CustomerCard;
