import { yupResolver } from '@hookform/resolvers/yup';
import CancelIcon from '@mui/icons-material/Cancel';
import { Box, Button, Modal, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import React, { useEffect, useState } from 'react';
import '../../styles/modal.css';
import './deal-form-modal.css';
import { FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { api } from '../../services/api';
import { DealProgress, type DealProgressType, DealRoomAccess, type DealRoomAccessType } from '../../types/deal';
import DatePickerController from '../form/date-picker-controller';
import SelectController from '../form/select-controller';
import TextFieldController from '../form/text-field-controller';

interface DealModalProps {
  open: boolean;
  onClose: () => void;
  onShowSnackbar?: (message: string, severity: 'saved' | 'deleted') => void;
  onChangeCustomerRequested?: () => void;
  customerUuid?: string;
  dealUuid?: string;
}

interface FormValues {
  customerUuid: string;
  street: string;
  city: string;
  state: string;
  zipCode: number;
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

  const dealUuid = props.dealUuid;

  const [fileName, setFileName] = useState('');

  const schema = yup.object().shape({
    customerUuid: yup.string().required('Customer is required'),
    street: yup.string().required('Street is required'),
    city: yup.string().required('City is required'),
    state: yup.string().required('State is required'),
    zipCode: yup.number().required('Zip code is required'),
    roomArea: yup.number().required('Room area is required'),
    numberOfPeople: yup.number().required('Number of people is required'),
    appointmentDate: yup.date().nullable().required('Appointment date is required'),
    specialInstructions: yup.string().required('Special instructions are required'),
    roomAccess: yup
      .mixed<DealRoomAccessType>()
      .oneOf(['keysObtained', 'keysNotRequired', 'keysWithDoorman'], 'Invalid room access option')
      .required('Room access is required'),
    price: yup.number().required('Price is required'),
    progress: yup.mixed<DealProgressType>().oneOf(['pending', 'inProgress', 'closed'], 'Invalid progress option').required('Progress is required'),
    // imageUrl: yup.string(),
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
      roomAccess: 'keysWithDoorman',
      price: undefined,
      progress: 'inProgress',
    },
  });

  useEffect(() => {
    if (props.open && props.customerUuid) {
      form.reset({
        ...form.getValues(),
        customerUuid: props.customerUuid,
      });
    }
  }, [props.open, props.customerUuid]);

  // useEffect(() => {
  //   if (dealUuid && props.open) {
  //     async function fetchDeal(): Promise<void> {
  //       try {
  //         setIsLoading(true);
  //         const response = await api.get(`/deals/${dealUuid}`);
  //         const responseData = response.data.data;

  //         // console.log('task fetched', response.data.data);

  //         form.reset({
  //           customerUuid: responseData.customerUuid,
  //           address: {
  //             street: responseData.street,
  //             city: responseData.city,
  //             state: responseData.state,
  //             zipCode: responseData.zipCode,
  //           },
  //           roomArea: responseData.roomArea,
  //           numberOfPeople: responseData.numberOfPeople,
  //           appointmentDate: new Date(responseData.appointmentDate as string),
  //           specialInstructions: responseData.specialInstructions,
  //           roomAccess: responseData.roomAccess,
  //           price: responseData.price,
  //           progress: responseData.progress,
  //         } as FormValues);
  //       } catch (error) {
  //         console.error('Failed to fetch task', error);
  //       } finally {
  //         setIsLoading(false);
  //       }
  //     }

  //     void fetchDeal();
  //   } else {
  //     form.reset({
  //       customerUuid: props.customerUuid ?? undefined,
  //       address: { street: undefined, city: undefined, state: undefined, zipCode: undefined },
  //       roomArea: undefined,
  //       numberOfPeople: undefined,
  //       appointmentDate: undefined,
  //       specialInstructions: undefined,
  //       roomAccess: 'keysWithDoorman',
  //       price: undefined,
  //       progress: 'inProgress',
  //     });
  //   }
  // }, [dealUuid, form, props.customerUuid, props.open]);

  const onSubmit = form.handleSubmit(async (formData) => {
    console.log('FormData', formData);
    try {
      if (dealUuid) {
        return;
      } else {
        await api.post('/deals', formData);
      }

      form.reset();

      props.onClose();

      props.onShowSnackbar?.('Deal Saved', 'saved');
    } catch (error) {
      console.error('Error saving deal:', error);
      props.onShowSnackbar?.('Failed to save deal', 'deleted');
    }
  });

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  }

  function handleCancel(): void {
    form.reset();
    if (props.open) {
      props.onClose();
    }
  }

  if (isLoading) {
    return <Typography sx={{ p: 4 }}>Loading deal...</Typography>;
  }

  return (
    <>
      <Modal open={props.open} onClose={props.onClose}>
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
                  <img
                    // src={customer?.avatar ?? '/placeholder-avatar.jpg'}
                    alt="Customer picture"
                    width={44}
                    height={44}
                    className="deal-picture-new-deal"
                  />
                </Grid>
                <Grid size={{ xs: 9, sm: 6.5, md: 6.5 }}>
                  <Typography variant="body2">{'Customer'}</Typography>
                  <Typography variant="body1">{/* {customer?.firstName} {customer?.lastName} */}</Typography>
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
                <label htmlFor="upload-image" style={{ cursor: 'pointer' }}>
                  <input id="upload-image" name="file" type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
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
                    <TextFieldController name="address.street" placeholder="Street" type="text" />
                  </Grid>
                  <Grid size={{ xs: 12, md: 5 }}>
                    <TextFieldController name="address.city" placeholder="City" type="text" />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextFieldController name="address.state" placeholder="State/Province" type="text" />
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <TextFieldController name="address.zipCode" placeholder="Zip Code" type="text" />
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
                        { value: DealRoomAccess.keysWithDoorman.id, label: DealRoomAccess.keysWithDoorman.label },
                        { value: DealRoomAccess.keysObtained.id, label: DealRoomAccess.keysObtained.label },
                        { value: DealRoomAccess.keysNotRequired.id, label: DealRoomAccess.keysNotRequired.label },
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
                          { value: DealProgress.closed.id, label: DealProgress.closed.label },
                          { value: DealProgress.inProgress.id, label: DealProgress.inProgress.label },
                          { value: DealProgress.pending.id, label: DealProgress.pending.label },
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
                    onClick={() => {
                      void onSubmit();
                    }}
                    disabled={!form.formState.isDirty}
                  >
                    {props.dealUuid ? 'Done' : 'Save Deal'}
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
