import CancelIcon from '@mui/icons-material/Cancel';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';
import * as yup from 'yup';
import '../../styles/modal.css';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import AlertSnackbar from '../alert-snackbar/alert-snackbar';
import TextFieldController from '../form/text-field-controller';

interface NewUserModalProps {
  open: boolean;
  onClose: () => void;
}

interface Name {
  firstName: string;
  lastName: string;
}

interface FormValues {
  name: Name;
  email: string;
}

const NewUserModal: React.FC<NewUserModalProps> = ({ open, onClose }) => {
  const [fileName, setFileName] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'saved' | 'deleted'>('saved');

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  }

  const schema = yup.object().shape({
    name: yup.object().shape({
      firstName: yup.string().required('First name is required'),
      lastName: yup.string().required('Last name is required'),
    }),
    email: yup.string().required('Email is required'),
  });

  const form = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: {
        firstName: undefined,
        lastName: undefined,
      },
      email: undefined,
    },
  });

  function onSubmit(): () => void {
    return form.handleSubmit((): void => {
      form.reset();
      onClose();
      setSnackbarMessage('User Saved');
      setSnackbarSeverity('saved');
      setSnackbarOpen(true);
    });
  }

  function handleCancel(): void {
    setFileName('');
    form.reset();

    if (open) {
      onClose();
    }
  }

  function handleSnackbarClose(): void {
    setSnackbarOpen(false);
  }

  return (
    <>
      <Modal open={open} onClose={onClose}>
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
                      <TextFieldController name="name.firstName" type="text" />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography variant="body1" className="label">
                        Last Name
                      </Typography>
                      <TextFieldController name="name.lastName" type="text" />
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
                  <Button variant="contained" color="primary" onClick={onSubmit} className="save-button">
                    Save User
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </FormProvider>
        </Box>
      </Modal>

      <AlertSnackbar open={snackbarOpen} message={snackbarMessage} severity={snackbarSeverity} onClose={handleSnackbarClose} />
    </>
  );
};

export default NewUserModal;
