import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import './recent-deals-card.css';
import { useNavigate } from 'react-router-dom';
import defaultImage from '../../../../assets/default-image.jpg';
import EmptyState from '../../../../components/empty-state/empty-state';
import { api } from '../../../../services/api';
import { type Deal } from '../../../../types/deal';

interface RecentDealsCardProps {
  refreshKey: boolean;
}

const RecentDealsCard: React.FC<RecentDealsCardProps> = (props: RecentDealsCardProps) => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [page] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const limit = 4;

  const isFetchingRef = useRef(false);

  const navigate = useNavigate();

  useEffect(() => {
    void fetchDeals(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.refreshKey]);

  async function fetchDeals(currentPage: number): Promise<void> {
    if (isFetchingRef.current) {
      return;
    }

    isFetchingRef.current = true;
    setIsLoading(true);

    try {
      const response = await api.get<{ data: { items: Deal[]; total: number } }>(`/deals?sortBy=createdOn&order=desc&limit=${limit}&offset=0`);
      const responseData = response.data.data;

      setDeals((prevDeals) => (currentPage === 0 ? responseData.items : [...prevDeals, ...responseData.items]));
    } catch (error) {
      console.error('Error fetching deals:', error);
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }

  // function fetchDeals(): void {
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
  //     setDeals(responseData.items.slice(0, 4));
  //   } catch (error) {
  //     console.error('Error fetching deals:', error);
  //   } finally {
  //     setIsLoading(false);
  //     isFetchingRef.current = false;
  //   }
  // }

  return (
    <>
      <Card className="card-recent-deals">
        {isLoading ? (
          <EmptyState message="Loading recent deals..." />
        ) : deals.length === 0 ? (
          <EmptyState message="No deal found." icon={<BusinessCenterOutlinedIcon />} />
        ) : (
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
                <img src={deal.imageUrl ?? defaultImage} alt="Deal" width={44} height={44} style={{ borderRadius: '50%' }} />

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
        )}
      </Card>
    </>
  );
};

export default RecentDealsCard;
