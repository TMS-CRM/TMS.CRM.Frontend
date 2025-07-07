/* eslint-disable @typescript-eslint/no-misused-promises */
import { yupResolver } from '@hookform/resolvers/yup';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useEffect, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import bgCover from '../../assets/cover.jpg';
import './user-details.css';
import AlertSnackbar from '../../components/alert-snackbar/alert-snackbar';
import TextFieldController from '../../components/form/text-field-controller';
import { useHeader } from '../../hooks/use-header';
import { api } from '../../services/api';
import type { User } from '../../types/user';

interface FormValues {
  avatar: string;
  firstName: string;
  lastName: string;
  email: string;
}

const UserDetails: React.FC = () => {
  const { setTitle } = useHeader();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [previewUrl] = useState<string | null>(null);

  const defaultAvatar: string = 'https://www.gravatar.com/avatar/?d=mp&f=y';

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'saved' | 'deleted'>('saved');
  const { uuid: userUuid } = useParams();

  const isFetchingRef = useRef(false);

  const navigate = useNavigate();

  useEffect(() => {
    setTitle('User Details');
  }, [setTitle]);

  const schema = yup.object().shape({
    avatar: yup.string().required('Avatar is required'),
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    email: yup.string().email('Invalid email format').required('Email is required'),
  });

  const form = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      avatar: undefined,
      firstName: undefined,
      lastName: undefined,
      email: undefined,
    },
  });

  useEffect(() => {
    if (userUuid && !isFetchingRef.current) {
      async function fetchUser(): Promise<void> {
        if (isFetchingRef.current) {
          return;
        }

        isFetchingRef.current = true;
        setIsLoading(true);

        try {
          const response = await api.get<{ data: User }>(`/users/${userUuid}`);
          const responseData = response.data.data;

          form.reset({
            avatar: responseData.avatar,
            firstName: responseData.firstName,
            lastName: responseData.lastName,
            email: responseData.email,
          } as FormValues);
        } catch (error) {
          console.error('Failed to fetch user', error);
        } finally {
          isFetchingRef.current = false;
          setIsLoading(false);
        }
      }

      void fetchUser();
    } else {
      form.reset({
        // avatar: undefined,
        firstName: undefined,
        lastName: undefined,
        email: undefined,
      });
    }
  }, [userUuid, form]);

  async function onSubmit(formData: FormValues): Promise<void> {
    setIsSubmitting(true);

    try {
      await api.put<{ data: User }>(`/customers/${userUuid}`, formData);

      setSnackbarOpen(true);
      setSnackbarMessage('User Saved');
      setSnackbarSeverity('saved');
      form.reset(form.getValues());
    } catch (error) {
      console.error('Error saving user:', error);
      setSnackbarMessage('Failed to save user');
      setSnackbarSeverity('deleted');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(): Promise<void> {
    try {
      await api.delete(`/users/${userUuid}`);
      await navigate('/users', {
        state: {
          snackbarMessage: 'User deleted',
          snackbarSeverity: 'deleted',
          refresh: true,
        },
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      setSnackbarMessage('Failed to delete user');
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
            <Grid size={{ xs: 12, md: 12 }} className="user-page-content">
              <Grid container>
                <FormProvider {...form}>
                  <Grid size={{ xs: 12, md: 12 }} className="user-form-container">
                    <Box position="relative" width="100%">
                      <img src={bgCover} alt="Background Cover" sizes="100%" className="cover-bg-user-page" />

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

                          <Button className="edit-button-user-page">
                            <DriveFileRenameOutlineOutlinedIcon sx={{ width: 20, height: 20, color: 'white' }} />
                          </Button>
                        </Box>
                      </Box>

                      <Button
                        className="delete-button-user-page"
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
                      <TextFieldController className="text-field-user-page" name="firstName" type="text" />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography variant="body1">Last Name</Typography>
                      <TextFieldController className="text-field-user-page" name="lastName" type="text" />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography variant="body1">Email</Typography>
                      <TextFieldController className="text-field-user-page" name="email" type="text" />
                    </Grid>

                    <Grid size={{ xs: 12 }} className="button-container-user-page">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={form.handleSubmit(onSubmit)}
                        className="save-button-user-page"
                        disabled={!form.formState.isDirty}
                      >
                        {isSubmitting ? <CircularProgress size={20} color="inherit" /> : 'Save User'}
                      </Button>
                    </Grid>
                  </Grid>
                </FormProvider>
              </Grid>
            </Grid>
          </>
        )}
      </Grid>
      <AlertSnackbar open={snackbarOpen} message={snackbarMessage} severity={snackbarSeverity} onClose={() => setSnackbarOpen(false)} />
    </>
  );
};

export default UserDetails;
