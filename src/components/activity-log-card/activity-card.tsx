'use client';

import React, { useState, useImperativeHandle, forwardRef, useEffect, useCallback } from 'react';
import Grid from '@mui/material/Grid';
import { CardContent, Typography, Box, Button } from '@mui/material';
import Image from 'next/image';
import './activity-card.css';
import { Activity, mockActivity } from '@/types/activity';
import RadioIcon from '@/components/radio-icon/radio-icon';
import GraphicEqOutlinedIcon from '@mui/icons-material/GraphicEqOutlined';
import { useParams } from 'next/navigation';
import ActivityModal from '@/components/activity-form-modal/activity-form-modal';

const ActivityCard = forwardRef((props, ref) => {
  const { id: dealId } = useParams();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [editActivityOpen, setEditActivityOpen] = useState(false);
  const [activityId, setActivityId] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const activitiesPerPage = 3;

  const loadActivities = useCallback(async () => {
    if (dealId) {
      const filteredActivities = mockActivity.filter((act) => act.dealId === Number(dealId));
      setActivities(filteredActivities);
    }
  }, [dealId]);

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  useImperativeHandle(ref, () => ({
    reload: loadActivities,
  }));

  const totalPages = Math.ceil(activities.length / activitiesPerPage);
  const currentPage = Math.floor(currentIndex / activitiesPerPage) + 1;
  if (!activities || activities.length === 0) {
    return (
      <CardContent className="card-activity-log">
        <Box className="not-found-activity-log">
          <GraphicEqOutlinedIcon />
          <Typography variant="body1" className="text-no-activity-found">
            No activity found.
          </Typography>
        </Box>
      </CardContent>
    );
  }
  const loadMore = () => {
    setCurrentIndex((prevIndex) => prevIndex + activitiesPerPage);
  };

  const goBack = () => {
    setCurrentIndex((prevIndex) => Math.max(0, prevIndex - activitiesPerPage));
  };

  const visibleActivities = activities.slice(currentIndex, currentIndex + activitiesPerPage);

  return (
    <>
      <CardContent className="card-activity-log">
        <Box className="header-activity-log">
          <Typography variant="h5" color="secondary">
            Activity Log
          </Typography>
        </Box>

        <Grid container>
          {visibleActivities.map((activity) => (
            <Box
              key={activity.id}
              className="box-content-activity-log"
              onClick={() => {
                setEditActivityOpen(true);
                setActivityId(activity.id);
              }}
            >
              <Grid size={{ xs: 2, sm: 2, md: 2, lg: 2 }} marginTop={2}>
                <RadioIcon />
              </Grid>

              <Grid size={{ xs: 10, sm: 10, md: 10, lg: 10 }} flex={1}>
                <Typography variant="body2">{activity.activityDate}</Typography>
                <Typography variant="body2" className="description-activity">
                  {activity.description}
                </Typography>
                {activity.image && (
                  <Box sx={{ overflow: 'hidden', marginTop: '12px' }}>
                    <Image className="log-image-activity-log-card" src={activity.image} alt="Activity" width={295} height={125} />
                  </Box>
                )}
              </Grid>
            </Box>
          ))}
        </Grid>

        <Box display="flex" justifyContent="center" alignItems="center" marginTop={4} gap={2}>
          <Button variant="text" color="primary" onClick={goBack} disabled={currentIndex === 0}>
            Back
          </Button>

          <Typography variant="body2" color="textSecondary">
            {currentPage} of {totalPages}
          </Typography>

          <Button variant="text" color="primary" onClick={loadMore} disabled={currentIndex + activitiesPerPage >= activities.length}>
            Load More
          </Button>
        </Box>
      </CardContent>

      <ActivityModal
        open={editActivityOpen}
        onClose={() => {
          setEditActivityOpen(false);
        }}
        activityId={Number(activityId)}
        onActivityEdited={() => loadActivities()}
      />
    </>
  );
});

ActivityCard.displayName = 'ActivityCard';

export default ActivityCard;
