import GraphicEqOutlinedIcon from '@mui/icons-material/GraphicEqOutlined';
import { Box, Button, CardContent, CircularProgress, Grid, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import './activity-list.css';
import React from 'react';
import AlertSnackbar from '../../../../components/alert-snackbar/alert-snackbar';
import EmptyState from '../../../../components/empty-state/empty-state';
import RadioIcon from '../../../../components/radio-icon/radio-icon';
import { api } from '../../../../services/api';
import type { Activity } from '../../../../types/activity';
import EditActivityFormModal from '../edit-activity-form-modal/edit-activity-form-modal';

interface ActivityCardProps {
  dealUuid: string;
  forceRefresh: boolean;
  onForceRefreshed: () => void;
}

const ActivityList: React.FC<ActivityCardProps> = (props: ActivityCardProps) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [totalActivites, setTotalActivites] = useState<number>(0);

  const [editActivityOpen, setEditActivityOpen] = useState(false);
  const [selectedActivityUuid, setSelectedActivityUuid] = useState<string | null>(null);

  const [page, setPage] = useState<number>(0);
  const limit = 3;

  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'saved' | 'deleted'>('saved');

  // isLoading controls the UI display for loading state
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // isFetchingRef controls fetching state to avoid duplicates
  const isFetchingRef = useRef(false);

  // modal fade transition loading
  const [isLoadingModalTransition, setIsLoadingModalTransition] = useState(false);

  useEffect(() => {
    if (props.forceRefresh) {
      void forceRefresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.forceRefresh]);

  useEffect(() => {
    void fetchActivites(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function forceRefresh(): Promise<void> {
    await goToPage(0);
    props.onForceRefreshed();
  }

  async function goToPage(newPage: number): Promise<void> {
    setPage(newPage);
    await fetchActivites(newPage);
  }

  async function fetchActivites(currentPage: number): Promise<void> {
    if (isFetchingRef.current) {
      return;
    }

    isFetchingRef.current = true;
    setIsLoading(true);

    try {
      const response = await api.get<{ data: { items: Activity[]; total: number } }>(
        `/activities?limit=${limit}&offset=${currentPage * limit}&dealUuid=${props.dealUuid}`,
      );
      const responseData = response.data.data;

      setActivities(responseData.items);
      setTotalActivites(responseData.total);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      isFetchingRef.current = false;
      setIsLoading(false);
      setIsLoadingModalTransition(false);
    }
  }

  return (
    <>
      <CardContent className="card-activity-log">
        <Box className="header-activity-log">
          <Typography variant="h5" color="secondary">
            Activity Log
          </Typography>
        </Box>

        <>
          {isLoading ? (
            <Grid size={{ xs: 12 }} sx={{ textAlign: 'center', paddingTop: '150px' }}>
              <CircularProgress size={40} />
            </Grid>
          ) : activities.length > 0 ? (
            <Grid container>
              {activities.map((act) => (
                <Box
                  key={act.uuid}
                  className="box-content-activity-log"
                  onClick={() => {
                    setSelectedActivityUuid(act.uuid);
                    setEditActivityOpen(true);
                  }}
                >
                  <Grid size={{ xs: 2, sm: 2, md: 2, lg: 2 }} marginTop={2}>
                    <RadioIcon />
                  </Grid>

                  <Grid size={{ xs: 10, sm: 10, md: 10, lg: 10 }} flex={1}>
                    <Typography variant="body2">
                      {act.date
                        ? new Date(act.date).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : ''}
                    </Typography>
                    <Typography variant="body2" className="description-activity">
                      {act.description}
                    </Typography>
                    {act.image && (
                      <Box sx={{ overflow: 'hidden', marginTop: '12px' }}>
                        <img className="log-image-activity-log-card" src={act.image} alt="Activity" width={295} height={125} />
                      </Box>
                    )}
                  </Grid>
                </Box>
              ))}
            </Grid>
          ) : (
            <EmptyState icon={<GraphicEqOutlinedIcon />} message=" No activity found." />
          )}

          <Box display="flex" justifyContent="center" alignItems="center" padding={1.5} gap={2}>
            <Button
              variant="text"
              onClick={() => {
                void goToPage(Math.max(0, page - 1));
              }}
              disabled={page === 0 || isLoading}
            >
              Back
            </Button>

            <Typography variant="body2" color="text.secondary">
              {totalActivites > 0 ? `${page + 1} of ${Math.ceil(totalActivites / limit)}` : ''}
            </Typography>

            <Button
              variant="text"
              onClick={() => {
                const totalPages = Math.ceil(totalActivites / limit);
                if (page + 1 >= totalPages) return;

                setIsLoadingModalTransition(true);
                void goToPage(page + 1);
              }}
              disabled={page + 1 >= Math.ceil(totalActivites / limit) || isLoading || isLoadingModalTransition}
            >
              Load More
            </Button>
          </Box>
        </>
      </CardContent>

      <EditActivityFormModal
        open={editActivityOpen}
        onClose={() => {
          setEditActivityOpen(false);
        }}
        activityUuid={selectedActivityUuid!}
        onShowSnackbar={(message, severity) => {
          setSnackbarMessage(message);
          setSnackbarSeverity(severity);
          setSnackbarOpen(true);
        }}
        onUpdated={() => {
          void goToPage(0);
        }}
      />

      <AlertSnackbar open={snackbarOpen} message={snackbarMessage} severity={snackbarSeverity} onClose={() => setSnackbarOpen(false)} />
    </>
  );
};

ActivityList.displayName = 'ActivityList';

export default ActivityList;
