import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import CancelIcon from '@mui/icons-material/Cancel';
import { Avatar, Box, Button, List, Typography } from '@mui/material';
import Modal from '@mui/material/Modal';
import React, { useEffect, useRef, useState } from 'react';
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
  const [currentIndex, setCurrentIndex] = useState(0);
  // const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [totalCustomers, setTotalCustomers] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0);
  const limit = 6;
  const customersPerPage = limit;

  // const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('modal props.open', props.open);
  }, [props.open]);

  useEffect(() => {
    void fetchCustomers();
  }, [page]);

  async function fetchCustomers(): Promise<void> {
    try {
      setIsLoading(true);
      const response = await api.get<{ data: { items: Customer[]; total: number } }>(`/customers?limit=${limit}&offset=${page * limit}`);
      const responseData = response.data.data;

      setCustomers((prev) => [...prev, ...responseData.items]); // append new data
      setTotalCustomers(responseData.total);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setIsLoading(false);
    }
  }

  function loadMore(): void {
    setPage((prev) => prev + 1);
    setCurrentIndex((prev) => prev + customersPerPage);
  }

  function goBack(): void {
    setCurrentIndex((prev) => Math.max(0, prev - customersPerPage));
  }

  const currentCustomers = customers.slice(currentIndex, currentIndex + customersPerPage);
  const totalPages = Math.ceil(customers.length / customersPerPage);
  const currentPage = Math.floor(currentIndex / customersPerPage) + 1;

  // function handleCancel(): void {
  //   if (props.open) {
  //     props.onClose(true);
  //   }
  // }

  return (
    <>
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
            ) : currentCustomers.length > 0 ? (
              <List>
                {currentCustomers.map((customer) => (
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
            <Button variant="text" onClick={goBack} disabled={currentIndex === 0}>
              Back
            </Button>
            <Typography variant="body2" color="text.secondary">
              {totalPages > 0 ? `${currentPage} of ${totalPages}` : ''}
            </Typography>
            <Button variant="text" onClick={loadMore} disabled={currentIndex + customersPerPage >= totalCustomers}>
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
