import { yupResolver } from '@hookform/resolvers/yup';
import CancelIcon from '@mui/icons-material/Cancel';
import { CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import React, { useEffect, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';
import '../../styles/modal.css';
import { api } from '../../services/api';
import type { User } from '../../types/user';
import AlertSnackbar from '../alert-snackbar/alert-snackbar';
import TextFieldController from '../form/text-field-controller';

interface UserModalProps {
  onShowSnackbar: (message: string, severity: 'saved' | 'deleted') => void;
  open: boolean;
  onClose: (refresh: boolean) => void;
  userUuid: string | null;
}

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
}

const NewUserModal: React.FC<UserModalProps> = (props: UserModalProps) => {
  const [fileName, setFileName] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  }

  const schema = yup.object().shape({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    email: yup.string().required('Email is required'),
  });

  const form = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: undefined,
      lastName: undefined,
      email: undefined,
    },
  });

  async function onSubmit(formData: FormValues): Promise<void> {
    setIsSubmitting(true);

    try {
      await api.post(`/users`, formData);

      form.reset();
      props.onClose(true);

      props.onShowSnackbar('User Saved', 'saved');
    } catch (error) {
      console.error('Error saving task:', error);
      props.onShowSnackbar('Failed to save task', 'deleted');
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleCancel(): void {
    form.reset();
    if (props.open) {
      props.onClose(false);
    }
  }

  return (
    <>
      <Modal open={props.open} onClose={() => props.onClose(false)}>
        <Box
          className="box"
          sx={{
            width: { xs: 300, sm: 480, md: 500 },
          }}
        >
          <Box className="form-title">
            <Typography variant="h5" className="title-header-modal">
              Add New User
            </Typography>
            <Button endIcon={<CancelIcon className="close-icon" />} onClick={handleCancel} />{' '}
          </Box>

          <FormProvider {...form}>
            <Box className="form-container">
              <div>
                <Typography variant="body1" className="label">
                  Avatar
                </Typography>
                <label htmlFor="upload-image" style={{ cursor: 'pointer' }}>
                  <input id="upload-image" name="file" type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                  <Button variant="contained" component="span" className="upload-button">
                    <span style={{ display: 'block' }}>{fileName || 'ADD'}</span>
                  </Button>
                </label>
              </div>

              <Grid container width={'100%'}>
                <Grid size={{ xs: 12, md: 12 }}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography variant="body1" className="label">
                        First Name
                      </Typography>
                      <TextFieldController name="firstName" type="text" />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography variant="body1" className="label">
                        Last Name
                      </Typography>
                      <TextFieldController name="lastName" type="text" />
                    </Grid>
                  </Grid>
                  <Grid container spacing={2} marginTop={'24px'}>
                    <Grid size={{ xs: 12, md: 12 }}>
                      <Typography variant="body1" className="label">
                        Email
                      </Typography>
                      <TextFieldController name="email" type="text" />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              <Grid container marginTop={'12px'}>
                <Grid size={{ xs: 12, md: 12 }} className="form-footer">
                  <Button variant="outlined" onClick={handleCancel} className="cancel-button">
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    // eslint-disable-next-line @typescript-eslint/no-misused-promises
                    onClick={form.handleSubmit(onSubmit)}
                    className="save-button"
                    disabled={!form.formState.isDirty}
                  >
                    {isSubmitting ? <CircularProgress size={20} color="inherit" /> : 'Save User'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </FormProvider>
        </Box>
      </Modal>
    </>
  );
};

export default NewUserModal;
