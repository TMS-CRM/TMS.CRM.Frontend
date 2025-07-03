import { yupResolver } from '@hookform/resolvers/yup';
import CancelIcon from '@mui/icons-material/Cancel';
import { Box, Button, CircularProgress, Modal, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import React, { useEffect, useRef, useState } from 'react';
import './edit-activity-form-modal.css';
import '../../../../styles/modal.css';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import AlertSnackbar from '../../../../components/alert-snackbar/alert-snackbar';
import DatePickerController from '../../../../components/form/date-picker-controller';
import TextFieldController from '../../../../components/form/text-field-controller';
import { api } from '../../../../services/api';
import type { Activity } from '../../../../types/activity';

interface ActivityFormModalProps {
  open: boolean;
  onClose: () => void;
  activityUuid: string;
  dealUuid: string;
  onShowSnackbar: (message: string, severity: 'saved' | 'deleted') => void;
  // onActivityEdited: () => void;
}

interface FormValues {
  description: string;
  date: Date;
  // image?: string;
}

const ActivityModal: React.FC<ActivityFormModalProps> = (props: ActivityFormModalProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'saved' | 'deleted'>('saved');

  const isFetchingRef = useRef(false);

  const navigate = useNavigate();

  const [fileName, setFileName] = useState('');
  const defaultImage = 'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg';

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  }

  const schema = yup.object().shape({
    description: yup.string().required('activity description is required'),
    date: yup.date().required('Due date is required'),
  });

  const form = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      description: undefined,
      date: undefined,
    },
  });

  useEffect(() => {
    if (props.activityUuid && !isFetchingRef.current) {
      async function fetchActivity(): Promise<void> {
        if (isFetchingRef.current) {
          return;
        }

        try {
          setIsLoading(true);
          const response = await api.get<{ data: Activity }>(`/activities/${props.activityUuid}`);
          const responseData = response.data.data;

          form.reset({
            description: responseData.description,
            date: responseData.date ? new Date(responseData.date) : undefined,
          });
        } catch (error) {
          console.error('Failed to fetch activity', error);
        } finally {
          setIsLoading(false);
        }
      }

      void fetchActivity();
    } else {
      form.reset({
        description: undefined,
        date: undefined,
      });
    }
  }, [props.activityUuid, form]);

  async function onSubmit(formData: FormValues): Promise<void> {
    try {
      if (props.activityUuid) {
        setIsSubmitting(true);

        await api.put(`/activities/${props.activityUuid}`, formData);

        setIsSubmitting(false);
      } else {
        return;
      }

      form.reset();
      props.onClose();

      props.onShowSnackbar?.('Activity Saved', 'saved');
    } catch (error) {
      console.error('Error saving deal:', error);
      props.onShowSnackbar?.('Failed to save activity', 'deleted');
    }
  }

  function handleCancel(): void {
    form.reset();
    if (props.open) {
      props.onClose();
    }
  }

  async function handleDelete(): Promise<void> {
    if (!props.activityUuid) return;

    try {
      await api.delete(`/activities/${props.activityUuid}`);
      await navigate(`/deal-details/${props.dealUuid}`, {
        state: {
          snackbarMessage: 'Deal deleted',
          snackbarSeverity: 'deleted',
          refresh: true,
        },
      });
    } catch (error) {
      console.error('Error deleting deal:', error);
      setSnackbarMessage('Failed to delete deal');
      setSnackbarSeverity('deleted');
      setSnackbarOpen(true);
    }
  }

  return (
    <>
      <Modal open={props.open} onClose={props.onClose}>
        <Box
          className="box"
          sx={{
            width: { xs: 280, sm: 350, md: 400 },
          }}
        >
          <Box className="form-title">
            <Typography variant="h5" marginBottom={0} color="secondary">
              {props.activityUuid ? 'Edit Activity' : ' '}
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
                <DatePickerController name="date" />
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
                {props.activityUuid && (
                  <Button
                    onClick={() => {
                      void handleDelete();
                    }}
                    variant="text"
                    className="button-delete-activity"
                  >
                    Delete
                  </Button>
                )}

                <Button
                  // eslint-disable-next-line @typescript-eslint/no-misused-promises
                  onClick={form.handleSubmit(onSubmit)}
                  variant="contained"
                  color="primary"
                  className="save-button-activity"
                  disabled={!form.formState.isDirty}
                >
                  {isSubmitting ? <CircularProgress size={20} color="inherit" /> : 'Save activity'}
                </Button>
              </Grid>
            </Grid>
          </FormProvider>
        </Box>
      </Modal>

      <AlertSnackbar open={snackbarOpen} message={snackbarMessage} severity={snackbarSeverity} onClose={() => setSnackbarOpen(false)} />
    </>
  );
};

export default ActivityModal;
