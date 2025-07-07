import { yupResolver } from '@hookform/resolvers/yup';
import CancelIcon from '@mui/icons-material/Cancel';
import { Box, Button, CircularProgress, Modal, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import React, { useEffect, useRef, useState } from 'react';
import '../../styles/modal.css';
import './deal-form-modal.css';
import { FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { api } from '../../services/api';
import type { Customer } from '../../types/customer';
import { DealProgress, type DealProgressType, DealRoomAccess, type DealRoomAccessType, type DealWithCustomer } from '../../types/deal';
import DatePickerController from '../form/date-picker-controller';
import SelectController from '../form/select-controller';
import TextFieldController from '../form/text-field-controller';

interface DealModalProps {
  open: boolean;
  onClose: (refresh: boolean) => void;
  onShowSnackbar?: (message: string, severity: 'saved' | 'deleted') => void;
  onChangeCustomerRequested?: () => void;
  customerUuid?: string;
  dealUuid: string | null;
}

interface FormValues {
  customerUuid: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  roomArea: number;
  numberOfPeople: number;
  appointmentDate: Date;
  specialInstructions: string;
  roomAccess: DealRoomAccessType;
  price: number;
  progress: DealProgressType;
}

const DealModal: React.FC<DealModalProps> = (props: DealModalProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFetchingRef = useRef(false);

  const [fileName, setFileName] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const defaultAvatar: string = 'https://www.gravatar.com/avatar/?d=mp&f=y';
  const defaultImage = 'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg';

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setPreviewUrl(URL.createObjectURL(file));
    }
  }

  const schema = yup.object().shape({
    customerUuid: yup.string().required('Customer is required'),
    price: yup.number().required('Price is required'),
    street: yup.string().required('Street is required'),
    city: yup.string().required('City is required'),
    state: yup.string().required('State is required'),
    zipCode: yup.string().required('Zip code is required'),
    roomArea: yup.number().required('Room area is required'),
    numberOfPeople: yup.number().required('Number of people is required'),
    appointmentDate: yup.date().nullable().required('Appointment date is required'),
    progress: yup.mixed<DealProgressType>().oneOf(['Pending', 'InProgress', 'Closed'], 'Invalid progress option').required('Progress is required'),
    specialInstructions: yup.string().required('Special instructions are required'),
    roomAccess: yup
      .mixed<DealRoomAccessType>()
      .oneOf(['KeysObtained', 'KeysNotRequired', 'KeysWithDoorman', 'KeysInLockbox', 'Other'])
      .required('Room access is required'),
  });

  const form = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      customerUuid: props.customerUuid ?? undefined,

      street: undefined,
      city: undefined,
      state: undefined,
      zipCode: undefined,
      roomArea: undefined,
      numberOfPeople: undefined,
      appointmentDate: undefined,
      specialInstructions: undefined,
      roomAccess: 'KeysWithDoorman',
      price: undefined,
      progress: 'InProgress',
    },
  });

  useEffect(() => {
    if (props.customerUuid && props.open && !isFetchingRef.current) {
      async function fetchCustomer(): Promise<void> {
        if (isFetchingRef.current) {
          return;
        }

        isFetchingRef.current = true;
        setIsLoading(true);

        try {
          const response = await api.get<{ data: Customer }>(`/customers/${props.customerUuid}`);
          const responseData = response.data.data;
          setCustomer(responseData);

          form.reset({ customerUuid: props.customerUuid });
        } catch (error) {
          console.error('Failed to fetch customer', error);
        } finally {
          setIsLoading(false);
          isFetchingRef.current = false;
        }
      }

      void fetchCustomer();
    } else {
      form.reset({});
    }
  }, [form, props.customerUuid, props.open]);

  useEffect(() => {
    if (props.dealUuid && !isFetchingRef.current) {
      async function fetchDeal(): Promise<void> {
        if (isFetchingRef.current) {
          return;
        }
        setIsLoading(true);
        isFetchingRef.current = true;

        try {
          const response = await api.get<{ data: DealWithCustomer }>(`/deals/${props.dealUuid}`);
          const responseData = response.data.data;

          form.reset({
            customerUuid: responseData.customer.uuid,
            street: responseData.street,
            city: responseData.city,
            state: responseData.state,
            zipCode: responseData.zipCode,
            roomArea: responseData.roomArea,
            numberOfPeople: responseData.numberOfPeople,
            appointmentDate: responseData.appointmentDate ? new Date(responseData.appointmentDate) : undefined,
            specialInstructions: responseData.specialInstructions,
            roomAccess: responseData.roomAccess,
            price: responseData.price,
            progress: responseData.progress,
          });
        } catch (error) {
          console.error('Failed to fetch customer', error);
        } finally {
          setIsLoading(false);
          isFetchingRef.current = false;
        }
      }

      void fetchDeal();
    } else {
      form.reset({
        customerUuid: undefined,
        street: undefined,
        city: undefined,
        state: undefined,
        zipCode: undefined,
        roomArea: undefined,
        numberOfPeople: undefined,
        appointmentDate: undefined,
        specialInstructions: undefined,
        roomAccess: undefined,
        price: undefined,
        progress: undefined,
      });
    }
  }, [props.dealUuid, form]);

  async function onSubmit(formData: FormValues): Promise<void> {
    setIsSubmitting(true);

    try {
      if (props.dealUuid) {
        await api.put(`/deals/${props.dealUuid}`, formData);
      } else {
        await api.post('/deals', formData);
      }

      form.reset();
      props.onClose(true);

      props.onShowSnackbar?.('Deal Saved', 'saved');
    } catch (error) {
      console.error('Error saving deal:', error);
      props.onShowSnackbar?.('Failed to save deal', 'deleted');
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
            width: { xs: 300, sm: 520, md: 620 },
          }}
        >
          <Box className="form-title">
            <Typography variant="h5" className="title-header-modal">
              {props.dealUuid ? 'Edit Deal' : 'Add New Deal'}
            </Typography>
            <Button endIcon={<CancelIcon className="close-icon" />} onClick={handleCancel} />
          </Box>

          <FormProvider {...form}>
            {!props.dealUuid && (
              <Grid container spacing={3} className="customer-box-new-deal">
                <Grid size={{ xs: 3, sm: 1.5, md: 1.5 }}>
                  <img src={customer?.avatar ?? defaultAvatar} alt="Customer picture" width={44} height={44} className="deal-picture-new-deal" />
                </Grid>
                <Grid size={{ xs: 9, sm: 6.5, md: 6.5 }}>
                  <Typography variant="body2">{'Customer'}</Typography>
                  <Typography variant="body1">
                    {customer?.firstName} {customer?.lastName}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Button onClick={props.onChangeCustomerRequested} variant="outlined" color="secondary" className="change-customer-button-new-deal">
                    Change Customer
                  </Button>
                </Grid>
              </Grid>
            )}
            <Box />

            <Box className="form-container">
              <div>
                <Typography variant="body1" className="label">
                  Room Images
                </Typography>

                {/* Image preview */}
                <img
                  src={previewUrl ?? defaultImage}
                  alt="Room Image"
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
                  <input id="upload-image" name="imageUrl" type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                  <Button variant="contained" component="span" className="upload-button">
                    <span style={{ display: 'block' }}>{fileName || 'ADD'}</span>
                  </Button>
                </label>
              </div>
              <Box>
                <Grid container spacing={2} margin={'0 0 24px 0'}>
                  <Grid size={{ xs: 12, md: 12 }}>
                    <Typography variant="body1" className="label">
                      Address
                    </Typography>
                    <TextFieldController name="street" placeholder="Street" type="text" />
                  </Grid>
                  <Grid size={{ xs: 12, md: 5 }}>
                    <TextFieldController name="city" placeholder="City" type="text" />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextFieldController name="state" placeholder="State/Province" type="text" />
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <TextFieldController name="zipCode" placeholder="Zip Code" type="string" />
                  </Grid>
                </Grid>

                <Grid container spacing={3} className="deal-details-box-new-deal">
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="body1" className="label">
                      Room Area (m2)
                    </Typography>
                    <TextFieldController type="number" name="roomArea" />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="body1" className="label">
                      Number of People
                    </Typography>
                    <TextFieldController type="number" name="numberOfPeople" />
                  </Grid>
                </Grid>
                <Typography variant="body1" className="label">
                  Appointment Date
                </Typography>
                <DatePickerController name="appointmentDate" />

                <Typography margin={'20px 0px 12px'} className="label">
                  Special Instructions
                </Typography>
                <TextFieldController type="text" name="specialInstructions" />

                <Grid container spacing={3} className="deal-details-box-new-deal">
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="body1" className="label">
                      Room Access
                    </Typography>
                    <SelectController
                      name="roomAccess"
                      skeletonOnLoading
                      options={[
                        { value: DealRoomAccess.KeysWithDoorman.id, label: DealRoomAccess.KeysWithDoorman.label },
                        { value: DealRoomAccess.KeysObtained.id, label: DealRoomAccess.KeysObtained.label },
                        { value: DealRoomAccess.KeysNotRequired.id, label: DealRoomAccess.KeysNotRequired.label },
                      ]}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="body1" className="label">
                      Price ($)
                    </Typography>
                    <TextFieldController name="price" type="number" />
                  </Grid>
                </Grid>
              </Box>

              <Grid container className="footer-box">
                <Grid size={{ xs: 12, md: 6 }} className="progress-box-new-deal">
                  <Grid alignItems={'center'} spacing={1} container>
                    <Grid size={{ xs: 12, md: 3.5 }}>
                      <Typography variant="body1" className="label" sx={{ marginBottom: '0' }}>
                        Progress
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 7.5 }}>
                      <SelectController
                        name="progress"
                        skeletonOnLoading
                        options={[
                          { value: DealProgress.Closed.id, label: DealProgress.Closed.label },
                          { value: DealProgress.InProgress.id, label: DealProgress.InProgress.label },
                          { value: DealProgress.Pending.id, label: DealProgress.Pending.label },
                        ]}
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }} className="actions-button">
                  {!props.dealUuid && (
                    <Button onClick={handleCancel} variant="outlined" className="cancel-button">
                      Cancel
                    </Button>
                  )}

                  <Button
                    variant="contained"
                    color="primary"
                    className="save-button"
                    // eslint-disable-next-line @typescript-eslint/no-misused-promises
                    onClick={form.handleSubmit(onSubmit)}
                    disabled={!form.formState.isDirty}
                  >
                    {isSubmitting ? <CircularProgress size={20} color="inherit" /> : props.dealUuid ? 'Done' : 'Save Deal'}
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

export default DealModal;
