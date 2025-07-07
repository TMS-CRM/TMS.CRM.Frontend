import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import './recent-deals-card.css';
import { useNavigate } from 'react-router-dom';
import EmptyState from '../../../../components/empty-state/empty-state';
import { api } from '../../../../services/api';
import { type Deal } from '../../../../types/deal';

const RecentDealsCard: React.FC = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const limit = 4;

  const isFetchingRef = useRef(false);

  const navigate = useNavigate();

  useEffect(() => {
    void fetchDeals();
  }, [page]);

  // async function fetchDeals(): Promise<void> {
  //   if (isFetchingRef.current) {
  //     return;
  //   }

  //   isFetchingRef.current = true;
  //   setIsLoading(true);

  //   try {
  //     const response = await api.get<{ data: { items: Deal[]; total: number } }>(`/deals?sortBy=createdOn&order=desc&limit=${limit}&offset=0`);
  //     const responseData = response.data.data;
  //     setDeals(responseData.items);
  //   } catch (error) {
  //     console.error('Error fetching deals:', error);
  //   } finally {
  //     setIsLoading(false);
  //     isFetchingRef.current = false;
  //   }
  // }

  function fetchDeals(): void {
    if (isFetchingRef.current) {
      return;
    }

    isFetchingRef.current = true;
    setIsLoading(true);

    try {
      const response = {
        data: {
          data: {
            items: [],
            total: 0,
          },
        },
      };
      const responseData = response.data.data;
      setDeals(responseData.items.slice(0, 4));
    } catch (error) {
      console.error('Error fetching deals:', error);
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }

  return (
    <>
      {deals.length > 0 ? (
        <Card className="card-recent-deals">
          <CardContent>
            <Box className="header-recent-deal">
              <Typography variant="h5" color="secondary">
                Recent Deals
              </Typography>
              <Button className="text-button-recent-deal" onClick={() => void navigate('/deals')} variant="text" color="primary">
                View All
              </Button>
            </Box>

            {deals.map((deal) => (
              <Box className="deal-body-recent-deal" onClick={() => void navigate(`/deal-details/${deal.uuid}`)} key={deal.uuid}>
                <img src={deal.imageUrl} alt="Deal" width={44} height={44} style={{ borderRadius: '50%' }} />

                <Box className="details-body-recent-deal">
                  <Box className="body-text-recent-deal">
                    <Typography variant="body1">{deal.street}</Typography>
                    <Typography variant="body2">{deal.city}</Typography>
                  </Box>

                  <Box className="body-text-recent-deal">
                    <Typography variant="body1">${deal.price}</Typography>
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
      ) : (
        <Card
          className="card-recent-deals"
          sx={{
            height: { xs: 290, sm: 350, md: 400 },
          }}
        >
          <CardContent>
            <EmptyState message="No deal found." icon={<BusinessCenterOutlinedIcon />} />
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default RecentDealsCard;
