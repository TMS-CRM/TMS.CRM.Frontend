/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { yupResolver } from '@hookform/resolvers/yup';
import CancelIcon from '@mui/icons-material/Cancel';
import { Box, Button, Modal, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import React, { useEffect, useState } from 'react';
import './activity-form-modal.css';
import '../../styles/modal.css';
import { FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { type Activity, mockActivity } from '../../types/activity';
import AlertSnackbar from '../alert-snackbar/alert-snackbar';
import DatePickerController from '../form/date-picker-controller';
import TextFieldController from '../form/text-field-controller';

interface ActivityFormModalProps {
  open: boolean;
  onClose: () => void;
  activityId?: number;
  onActivityEdited: () => void;
}

interface FormValues {
  description: string;
  activityDate: Date;
  // image?: string;
}

const ActivityModal: React.FC<ActivityFormModalProps> = (props: ActivityFormModalProps) => {
  const [fileName, setFileName] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'saved' | 'deleted'>('saved');

  const schema = yup.object().shape({
    description: yup.string().required('activity description is required'),
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

  useEffect(() => {
    if (props.activityId) {
      const activity: Activity | undefined = mockActivity.find((act) => act.id === props.activityId);

      if (!activity) {
        return;
      }

      form.reset({
        description: activity.description,
        activityDate: new Date(activity.activityDate),
      });
    }
  }, [props.activityId, form]);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  }

  function onSubmit(): void {
    // console.log('Form submitted:', data);
    // form.reset();
    // props.onClose();
    // setSnackbarMessage('Activity Saved');
    // setSnackbarSeverity('saved');
    // setSnackbarOpen(true);
    // props.onActivityEdited();
  }

  function handleCancel(): void {
    form.reset();
    if (props.open) {
      props.onClose();
    }
  }

  function handleDelete(): void {
    props.onClose();
    form.reset();
    setSnackbarMessage('Activity Deleted');
    setSnackbarSeverity('deleted');
    setSnackbarOpen(true);
  }

  function handleSnackbarClose(): void {
    setSnackbarOpen(false);
  }

  return (
    <>
      <Modal open={props.open} onClose={props.onClose}>
        <Box
          className="box"
          sx={{
            width: { xs: 280, sm: 350, md: 400 },
            maxHeight: '90vh',
          }}
        >
          <Box className="form-title">
            <Typography variant="h5" marginBottom={0} color="secondary">
              {props.activityId ? 'Edit Activity' : ' '}
            </Typography>
            <Button sx={{ minWidth: 0, margin: 0 }} endIcon={<CancelIcon sx={{ color: '#7E92A2' }} />} onClick={handleCancel} />
          </Box>

          <FormProvider {...form}>
            <Grid container spacing={3} className="form-container">
              <Grid size={{ xs: 12, md: 12 }}>
                <Typography className="label">Description</Typography>
                <TextFieldController name="description" multiline rows={3} type="text" placeholder="Enter activity description" />
              </Grid>
              <Grid size={{ xs: 12, md: 12 }}>
                <Typography className="label">Activity Date</Typography>
                <DatePickerController name="activityDate" />
              </Grid>

              <Grid size={{ xs: 12, md: 12 }}>
                <Typography className="label">Images</Typography>
                <label htmlFor="upload-image" style={{ cursor: 'pointer' }}>
                  <input id="upload-image" name="file" type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                  <Button variant="contained" component="span" className="upload-button" sx={{ width: '100%' }}>
                    <span style={{ display: 'block' }}>{fileName || 'ADD'}</span>
                  </Button>
                </label>
              </Grid>

              <Grid size={{ xs: 12, md: 12 }} className="form-footer">
                {props.activityId && (
                  <Button onClick={handleDelete} variant="text" className="button-delete-activity">
                    Delete
                  </Button>
                )}

                <Button variant="contained" color="primary" className="save-button-activity" onClick={onSubmit}>
                  Save Activity
                </Button>
              </Grid>
            </Grid>
          </FormProvider>
        </Box>
      </Modal>

      <AlertSnackbar open={snackbarOpen} message={snackbarMessage} severity={snackbarSeverity} onClose={handleSnackbarClose} />
    </>
  );
};

export default ActivityModal;
