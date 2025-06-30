import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmptyState from '../../components/empty-state/empty-state';
import SectionHeader from '../../components/section-header/section-header';
import { useHeader } from '../../hooks/use-header';
import { api } from '../../services/api';
import type { Deal } from '../../types/deal';
import './deals.css';
import { HeaderModalType } from '../../types/header-context';

const Deals: React.FC = () => {
  const { setTitle, setButtonTitle, setModalType } = useHeader();
  const [, setDealUuid] = useState<number | null>(null);

  const [deals, setDeals] = useState<Deal[]>([]);
  const [totalDeals, setTotalDeals] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0);
  const limit = 10;

  const navigate = useNavigate();

  useEffect(() => {
    setTitle('Deals');
    setButtonTitle?.('Add New Deal');
    setModalType(HeaderModalType.newDeal);
  }, [setTitle, setButtonTitle, setModalType]);

  useEffect(() => {
    void fetchDeals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  async function fetchDeals(): Promise<void> {
    try {
      setIsLoading(true);
      const response = await api.get<{ data: { items: Deal[]; total: number } }>(`/deals?limit=${limit}&offset=${page * limit}`);
      const responseData = response.data.data;
      console.log(responseData);

      setDeals((prevDeals) => (page === 0 ? responseData.items : [...prevDeals, ...responseData.items]));

      setTotalDeals(responseData.total);
    } catch (error) {
      console.error('Error fetching deals:', error);
    } finally {
      setIsLoading(false);
    }
  }

  // async function handleDealListChange(): Promise<void> {
  //   setPage(0);
  //   setDeals([]);
  //   await fetchDeals();
  // }

  if (isLoading) {
    return <EmptyState message={'Loading deals...'} />;
  }

  const hasDeal = deals.length > 0;

  if (!hasDeal) {
    return <EmptyState icon={<BusinessCenterOutlinedIcon />} message="No deals found." />;
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
      <Grid container sx={{ padding: { xs: '12px', sm: '16px', md: '24px' } }}>
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
                      onClick={() => {
                        setDealUuid(deal.uuid);
                        void navigate(`deal-details/${deal.uuid}`);
                      }}
                      sx={{
                        cursor: 'pointer',
                        '&:hover': { backgroundColor: '#f9f9f9' },
                      }}
                    >
                      <TableCell>
                        <img src={deal.dealPicture} alt="Profile" width={44} height={44} style={{ borderRadius: '50%' }} />
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
                          {deal.progress === 'inProgress' ? 'IN PROGRESS' : 'CLOSED'}
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
            // disabled={isLoading || tasks.length < totalDeals}
            onClick={() => setPage((prevPage) => prevPage + 1)}
            sx={{ marginTop: '16px', justifyContent: 'center', display: 'flex' }}
          >
            Load more
          </Button>
        </Grid>
      </Grid>
    </main>
  );
};

export default Deals;
