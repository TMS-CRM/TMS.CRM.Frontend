import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import CancelIcon from '@mui/icons-material/Cancel';
import { Avatar, Backdrop, Box, Button, CircularProgress, List, Typography } from '@mui/material';
import Modal from '@mui/material/Modal';
import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import type { Customer } from '../../types/customer';
import '../../styles/modal.css';
import './select-customer-modal.css';
// import CustomerFormModal from '../customer-form-modal/customer-form-modal';

interface SelectCustomerModalProps {
  open: boolean;
  onShowSnackbar: (message: string, severity: 'saved' | 'deleted') => void;
  onClose: (refresh: boolean) => void;
  onCustomerSelected: (customerUuid: string) => void;
}

const SelectCustomerModal: React.FC<SelectCustomerModalProps> = (props: SelectCustomerModalProps) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [totalCustomers, setTotalCustomers] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0);
  const limit = 6;

  // modal fade transition loading
  const [isLoadingModalTransition, setIsLoadingModalTransition] = useState(false);

  useEffect(() => {
    void fetchCustomers();
  }, [page]);

  async function fetchCustomers(): Promise<void> {
    try {
      setIsLoading(true);
      const response = await api.get<{ data: { items: Customer[]; total: number } }>(`/customers?limit=${limit}&offset=${page * limit}`);
      const responseData = response.data.data;

      setCustomers(responseData.items);
      setTotalCustomers(responseData.total);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setIsLoading(false);
      setIsLoadingModalTransition(false);
    }
  }

  return (
    <>
      <Backdrop open={isLoadingModalTransition} sx={{ zIndex: 1500 }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Modal open={props.open} onClose={() => props.onClose(false)}>
        {/* maxHeight: '80vh' */}
        <Box className="box" sx={{ width: { xs: 300, sm: 350, md: 400 } }}>
          <Box className="form-title">
            <Typography className="title-header-modal">Select Customer</Typography>
            <Box>
              <Button
                onClick={() => {
                  // setIsFormModalOpen(true);
                  props.onClose(false); // use props.onClose
                }}
                variant="text"
                sx={{ marginRight: 1 }}
              >
                Add New
              </Button>
              <Button endIcon={<CancelIcon className="close-icon" />} onClick={() => props.onClose(false)} />
            </Box>
          </Box>

          <Box className="select-box-select-customer">
            {isLoading ? (
              <Typography textAlign="center" mt={4} color="text.secondary">
                Loading...
              </Typography>
            ) : customers.length > 0 ? (
              <List>
                {customers.map((customer) => (
                  <Box
                    key={customer.uuid}
                    onClick={() => {
                      props.onCustomerSelected(customer.uuid);
                      props.onClose(true);
                    }}
                    className="customer-selected-select-customer"
                  >
                    <Avatar src={customer.avatar} alt={customer.firstName} />
                    <Box width="100%">
                      <Typography variant="body1" className="customer-name-select-customer">
                        {customer.firstName} {customer.lastName}
                      </Typography>
                      <Typography variant="body2" className="customer-email-select-customer">
                        {customer.email}
                      </Typography>
                    </Box>
                    <ArrowForwardOutlinedIcon className="arrow-icon" />
                  </Box>
                ))}
              </List>
            ) : (
              <Typography textAlign="center" mt={4} color="text.secondary">
                No customers found.
              </Typography>
            )}
          </Box>

          <Box display="flex" justifyContent="center" alignItems="center" padding={1.5} gap={2}>
            <Button variant="text" onClick={() => setPage((prev) => Math.max(0, prev - 1))} disabled={page === 0 || isLoading}>
              Back
            </Button>

            <Typography variant="body2" color="text.secondary">
              {totalCustomers > 0 ? `${page + 1} of ${Math.ceil(totalCustomers / limit)}` : ''}
            </Typography>

            <Button
              variant="text"
              onClick={() => {
                const totalPages = Math.ceil(totalCustomers / limit);
                if (page + 1 >= totalPages) return;

                setIsLoadingModalTransition(true);
                setPage((prev) => prev + 1);
              }}
              disabled={page + 1 >= Math.ceil(totalCustomers / limit) || isLoading || isLoadingModalTransition}
            >
              Load More
            </Button>
          </Box>
        </Box>
      </Modal>
      {/* <CustomerFormModal open={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} /> */}
    </>
  );
};

export default SelectCustomerModal;
