import { PeopleAltOutlined } from '@mui/icons-material';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import { Box, Button, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';
import type { Customer } from '../../types/customer';
import { mockCustomers } from '../../types/customer';
import bgCover from '@/assets/cover.jpg';
// import defaultAvatar from '../../../assets/default-avatar.png';
import '../customer-page.css';
import './page.css';
import RecentDeals from '../../components/recent-deals/recent-deals';
import AlertSnackbar from '@/components/alert-snackbar/alert-snackbar';
import TextFieldController from '@/components/form/text-field-controller';
import { yupResolver } from '@hookform/resolvers/yup';
import { useHeader } from '@/context/header-context';

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

interface FormValues {
  avatar: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: Address;
}

export default function Page() {
  const { setTitle, setButtonTitle } = useHeader();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'saved' | 'deleted'>('saved');
  const { id: customerId } = useParams();
  const customer: Customer | undefined = useMemo(() => {
    return mockCustomers.find((cust) => cust.id.toString() === customerId);
  }, [customerId]);

  useEffect(() => {
    setTitle('Customer Details');

    if (setButtonTitle) {
      setButtonTitle(undefined);
    }
  }, [setTitle, setButtonTitle]);

  const schema = yup.object().shape({
    avatar: yup.string().required('Avatar is required'),
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    email: yup.string().email('Invalid email format').required('Email is required'),
    phone: yup.string().required('Phone is required'),
    address: yup.object().shape({
      street: yup.string().required('Street address is required'),
      city: yup.string().required('City is required'),
      state: yup.string().required('State is required'),
      zipCode: yup.string().required('Zip code is required'),
    }),
  });

  const form = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      avatar: customer?.avatar || '',
      firstName: customer?.firstName || '',
      lastName: customer?.lastName || '',
      email: customer?.email || '',
      phone: customer?.phone || '',
      address: {
        street: customer?.street || '',
        city: customer?.city || '',
        state: customer?.state || '',
        zipCode: customer?.zipCode || '',
      },
    },
  });

  //   const form = useForm<FormValues>({
  //   resolver: yupResolver(schema),
  //   defaultValues: {
  //     // avatar: undefined,
  //     firstName: undefined,
  //     lastName: undefined,
  //     email: undefined,
  //     phone: undefined,
  //     address: { street: undefined, city: undefined, state: undefined, zipCode: undefined },
  //   },
  // });

  useEffect(() => {
    if (customerId) {
      const customer: Customer | undefined = mockCustomers.find((cust) => cust.id === Number(customerId));

      if (!customer) {
        return;
      }

      form.reset({
        avatar: customer.avatar || '',
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone,
        address: {
          street: customer.street,
          city: customer.city,
          state: customer.state,
          zipCode: customer.zipCode,
        },
      });
    }
  }, [customerId, form]);

  const onSubmit = form.handleSubmit(() => {
    setSnackbarMessage('Customer Edited');
    setSnackbarSeverity('saved');
    setSnackbarOpen(true);
  });

  const handleDelete = () => {
    setSnackbarMessage('Customer Deleted');
    setSnackbarSeverity('deleted');
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (!customer) {
    return (
      <Box className="not-found-customers-log">
        <PeopleAltOutlined />
        <Typography variant="body1" className="text-no-customers-found">
          No customers found.
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Grid container padding={0}>
        <Grid size={{ xs: 12, md: 9 }} className="customer-page-content">
          <Grid container>
            <FormProvider {...form}>
              <Grid size={{ xs: 12, md: 12 }} className="customer-form-container">
                <Box position="relative" width="100%">
                  <Image src={bgCover} alt="Background Cover" sizes="100%" className="cover-bg-customer-page" />

                  <Box position="absolute" top="80px" left="24px">
                    <Box position="relative" width={100} height={100}>
                      <Box className="avatar-box">
                        <Image src={customer.avatar} alt="Profile Picture" width={100} height={100} className="profile-picture" />
                      </Box>

                      <Button className="edit-button-customer-page">
                        <DriveFileRenameOutlineOutlinedIcon sx={{ width: 20, height: 20, color: 'white' }} />
                      </Button>
                    </Box>
                  </Box>

                  <Button className="delete-button-customer-page" onClick={handleDelete}>
                    <DeleteOutlineOutlinedIcon />
                  </Button>
                </Box>
              </Grid>

              <Grid container size={{ xs: 12, md: 12 }} spacing={2} marginTop="24px">
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="body1">First Name</Typography>
                  <TextFieldController className="text-field-customer-page" name="firstName" type="text" />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="body1">Last Name</Typography>
                  <TextFieldController className="text-field-customer-page" name="lastName" type="text" />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="body1">Email</Typography>
                  <TextFieldController className="text-field-customer-page" name="email" type="text" />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="body1">Phone</Typography>
                  <TextFieldController className="text-field-customer-page" name="phone" type="phone" />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Typography variant="body1">Address</Typography>
                  <TextFieldController name="address.street" placeholder="Street Address" type="text" />
                </Grid>
                <Grid size={{ xs: 12, md: 5 }}>
                  <TextFieldController className="text-field-customer-page" name="address.city" placeholder="City" type="text" />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextFieldController className="text-field-customer-page" name="address.state" placeholder="State/Province" type="text" />
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <TextFieldController className="text-field-customer-page" name="address.zipCode" placeholder="Zip Code" type="text" />
                </Grid>

                <Grid size={{ xs: 12 }} className="button-container-customer-page">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={onSubmit}
                    className="save-button-customer-page"
                    disabled={!form.formState.isDirty}
                  >
                    Save Customer
                  </Button>
                </Grid>
              </Grid>
            </FormProvider>
          </Grid>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }} sx={{ display: 'flex', flexDirection: 'column' }}>
          <RecentDeals />
        </Grid>
      </Grid>
      <AlertSnackbar open={snackbarOpen} message={snackbarMessage} severity={snackbarSeverity} onClose={handleSnackbarClose} />
    </>
  );
}
