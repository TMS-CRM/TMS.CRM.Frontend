'use client';

import React from 'react';
import { useState } from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import '../../../../styles/modal.css';
import './activity-form-card.css';
import AlertSnackbar from '@/components/alert-snackbar/alert-snackbar';
import DatePickerController from '../../../../components/form/date-picker-controller';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Grid from '@mui/material/Grid';
import TextFieldController from '@/components/form/text-field-controller';

interface FormValues {
  description: string;
  activityDate: Date;
  // image: string;
}

interface ActivityFormCardProps {
  onActivityCreated: () => void;
}

const ActivityFormCard: React.FC<ActivityFormCardProps> = ({ onActivityCreated }) => {
  const [fileName, setFileName] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'saved' | 'deleted'>('saved');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const schema = yup.object().shape({
    description: yup.string().required('Task description is required'),
    activityDate: yup.date().required('Due date is required'),
    // image: yup.string(),
  });

  const form = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      description: undefined,
      activityDate: undefined,
      // image: undefined,
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    console.log('Form submitted:', data);
    form.reset();
    setSnackbarMessage('Activity Saved');
    setSnackbarSeverity('saved');
    setSnackbarOpen(true);
    onActivityCreated();
  });

  const handleCancel = () => {
    form.reset();
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Container className="container-record-activity">
        <Box className="box-record-activity">
          <Box className="header-record-activity">
            <Typography variant="h5" color="secondary">
              Record Activity
            </Typography>
          </Box>

          <FormProvider {...form}>
            <Grid container spacing={3} className="form-box-record-activity">
              <Grid size={{ xs: 12, md: 12 }}>
                <Typography variant="body1" className="label">
                  Description
                </Typography>
                <TextFieldController name="description" type="text" multiline rows={2} placeholder="Write your notes" />
              </Grid>
              <Grid size={{ xs: 12, md: 12 }}>
                <DatePickerController name="activityDate" />
              </Grid>

              <Grid size={{ xs: 12, md: 12 }}>
                <Typography variant="body1" className="label">
                  Images
                </Typography>
                <label htmlFor="upload-image" style={{ cursor: 'pointer' }}>
                  <input id="upload-image" name="file" type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                  <Button variant="contained" component="span" className="upload-button" sx={{ width: '100%' }}>
                    <span style={{ display: 'block' }}>{fileName || 'ADD'}</span>
                  </Button>
                </label>
              </Grid>

              <Grid size={{ xs: 12, md: 12 }} className="footer-record-activity">
                <Button aria-label="Cancel" onClick={handleCancel} variant="text" className="cancel-button">
                  Cancel
                </Button>
                <Button variant="contained" color="primary" className="save-button" onClick={onSubmit}>
                  Save
                </Button>
              </Grid>
            </Grid>
          </FormProvider>
        </Box>
      </Container>

      <AlertSnackbar open={snackbarOpen} message={snackbarMessage} severity={snackbarSeverity} onClose={handleSnackbarClose} />
    </>
  );
};

export default ActivityFormCard;
