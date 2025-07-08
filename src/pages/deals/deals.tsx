import AddIcon from '@mui/icons-material/Add';
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import { Backdrop, Button, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useEffect, useRef, useState } from 'react';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './deals.css';
import defaultImage from '../../assets/default-image.jpg';
import AlertSnackbar from '../../components/alert-snackbar/alert-snackbar';
import DealFormModal from '../../components/deal-form-modal/deal-form-modal';
import EmptyState from '../../components/empty-state/empty-state';
import SectionHeader from '../../components/section-header/section-header';
import SelectCustomerModal from '../../components/select-customer-modal/select-customer-modal';
import { useHeader } from '../../hooks/use-header';
import { api } from '../../services/api';
import type { Deal } from '../../types/deal';

const Deals: React.FC = () => {
  const { setTitle, setButton } = useHeader();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deals, setDeals] = useState<Deal[]>([]);
  const hasDeal = deals.length > 0;

  const [totalDeals, setTotalDeals] = useState<number>(0);
  const [selectedCustomerUuid, setSelectedCustomerUuid] = useState<string | null>(null);
  const [addNewDealOpen, setAddNewDealOpen] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);

  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'saved' | 'deleted'>('saved');

  const limit = 10;

  // modal fade transition loading
  const [isLoadingModalTransition, setIsLoadingModalTransition] = useState(false);

  // isLoading controls the UI display for loading state
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // isFetchingRef controls fetching state to avoid duplicates
  const isFetchingRef = useRef(false);

  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    setTitle('Deals');
    setButton(
      <Button
        className="add-new-header"
        variant="contained"
        endIcon={<AddIcon sx={{ color: 'white' }} />}
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        Add New Deal
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

  async function fetchDeals(currentPage: number): Promise<void> {
    if (isFetchingRef.current) {
      return;
    }

    isFetchingRef.current = true;
    setIsLoading(true);

    try {
      const response = await api.get<{ data: { items: Deal[]; total: number } }>(`/deals?limit=${limit}&offset=${page * limit}`);
      const responseData = response.data.data;

      setDeals((prevDeals) => (currentPage === 0 ? responseData.items : [...prevDeals, ...responseData.items]));
      setTotalDeals(responseData.total);
    } catch (error) {
      console.error('Error fetching deals:', error);
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }

  useEffect(() => {
    void fetchDeals(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function setPageAndRefresh(newPage: number): void {
    setPage(newPage);
    void fetchDeals(newPage);
  }

  function handleDealClick(dealUuid: string): void {
    void navigate(`/deal-details/${dealUuid}`);
  }

  const columnHeaders = [
    { label: 'Profile', icon: <InsertPhotoIcon /> },
    { label: 'Name' },
    { label: 'Area' },
    { label: 'Appointment Date' },
    { label: 'Price' },
    { label: 'Status' },
    { label: 'Edit', isRightAligned: true },
  ];

  return (
    <main>
      <Backdrop open={isLoadingModalTransition} sx={{ zIndex: 1500 }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Grid container sx={{ padding: { xs: '12px', sm: '16px', md: '24px' } }}>
        {isLoading ? (
          <Grid size={{ xs: 12 }} sx={{ textAlign: 'center', paddingTop: '150px' }}>
            <CircularProgress size={40} />
          </Grid>
        ) : !hasDeal ? (
          <EmptyState icon={<BusinessCenterOutlinedIcon />} message="No customers found." />
        ) : (
          <>
            <Grid size={{ xs: 12, md: 12 }}>
              <SectionHeader
                title="Deals"
                counter={totalDeals}
                sortByValue={[
                  'Date Created (Newest First)',
                  'Date Created (Oldest First)',
                  'Alphabetic (A-Z)',
                  'Alphabetic (Z-A)',
                  'Price (High to Low)',
                  'Price (Low to High)',
                  'Area (Largest First)',
                  'Area (Smallest First)',
                  'Status',
                  'Appointment Date',
                ]}
                filterOptions={['Status', 'Date Range', 'Price Range', 'Area']}
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
                    {deals.map((deal: Deal) => (
                      <React.Fragment key={deal.uuid}>
                        <TableRow
                          onClick={() => handleDealClick(deal.uuid)}
                          sx={{
                            cursor: 'pointer',
                            '&:hover': { backgroundColor: '#f9f9f9' },
                          }}
                        >
                          <TableCell>
                            <img src={deal.imageUrl ?? defaultImage} alt="Profile" width={44} height={44} style={{ borderRadius: '50%' }} />
                          </TableCell>

                          <TableCell>
                            <Typography variant="caption">
                              {deal.street}, {deal.city}, {deal.state}, {deal.zipCode}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption">{deal.roomArea} M&sup2;</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption">
                              {new Date(deal.appointmentDate).toLocaleString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption">${deal.price}</Typography>
                          </TableCell>
                          <TableCell>
                            <Button variant="contained" className={`status-button ${deal.progress}`}>
                              {deal.progress === 'InProgress' ? 'IN PROGRESS' : 'CLOSED'}
                            </Button>
                          </TableCell>
                          <TableCell>
                            <Typography sx={{ textAlign: 'right' }}>
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
                disabled={isLoading || deals.length >= totalDeals}
                onClick={() => setPageAndRefresh(page + 1)}
                sx={{ marginTop: '16px', justifyContent: 'center', display: 'flex' }}
              >
                Load more
              </Button>
            </Grid>
          </>
        )}
      </Grid>

      <SelectCustomerModal
        open={isModalOpen}
        onClose={(refresh: boolean) => {
          setIsModalOpen(false);
          if (refresh) setPageAndRefresh(0);
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
            setPageAndRefresh(0);
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
    </main>
  );
};

export default Deals;
