import { yupResolver } from '@hookform/resolvers/yup';
import CancelIcon from '@mui/icons-material/Cancel';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';
import '../../styles/modal.css';
import { api } from '../../services/api';
import TextFieldController from '../form/text-field-controller';

interface CustomerModalProps {
  onShowSnackbar: (message: string, severity: 'saved' | 'deleted') => void;
  open: boolean;
  onClose: (refresh: boolean) => void;
  customerUuid: number | null;
}

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

const CustomerFormModal: React.FC<CustomerModalProps> = (props: CustomerModalProps) => {
  const customerUuid = props.customerUuid;

  const [fileName, setFileName] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const defaultAvatar: string = 'https://www.gravatar.com/avatar/?d=mp&f=y';

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setPreviewUrl(URL.createObjectURL(file));
    }
  }

  const schema = yup.object().shape({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    email: yup.string().required('Email is required'),
    phone: yup.string().required('Phone is required'),
    street: yup.string().required('Street address is required'),
    city: yup.string().required('City is required'),
    state: yup.string().required('State is required'),
    zipCode: yup.string().required('Zip code is required'),
  });

  const form = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: undefined,
      lastName: undefined,
      email: undefined,
      phone: undefined,
      street: undefined,
      city: undefined,
      state: undefined,
      zipCode: undefined,
    },
  });

  function onSubmit(): void {
    void form.handleSubmit(async (formData) => {
      console.log('FormData', formData);

      try {
        if (!customerUuid) {
          await api.post('/customers', formData);
        } else {
          return;
        }

        form.reset();
        props.onClose(true);

        props.onShowSnackbar('Customer Saved', 'saved');
      } catch (error) {
        console.error('Error saving customer:', error);
        props.onShowSnackbar('Failed to save customer', 'deleted');
      }
    })();
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
            width: { xs: 300, sm: 520, md: 620 },
            maxHeight: '90vh',
          }}
        >
          <Box className="form-title">
            <Typography variant="h5" className="title-header-modal">
              Add New Customer
            </Typography>
            <Button endIcon={<CancelIcon className="close-icon" />} onClick={handleCancel} />{' '}
          </Box>

          <FormProvider {...form}>
            <Box className="form-container">
              <div>
                <Typography variant="body1" className="label">
                  Avatar
                </Typography>

                {/* Avatar preview */}
                <img
                  src={previewUrl ?? defaultAvatar}
                  alt="User Avatar"
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    marginBottom: '8px',
                  }}
                />

                {/* Upload button */}
                <label htmlFor="upload-image" style={{ cursor: 'pointer' }}>
                  <input id="upload-image" name="file" type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                  <Button variant="contained" component="span" className="upload-button">
                    <span>{fileName || 'ADD'}</span>
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
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography variant="body1" className="label">
                        Email
                      </Typography>
                      <TextFieldController name="email" type="text" />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography variant="body1" className="label">
                        Phone
                      </Typography>
                      <TextFieldController name="phone" type="phone" />
                    </Grid>
                  </Grid>
                  <Grid container spacing={2} margin={'24px 0 24px 0'}>
                    <Grid size={{ xs: 12, md: 12 }}>
                      <Typography variant="body1" className="label">
                        Address
                      </Typography>
                      <TextFieldController name="street" placeholder="Street Address" type="text" />
                    </Grid>
                    <Grid size={{ xs: 12, md: 5 }}>
                      <TextFieldController name="city" placeholder="City" type="text" />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <TextFieldController name="state" placeholder="State/Province" type="text" />
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                      <TextFieldController name="zipCode" placeholder="Zip Code" type="text" />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              <Grid container marginTop={'12px'}>
                <Grid size={{ xs: 12, md: 12 }} className="form-footer">
                  <Button variant="outlined" onClick={handleCancel} className="cancel-button">
                    Cancel
                  </Button>
                  <Button variant="contained" color="primary" onClick={onSubmit} className="save-button" disabled={!form.formState.isDirty}>
                    Save Customer
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

export default CustomerFormModal;
