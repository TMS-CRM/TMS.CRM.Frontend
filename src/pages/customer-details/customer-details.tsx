import { yupResolver } from '@hookform/resolvers/yup';
// import { PeopleAltOutlined } from '@mui/icons-material';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import { Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useEffect, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import type { InferType } from 'yup';
import RecentDeals from './components/recent-deals';
import bgCover from '../../assets/cover.jpg';
import AlertSnackbar from '../../components/alert-snackbar/alert-snackbar';
import TextFieldController from '../../components/form/text-field-controller';
import { useHeader } from '../../hooks/use-header';
import { api } from '../../services/api';
import type { Customer } from '../../types/customer';
// import defaultAvatar from '../../../assets/default-avatar.png';
import './customer-details.css';

const CustomerDetails: React.FC = () => {
  const { setTitle } = useHeader();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFetchingRef = useRef(false);

  const [forceRefreshDeal, setForceRefreshDeal] = useState(false);

  const [fileName, setFileName] = useState('');

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const defaultAvatar: string = 'https://www.gravatar.com/avatar/?d=mp&f=y';

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'saved' | 'deleted'>('saved');
  const { uuid: customerUuid } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    setTitle('Customer Details');
  }, [setTitle]);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setPreviewUrl(URL.createObjectURL(file));
    }
  }

  const schema = yup
    .object({
      firstName: yup.string(),
      lastName: yup.string(),
      email: yup.string(),
      phone: yup.string(),
      street: yup.string(),
      city: yup.string(),
      state: yup.string(),
      zipCode: yup.string(),
    })
    .noUnknown()
    .defined()
    .partial();

  type FormValues = InferType<typeof schema>;

  const form = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      // avatar: undefined,
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

  useEffect(() => {
    if (customerUuid && !isFetchingRef.current) {
      async function fetchCustomer(): Promise<void> {
        if (isFetchingRef.current) {
          return;
        }

        isFetchingRef.current = true;
        setIsLoading(true);

        try {
          const response = await api.get<{ data: Customer }>(`/customers/${customerUuid}`);
          const responseData = response.data.data;

          form.reset({
            avatar: responseData.avatar,
            firstName: responseData.firstName,
            lastName: responseData.lastName,
            email: responseData.email,
            phone: responseData.phone,
            street: responseData.street,
            city: responseData.city,
            state: responseData.state,
            zipCode: responseData.zipCode,
          } as FormValues);
        } catch (error) {
          console.error('Failed to fetch customer', error);
        } finally {
          isFetchingRef.current = false;
          setIsLoading(false);
        }
      }

      void fetchCustomer();
    } else {
      form.reset({
        // avatar: undefined,
        firstName: undefined,
        lastName: undefined,
        email: undefined,
        phone: undefined,
        street: undefined,
        city: undefined,
        state: undefined,
        zipCode: undefined,
      });
    }
  }, [customerUuid, form]);

  async function onSubmit(formData: FormValues): Promise<void> {
    setIsSubmitting(true);

    try {
      await api.put<{ data: Customer }>(`/customers/${customerUuid}`, formData);

      setSnackbarOpen(true);
      setSnackbarMessage('Customer Saved');
      setSnackbarSeverity('saved');
      form.reset(form.getValues());
    } catch (error) {
      console.error('Error saving customer:', error);
      setSnackbarMessage('Failed to save customer');
      setSnackbarSeverity('deleted');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(): Promise<void> {
    if (!customerUuid) return;

    try {
      await api.delete(`/customers/${customerUuid}`);
      await navigate('/customers', {
        state: {
          snackbarMessage: 'Customer deleted',
          snackbarSeverity: 'deleted',
          refresh: true,
        },
      });
    } catch (error) {
      console.error('Error deleting customer:', error);
      setSnackbarMessage('Failed to delete customer');
      setSnackbarSeverity('deleted');
      setSnackbarOpen(true);
    }
  }

  return (
    <>
      <Grid container padding={0}>
        {isLoading ? (
          <Grid size={{ xs: 12 }} sx={{ textAlign: 'center', paddingTop: '150px' }}>
            <CircularProgress size={40} />
          </Grid>
        ) : (
          <>
            <Grid size={{ xs: 12, md: 9 }} className="customer-page-content">
              <Grid container>
                <FormProvider {...form}>
                  <Grid size={{ xs: 12, md: 12 }} className="customer-form-container">
                    <Box position="relative" width="100%">
                      <img src={bgCover} alt="Background Cover" sizes="100%" className="cover-bg-customer-page" />

                      <Box position="absolute" top="80px" left="24px">
                        <Box position="relative" width={100} height={100}>
                          <Box className="avatar-box">
                            {/* Image preview */}
                            <img
                              className="profile-picture"
                              src={previewUrl ?? defaultAvatar}
                              alt="User Avatar"
                              style={{
                                width: '100px',
                                height: '100px',
                                // borderRadius: '50%',
                                // objectFit: 'cover',
                                // marginBottom: '8px',
                              }}
                            />
                          </Box>

                          <Button className="edit-button-customer-page">
                            <input
                              id="upload-image"
                              name="file"
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              style={{ display: 'none' }}
                            />
                            <DriveFileRenameOutlineOutlinedIcon sx={{ width: 20, height: 20, color: 'white' }} />
                          </Button>
                        </Box>
                      </Box>

                      <Button
                        className="delete-button-customer-page"
                        onClick={() => {
                          void handleDelete();
                        }}
                      >
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
                      <TextFieldController className="text-field-customer-page" name="street" placeholder="Street Address" type="text" />
                    </Grid>
                    <Grid size={{ xs: 12, md: 5 }}>
                      <TextFieldController className="text-field-customer-page" name="city" placeholder="City" type="text" />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <TextFieldController className="text-field-customer-page" name="state" placeholder="State/Province" type="text" />
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                      <TextFieldController className="text-field-customer-page" name="zipCode" placeholder="Zip Code" type="text" />
                    </Grid>

                    <Grid size={{ xs: 12 }} className="button-container-customer-page">
                      <Button
                        variant="contained"
                        color="primary"
                        // eslint-disable-next-line @typescript-eslint/no-misused-promises
                        onClick={form.handleSubmit(onSubmit)}
                        className="save-button-customer-page"
                        disabled={!form.formState.isDirty}
                      >
                        {isSubmitting ? <CircularProgress size={20} color="inherit" /> : 'Save Customer'}
                      </Button>
                    </Grid>
                  </Grid>
                </FormProvider>
              </Grid>
            </Grid>

            <Grid size={{ xs: 12, md: 3 }} sx={{ display: 'flex', flexDirection: 'column' }}>
              <RecentDeals
                customerUuid={customerUuid!}
                forceRefresh={forceRefreshDeal}
                onForceRefreshed={() => {
                  setForceRefreshDeal(false);
                }}
              />
            </Grid>
          </>
        )}
      </Grid>

      <AlertSnackbar open={snackbarOpen} message={snackbarMessage} severity={snackbarSeverity} onClose={() => setSnackbarOpen(false)} />
    </>
  );
};

export default CustomerDetails;
