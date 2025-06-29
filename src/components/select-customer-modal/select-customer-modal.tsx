import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import CancelIcon from '@mui/icons-material/Cancel';
import { Avatar, Box, Button, List, Modal, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import type { Customers } from '../../types/customer';
import '../../styles/modal.css';
import './select-customer-modal.css';
import CustomerFormModal from '../customer-form-modal/customer-form-modal';

interface SelectCustomerModalProps {
  open: boolean;
  onClose: () => void;
  onCustomerSelected: (customerUuid: number) => void;
}

const SelectCustomerModal: React.FC<SelectCustomerModalProps> = ({ open, onClose, onCustomerSelected }) => {
  const [customers, setCustomers] = useState<Customers[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  const customersPerPage = 6;

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCustomers([]);
  }, [open]);

  // async function loadCustomers(): Promise<void> {
  //   try {
  //     const response = await api.get('/customers');
  //     setCustomers(response.data.data);
  //   } catch (error) {
  //     console.error('Failed to load customers:', error);
  //   }
  // }

  function loadMore(): void {
    setCurrentIndex((prev) => prev + customersPerPage);
  }

  function goBack(): void {
    setCurrentIndex((prev) => Math.max(0, prev - customersPerPage));
  }

  const currentCustomers = customers.slice(currentIndex, currentIndex + customersPerPage);
  const totalPages = Math.ceil(customers.length / customersPerPage);
  const currentPage = Math.floor(currentIndex / customersPerPage) + 1;

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box ref={modalRef} className="box" sx={{ width: { xs: 300, sm: 350, md: 400 }, maxHeight: '80vh' }}>
          <Box className="form-title">
            <Typography className="title-header-modal">Select Customer</Typography>
            <Box>
              <Button
                onClick={() => {
                  setIsFormModalOpen(true);
                  onClose();
                }}
                variant="text"
                sx={{ marginRight: 1 }}
              >
                Add New
              </Button>
              <Button endIcon={<CancelIcon className="close-icon" />} onClick={onClose} />
            </Box>
          </Box>

          <Box className="select-box-select-customer">
            {currentCustomers.length > 0 ? (
              <List>
                {currentCustomers.map((customer) => (
                  <Box
                    key={customer.uuid}
                    onClick={() => {
                      onCustomerSelected(customer.uuid);
                      onClose();
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
            <Typography variant="body2" color="textSecondary">
              {totalPages > 0 ? `${currentPage} of ${totalPages}` : ''}
            </Typography>
            <Button variant="text" onClick={loadMore} disabled={currentIndex + customersPerPage >= customers.length}>
              Load More
            </Button>
          </Box>
        </Box>
      </Modal>

      <CustomerFormModal open={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} />
    </>
  );
};

export default SelectCustomerModal;
