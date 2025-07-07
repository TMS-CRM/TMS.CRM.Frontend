import { PeopleAltOutlined } from '@mui/icons-material';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import AddIcon from '@mui/icons-material/Add';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import { Button, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import React, { useEffect, useRef, useState } from 'react';
import './customers.css';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import AlertSnackbar from '../../components/alert-snackbar/alert-snackbar';
import CustomerFormModal from '../../components/customer-form-modal/customer-form-modal';
import EmptyState from '../../components/empty-state/empty-state';
import SectionHeader from '../../components/section-header/section-header';
import { useHeader } from '../../hooks/use-header';
import { api } from '../../services/api';
import type { Customer } from '../../types/customer';

const Customers: React.FC = () => {
  const { setTitle, setButton } = useHeader();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const hasCustomers = customers.length > 0;

  const [totalCustomers, setTotalCustomers] = useState<number>(0);
  const [page, setPage] = useState<number>(0);

  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'saved' | 'deleted'>('saved');

  const limit = 10;

  // isLoading controls the UI display for loading state
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // isFetchingRef controls fetching state to avoid duplicates
  const isFetchingRef = useRef(false);

  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    setTitle('Customers');
    setButton(
      <Button className="add-new-header" variant="contained" endIcon={<AddIcon sx={{ color: 'white' }} />} onClick={() => setIsModalOpen(true)}>
        Add new customer
      </Button>,
    );
  }, [setTitle, setButton]);

  useEffect(() => {
    const state = location.state as { snackbarMessage?: string; snackbarSeverity?: 'saved' | 'deleted'; refresh?: boolean } | null;

    if (state?.snackbarMessage) {
      setSnackbarMessage(state.snackbarMessage);
      setSnackbarSeverity(state.snackbarSeverity ?? 'saved');
      setSnackbarOpen(true);
    }

    if (state?.refresh) {
      setPageAndRefresh(0);
    }

    // Clean up: remove state only after it's been used
    setTimeout(() => {
      window.history.replaceState({}, document.title);
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchCustomers(currentPage: number): Promise<void> {
    if (isFetchingRef.current) {
      return;
    }

    isFetchingRef.current = true;
    setIsLoading(true);

    try {
      const response = await api.get<{ data: { items: Customer[]; total: number } }>(`/customers?limit=${limit}&offset=${currentPage * limit}`);
      const responseData = response.data.data;

      setCustomers((prevCustomers) => (currentPage === 0 ? responseData.items : [...prevCustomers, ...responseData.items]));
      setTotalCustomers(responseData.total);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }

  useEffect(() => {
    void fetchCustomers(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function setPageAndRefresh(newPage: number): void {
    setPage(newPage);
    void fetchCustomers(newPage);
  }

  function handleCustomerClick(customerUuid: string): void {
    void navigate(`/customer-details/${customerUuid}`);
  }

  const columnHeaders = [
    { label: 'Profile', icon: <AccountBoxIcon /> },
    { label: 'Name' },
    { label: 'Email ' },
    { label: 'Phone' },
    { label: 'Address' },
    { label: 'Edit', isRightAligned: true },
  ];

  return (
    <main>
      <Grid container sx={{ padding: { xs: '12px', sm: '16px', md: '24px ' } }}>
        {isLoading ? (
          <Grid size={{ xs: 12 }} sx={{ textAlign: 'center', paddingTop: '150px' }}>
            <CircularProgress size={40} />
          </Grid>
        ) : !hasCustomers ? (
          <EmptyState icon={<PeopleAltOutlined />} message="No customers found." />
        ) : (
          <>
            <Grid size={{ xs: 12, md: 12 }}>
              <SectionHeader
                title="Customers"
                counter={totalCustomers}
                sortByValue={['Date Created', 'Alphabetic']}
                filterOptions={['Area', 'Price', 'Status']}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 12 }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      {columnHeaders.map((header, index) => (
                        <TableCell
                          key={index}
                          sx={{
                            textAlign: header.isRightAligned ? 'right' : 'left',
                          }}
                        >
                          {header.icon ?? header.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {customers.map((customer: Customer) => (
                      <React.Fragment key={customer.uuid}>
                        <TableRow sx={{ cursor: 'pointer' }} onClick={() => handleCustomerClick(customer.uuid)}>
                          <TableCell>
                            <img src={customer.avatar} alt="Profile" width={44} height={44} style={{ borderRadius: '50%' }} />
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption">
                              {customer.firstName} {customer.lastName}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption">{customer.email}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption">{customer.phone}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption">
                              {customer.street}, {customer.city}, {customer.state}, {customer.zipCode}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ textAlign: 'right' }}>
                              <DriveFileRenameOutlineOutlinedIcon />
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Button
                variant="outlined"
                disabled={isLoading || customers.length >= totalCustomers}
                onClick={() => setPageAndRefresh(page + 1)}
                sx={{ marginTop: '16px', justifyContent: 'center', display: 'flex' }}
              >
                Load more
              </Button>
            </Grid>
          </>
        )}
      </Grid>

      <CustomerFormModal
        open={isModalOpen}
        customerUuid={null}
        onClose={(refresh: boolean) => {
          console.log('CustomerFormModal chamou o onClose com refresh: ', refresh);
          setIsModalOpen(false);
          if (refresh) {
            setPageAndRefresh(0);
          }
        }}
        onShowSnackbar={(message, severity) => {
          setSnackbarMessage(message);
          setSnackbarSeverity(severity);
          setSnackbarOpen(true);
        }}
      />
      <AlertSnackbar open={snackbarOpen} message={snackbarMessage} severity={snackbarSeverity} onClose={() => setSnackbarOpen(false)} />
    </main>
  );
};

export default Customers;
