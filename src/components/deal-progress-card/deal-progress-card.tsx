import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import { Avatar, Box, Button, Card, CardContent, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useEffect, useState } from 'react';
import './deal-progress-card.css';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { type Activity } from '../../types/activity';
import { type Deal } from '../../types/deal';
import RadioIcon from '../radio-icon/radio-icon';

const DealProgressCard: React.FC = () => {
  const [deal, setDeal] = useState<Deal | null>(null);
  const [activity, setActivity] = useState<Activity[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  // Removed redundant useEffect that called an undefined fetchDealsAndFindLatest function

  useEffect(() => {
    async function fetchDealsAndFindLatest(): Promise<void> {
      try {
        setIsLoading(true);

        const response = await api.get<{ data: Deal[] }>('/deals?limit=1&offset=0');
        const deals = response.data.data;

        // if (deals.length === 0) return;

        // const mostRecentDeal = deals?.reduce((prev, current) =>
        //   new Date(prev.appointmentDate) > new Date(current.appointmentDate) ? prev : current,
        // );

        // setDeal(mostRecentDeal);

        // const activityResponse = await api.get<{ data: Activity[] }>(`/activity?dealId=${mostRecentDeal.uuid}`);
        // setActivity(activityResponse.data.data);
      } catch (error) {
        console.error('Failed to fetch deals', error);
      } finally {
        setIsLoading(false);
      }
    }

    void fetchDealsAndFindLatest();
  }, []);

  if (isLoading) {
    return <Typography sx={{ p: 4 }}>Loading deal...</Typography>;
  }

  if (!deal) {
    return (
      <Card
        className="recent-card"
        color="secondary"
        sx={{
          height: { xs: 290, sm: 350, md: 400 },
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <CardContent
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box className="deal-progress-not-found-card">
            <BusinessCenterOutlinedIcon className="icon-not-found-card" />
            <Typography>No deals in progress.</Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  function handleDealIdClick(): void {
    if (deal) {
      void navigate(`deal/${deal.uuid}`);
    }
  }

  return (
    <Card className="recent-card" onClick={handleDealIdClick}>
      <CardContent>
        <Grid container className="header-progress-card">
          <Grid size={{ xs: 12, md: 8 }} className="deal-profile">
            <Avatar src={deal.dealPicture} alt="Profile" />
            <Box>
              <Typography variant="body1">{deal.street}</Typography>
              <Typography variant="body2">
                {deal.city}, {deal.state} {deal.zipCode}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }} className="in-progress-button">
            <Button variant="contained" className="header-button">
              {deal.progress === 'inProgress' ? 'IN PROGRESS' : 'CLOSED'}
            </Button>
            <ArrowForwardOutlinedIcon className="arrow-icon" />
          </Grid>
        </Grid>

        {activity &&
          activity.slice(0, 4).map((act) => (
            <Box key={act.uuid} className="activities-container">
              <Box display="flex" alignItems="center" gap={1}>
                <RadioIcon />
                <Box>
                  <Typography variant="body2">{act.activityDate}</Typography>
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
    </Card>
  );
};

export default DealProgressCard;
