import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import './recent-deals-card.css';
import { useNavigate } from 'react-router-dom';
import { type Deal, mockDeals } from '../../types/deal';

const RecentDealsCard: React.FC = () => {
  const navigate = useNavigate();
  const [deal, setDeal] = useState<Deal | null>(null);

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
      <Card
        className="card-recent-deals"
        sx={{
          height: { xs: 290, sm: 350, md: 400 },
        }}
      >
        <CardContent>
          <Box className="recent-deals-not-found-card">
            <BusinessCenterOutlinedIcon className="icon-not-found-card" />
            <Typography>No deals found.</Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-recent-deals">
      <CardContent>
        <Box className="header-recent-deal">
          <Typography variant="h5" color="secondary">
            Recent Deals
          </Typography>
          <Button className="text-button-recent-deal" onClick={() => void navigate('/deal')} variant="text" color="primary">
            View All
          </Button>
        </Box>

        {mockDeals.slice(0, 4).map((deal) => (
          <Box className="deal-body-recent-deal" onClick={() => void navigate(`deal/${deal.id}`)} key={deal.id}>
            {/* <Image src={deal.dealPicture} alt="Deal" width={44} height={44} style={{ borderRadius: '50%' }} /> */}

            <Box className="details-body-recent-deal">
              <Box className="body-text-recent-deal">
                <Typography variant="body1">{deal.street}</Typography>
                <Typography variant="body2">{deal.city}</Typography>
              </Box>

              <Box className="body-text-recent-deal">
                <Typography variant="body1">{deal.price}</Typography>
                <Typography variant="body2">
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
          </Box>
        ))}
      </CardContent>
    </Card>
  );
};

export default RecentDealsCard;
