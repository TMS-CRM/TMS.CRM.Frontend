import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, CircularProgress, Container, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useRef, useState } from 'react';
import '../../../../styles/modal.css';
import './activity-form-card.css';
import { FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';
import DatePickerController from '../../../../components/form/date-picker-controller';
import TextFieldController from '../../../../components/form/text-field-controller';
import { api } from '../../../../services/api';

interface FormValues {
  description: string;
  date: Date;
  dealUuid: string;
}

interface ActivityFormCardProps {
  onActivityCreated: () => void;
  onShowSnackbar: (message: string, severity: 'saved' | 'deleted') => void;
  dealUuid: string;
}

const ActivityFormCard: React.FC<ActivityFormCardProps> = (props: ActivityFormCardProps) => {
  const [fileName, setFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFetchingRef = useRef(false);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  }

  const schema = yup.object().shape({
    dealUuid: yup.string().required('Deal is required'),
    description: yup.string().required('Task description is required'),
    date: yup.date().nullable().required('Appointment date is required'),
  });

  const form = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      description: '',
      date: undefined,
      dealUuid: props.dealUuid,
    },
  });

  async function onSubmit(formData: FormValues): Promise<void> {
    setIsSubmitting(true);

    try {
      await api.post('/activities', formData);

      props.onActivityCreated();

      form.reset();
      props.onShowSnackbar('Activity Saved', 'saved');
    } catch (error) {
      console.error('Error saving activity:', error);
      props.onShowSnackbar('Failed to save activity', 'deleted');
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleCancel(): void {
    form.reset();
  }

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
                <DatePickerController name="date" />
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
                <Button
                  // eslint-disable-next-line @typescript-eslint/no-misused-promises
                  onClick={form.handleSubmit(onSubmit)}
                  variant="contained"
                  color="primary"
                  className="save-button"
                  disabled={!form.formState.isDirty}
                >
                  {isSubmitting ? <CircularProgress size={20} color="inherit" /> : 'Save'}
                </Button>
              </Grid>
            </Grid>
          </FormProvider>
        </Box>
      </Container>
    </>
  );
};

export default ActivityFormCard;
