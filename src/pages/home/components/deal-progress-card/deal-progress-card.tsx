import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import { Avatar, Box, Button, Card, CardContent, Divider, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useEffect, useRef, useState } from 'react';
import './deal-progress-card.css';
import { useNavigate } from 'react-router-dom';
import EmptyState from '../../../../components/empty-state/empty-state';
import RadioIcon from '../../../../components/radio-icon/radio-icon';
import { api } from '../../../../services/api';
import { type Activity } from '../../../../types/activity';
import { type Deal } from '../../../../types/deal';
import { BusinessCenterOutlined } from '@mui/icons-material';

const DealProgressCard: React.FC = () => {
  const [deal, setDeal] = useState<Deal[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const navigate = useNavigate();

  const isFetchingRef = useRef(false);

  useEffect(() => {
    void fetchDealInProgressAndActivities();
  }, []);

  async function fetchDealInProgressAndActivities(): Promise<void> {
    if (isFetchingRef.current) {
      return;
    }

    isFetchingRef.current = true;
    setIsLoading(true);

    try {
      const response = await api.get<{ data: { items: Deal[] } }>(`/deals?sortBy=createdOn&order=desc&progress=InProgress&limit=1&offset=0`);
      const responseData = response.data.data;
      setDeal(responseData.items);

      if (responseData.items.length > 0) {
        const dealUuid = responseData.items[0].uuid;
        await fetchActivities(dealUuid);
      }
    } catch (error) {
      console.error('Error fetching deal in progress:', error);
    } finally {
      isFetchingRef.current = false;
      setIsLoading(false);
    }
  }

  // function fetchDealInProgressAndActivities(): void {
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
  //     setDeal(responseData.items);

  //     if (responseData.items.length > 0) {
  //       const dealUuid = responseData.items[0].uuid;
  //       await fetchActivities(dealUuid);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching deal in progress:', error);
  //   } finally {
  //     setIsLoading(false);
  //     isFetchingRef.current = false;
  //   }
  // }

  async function fetchActivities(dealUuid: string): Promise<void> {
    try {
      const response = await api.get<{ data: { items: Activity[] } }>(`/activities?limit=2&offset=0&dealUuid=${dealUuid}`);
      const responseData = response.data.data;

      setActivities(responseData.items);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      isFetchingRef.current = false;
    }
  }

  function handleDealClick(dealUuid: string): void {
    void navigate(`/deal-details/${dealUuid}`);
  }

  return (
    <>
      <Card className="recent-card">
        {isLoading ? (
          <EmptyState message="Loading deal and activities..." />
        ) : deal.length === 0 ? (
          <EmptyState message="No deal in progress." icon={<BusinessCenterOutlined />} />
        ) : (
          deal.map((deal: Deal) => (
            <CardContent key={deal.uuid} onClick={() => handleDealClick(deal.uuid)}>
              <Grid container className="header-progress-card">
                <Grid size={{ xs: 12, md: 8 }} className="deal-profile">
                  <Avatar src={deal.imageUrl} alt="Profile" />
                  <Box>
                    <Typography variant="body1">{deal.street}</Typography>
                    <Typography variant="body2">
                      {deal.city}, {deal.state} {deal.zipCode}
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }} className="in-progress-button">
                  <Button variant="contained" className="header-button">
                    {deal.progress === 'InProgress' ? 'IN PROGRESS' : 'CLOSED'}
                  </Button>
                  <ArrowForwardOutlinedIcon className="arrow-icon" />
                </Grid>
              </Grid>

              <Divider className="divider-deal-progress" />

              {activities &&
                activities.map((act) => (
                  <Box key={act.uuid} className="activities-container">
                    <Box display="flex" alignItems="center" gap={1}>
                      <RadioIcon />
                      <Box>
                        <Typography variant="body2">
                          {act.date
                            ? new Date(deal.appointmentDate).toLocaleString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })
                            : ''}
                        </Typography>

                        <Typography variant="body2" className="activity-details">
                          {act.description}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ))}

              <Box className="load-more-deal-progress">
                <Button variant="text" color="primary" className="footer-button">
                  Load More
                </Button>
              </Box>
            </CardContent>
          ))
        )}
      </Card>
    </>
  );
};

export default DealProgressCard;
