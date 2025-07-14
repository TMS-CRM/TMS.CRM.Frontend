import { BusinessCenterOutlined, PeopleAltOutlined } from '@mui/icons-material';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import CancelIcon from '@mui/icons-material/Cancel';
import { Backdrop, Box, Button, CircularProgress, Divider, Modal, Typography } from '@mui/material';
import React, { useState } from 'react';
import AlertSnackbar from '../alert-snackbar/alert-snackbar';
import CustomerFormModal from '../customer-form-modal/customer-form-modal';
import DealFormModal from '../deal-form-modal/deal-form-modal';
import '../../styles/modal.css';
import './add-new-modal.css';
import SelectCustomerModal from '../select-customer-modal/select-customer-modal';

interface AddNewFormProps {
  open: boolean;
  onClose: (refresh: boolean) => void;
  onCustomerCreated: () => void;
  onDealCreated: () => void;
}

const AddNewModal: React.FC<AddNewFormProps> = (props: AddNewFormProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addNewDealOpen, setAddNewDealOpen] = useState(false);
  const [addNewCustomerOpen, setAddNewCustomerOpen] = useState(false);
  const [selectCustomerOpen, setSelectCustomerOpen] = useState(false);
  const [selectedCustomerUuid, setSelectedCustomerUuid] = useState<string | null>(null);

  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'saved' | 'deleted'>('saved');

  // modal fade transition loading
  const [isLoadingModalTransition, setIsLoadingModalTransition] = useState(false);

  function handleCancel(): void {
    if (props.open) {
      props.onClose(false);
    }
  }

  return (
    <>
      <Backdrop open={isLoadingModalTransition} sx={{ zIndex: 1500 }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Modal open={props.open} onClose={() => props.onClose(false)}>
        <Box
          className="box"
          sx={{
            width: { xs: 200, sm: 220, md: 240 },
          }}
        >
          <Box className="form-title-add-new">
            <Box>
              <Typography variant="body2">Add New</Typography>
            </Box>
            <Box>
              <Button endIcon={<CancelIcon className="close-icon" />} onClick={handleCancel} />
            </Box>
          </Box>

          <Divider />

          <Box onClick={() => setSelectCustomerOpen(true)} className="box-content-add-new">
            <Box display="flex" alignItems="center" gap={1}>
              <BusinessCenterOutlined className="icon-container " sx={{ color: '#7D8A99' }} />
              <Typography fontWeight={500} color="text.primary" fontSize={14}>
                Deal
              </Typography>
            </Box>
            <ArrowForwardOutlinedIcon className="icon-container " sx={{ color: '#514EF3' }} />
          </Box>

          <Divider />

          {/* Customer Option */}

          <Box onClick={() => setAddNewCustomerOpen(true)} className="box-content-add-new">
            <Box display="flex" alignItems="center" gap={1}>
              <PeopleAltOutlined className="icon-container " sx={{ color: '#7D8A99' }} />
              <Typography fontWeight={500} color="text.primary" fontSize={14}>
                Customer
              </Typography>
            </Box>
            <ArrowForwardOutlinedIcon className="icon-container " sx={{ color: '#514EF3' }} />
          </Box>
        </Box>
      </Modal>

      <SelectCustomerModal
        open={selectCustomerOpen}
        onClose={() => {
          setSelectCustomerOpen(false);
          setIsModalOpen(false);
        }}
        onShowSnackbar={(message, severity) => {
          setSnackbarMessage(message);
          setSnackbarSeverity(severity);
          setSnackbarOpen(true);
        }}
        onCustomerSelected={(customerUuid) => {
          setSelectedCustomerUuid(customerUuid);
          setIsModalOpen(false);
          setIsLoadingModalTransition(true);

          setTimeout(() => {
            setAddNewDealOpen(true);
            setIsLoadingModalTransition(false);
          }, 400);
        }}
      />

      {/* Modal: Deal Form */}
      <DealFormModal
        dealUuid={null}
        open={addNewDealOpen}
        onClose={(refresh: boolean) => {
          setAddNewDealOpen(false);
          if (refresh) {
            props.onDealCreated();
          }
        }}
        onChangeCustomerRequested={() => {
          setAddNewDealOpen(false);
          setIsLoadingModalTransition(true);

          setSelectCustomerOpen(true);
          setIsLoadingModalTransition(false);
        }}
        onShowSnackbar={(message, severity) => {
          setSnackbarMessage(message);
          setSnackbarSeverity(severity);
          setSnackbarOpen(true);
        }}
        customerUuid={selectedCustomerUuid ?? undefined}
      />

      {/* Modal: Customer Form */}
      <CustomerFormModal
        open={addNewCustomerOpen}
        customerUuid={null}
        onClose={(refresh: boolean) => {
          setAddNewCustomerOpen(false);
          if (refresh) {
            props.onCustomerCreated();
          }
        }}
        onShowSnackbar={(message, severity) => {
          setSnackbarMessage(message);
          setSnackbarSeverity(severity);
          setSnackbarOpen(true);
        }}
      />
      <AlertSnackbar open={snackbarOpen} message={snackbarMessage} severity={snackbarSeverity} onClose={() => setSnackbarOpen(false)} />
    </>
  );
};

export default AddNewModal;
