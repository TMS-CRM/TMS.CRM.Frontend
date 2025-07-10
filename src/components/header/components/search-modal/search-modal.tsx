import { BusinessCenterOutlined, Close as CloseIcon, PeopleAltOutlined, Search as SearchIcon, SearchOff as SearchOffIcon } from '@mui/icons-material';
import { Box, Button, IconButton, InputBase, Modal, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { api } from '../../../../services/api';
import EmptyState from '../../../empty-state/empty-state';

interface Deal {
  uuid: string;
  name: string;
}

interface Customer {
  uuid: string;
  name: string;
}

interface CommandSearchModalProps {
  open: boolean;
  onClose: () => void;
}

export const CommandSearchModal: React.FC<CommandSearchModalProps> = ({ open, onClose }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const [deals, setDeals] = useState<Deal[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [totalCustomers, setTotalCustomers] = useState<number>(0);
  const [totalDeals, setTotalDeals] = useState<number>(0);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isFetchingRef = useRef(false);

  const [dealPage, setDealPage] = useState(0);
  const [customerPage, setCustomerPage] = useState(0);

  const delay = 1500;
  const pageSize = 2;

  useEffect(() => {
    const handler = setTimeout(async () => {
      if (!query) {
        setDeals([]);
        setCustomers([]);
        return;
      }

      await fetchData(query);
    }, delay);

    return (): void => clearTimeout(handler); // clear timeout on each keystroke
  }, [query]);

  function setPageAndRefresh(newPage: number): void {
    if (dealPage) {
      setDealPage(newPage);
      void fetchDeals(newPage);
    } else if (customerPage) {
      setCustomerPage(newPage);
      void fetchCustomers(newPage);
    }
  }

  async function fetchDeals(currentPage: number): Promise<void> {
    if (isFetchingRef.current) {
      return;
    }

    isFetchingRef.current = true;
    setIsLoading(true);

    try {
      const response = await api.get<{ data: { items: Deal[]; total: number } }>(`/deals?limit=${pageSize}&offset=${dealPage * pageSize}`);
      const responseData = response.data.data;

      setDeals((prevDeals) => (currentPage === 0 ? responseData.items : [...prevDeals, ...responseData.items]));
      setTotalDeals(responseData.total);
    } catch (error) {
      console.error('Error fetching deals:', error);
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }

  async function fetchCustomers(currentPage: number): Promise<void> {
    if (isFetchingRef.current) {
      return;
    }

    isFetchingRef.current = true;
    setIsLoading(true);

    try {
      const response = await api.get<{ data: { items: Customer[]; total: number } }>(
        `/customers?limit=${pageSize}&offset=${customerPage * pageSize}`,
      );
      const responseData = response.data.data;

      setCustomers((prevCustomers) => (currentPage === 0 ? responseData.items : [...prevCustomers, ...responseData.items]));
      setTotalCustomers(responseData.total);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }

  async function fetchData(query: string): Promise<void> {
    const searchValue = encodeURIComponent(query);

    if (isFetchingRef.current) return;

    isFetchingRef.current = true;
    setIsLoading(true);

    try {
      const [dealsResponse, customersResponse] = await Promise.all([
        api.get<{ data: { items: Deal[]; total: number } }>(`/deals?limit=${pageSize}&offset=0&search=${searchValue}`),
        api.get<{ data: { items: Customer[]; total: number } }>(`/customers?limit=${pageSize}&offset=0&search=${searchValue}`),
      ]);

      setDeals(dealsResponse.data.data.items);
      setTotalDeals(dealsResponse.data.data.total);

      setCustomers(customersResponse.data.data.items);
      setTotalCustomers(customersResponse.data.data.total);
    } catch (error) {
      console.error(`Error fetching ${query}:`, error);
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setDeals([]);
      setCustomers([]);
      setDealPage(0);
      setCustomerPage(0);
    }
  }, [open]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: { xs: '90%', sm: 500 },
          bgcolor: 'background.paper',
          borderRadius: 3,
          boxShadow: 12,
          p: 3,
          outline: 'none',
          maxHeight: '80vh',
          overflowY: 'auto',
        }}
      >
        {/* Search Input */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            px: 2,
            py: 1,
            borderRadius: 2,
            backgroundColor: '#f9f9f9',
            border: '1px solid #e0e0e0',
          }}
        >
          <SearchIcon sx={{ color: 'text.secondary' }} />
          <InputBase
            inputRef={inputRef}
            placeholder="Search anything..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setDealPage(0);
              setCustomerPage(0);
            }}
            fullWidth
            sx={{ fontSize: '1rem', fontWeight: 400, color: 'text.primary' }}
          />
          {query && (
            <IconButton size="small" onClick={() => setQuery('')}>
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </Box>

        {/* No query */}
        {!query && (
          <Box
            sx={{
              px: 2,
              py: 3,
              textAlign: 'center',
              color: 'text.secondary',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <SearchIcon sx={{ fontSize: 40 }} />
            <Typography variant="h6">Start typing to search</Typography>
            <Typography variant="body2">Try searching for a deal, customer or user.</Typography>
          </Box>
        )}

        {/* Query with results */}
        {query && (
          <>
            <Typography variant="body2" color="secondary" px={1} pb={1}>
              Results for: <strong>{query}</strong>
            </Typography>

            {isLoading && <EmptyState message="Loading..." />}

            {!isLoading && deals.length > 0 && (
              <>
                <Typography variant="caption" px={1} mb={1}>
                  Deals
                </Typography>
                <Box display="flex" flexDirection="column" gap={1}>
                  {deals.map((deal) => (
                    <Box
                      key={deal.uuid}
                      onClick={() => {
                        console.log('Clicked deal', deal);
                        onClose();
                      }}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        px: 2,
                        py: 1.5,
                        borderRadius: 2,
                        backgroundColor: '#f9f9f9',
                        boxShadow: 1,
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: '#f0f0f0',
                          boxShadow: 2,
                        },
                      }}
                    >
                      <BusinessCenterOutlined fontSize="small" color="primary" />
                      <Box>
                        <Typography variant="body1" fontWeight={500}>
                          {deal.name}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>

                {/* Load More button */}
                <Box textAlign="center" mt={2}>
                  <Button
                    variant="outlined"
                    disabled={isLoading || deals.length >= totalDeals}
                    onClick={() => setPageAndRefresh(dealPage + 1)}
                    sx={{ marginTop: '16px', justifyContent: 'center', display: 'flex', backgroundColor: '#ececfe', color: '#514ef3' }}
                  >
                    Load more deal
                  </Button>
                </Box>
              </>
            )}

            {!isLoading && customers.length > 0 && (
              <>
                <Typography variant="caption" px={1} mt={2} mb={1}>
                  Customers
                </Typography>
                <Box display="flex" flexDirection="column" gap={1}>
                  {customers.map((cust) => (
                    <Box
                      key={cust.uuid}
                      onClick={() => {
                        console.log('Clicked deal', cust);
                        onClose();
                      }}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        px: 2,
                        py: 1.5,
                        borderRadius: 2,
                        backgroundColor: '#f9f9f9',
                        boxShadow: 1,
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: '#f0f0f0',
                          boxShadow: 2,
                        },
                      }}
                    >
                      <PeopleAltOutlined fontSize="small" color="primary" />
                      <Box>
                        <Typography variant="body1" fontWeight={500}>
                          {cust.name}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>

                {/* Load More button */}
                <Box textAlign="center" mt={2}>
                  <Button
                    variant="outlined"
                    disabled={isLoading || customers.length >= totalCustomers}
                    onClick={() => setPageAndRefresh(customerPage + 1)}
                    sx={{ marginTop: '16px', justifyContent: 'center', display: 'flex', backgroundColor: '#ececfe', color: '#514ef3' }}
                  >
                    Load more customer
                  </Button>
                </Box>
              </>
            )}

            {/* No results */}
            {!isLoading && deals.length === 0 && customers.length === 0 && (
              <Box
                sx={{
                  px: 2,
                  py: 3,
                  bgcolor: '#fafafa',
                  borderRadius: 2,
                  border: '1px dashed #ccc',
                  textAlign: 'center',
                  color: 'text.disabled',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <SearchOffIcon sx={{ width: 50, height: 50, color: 'text.disabled' }} />
                <Typography variant="h6">No results</Typography>
                <Typography variant="body2">
                  We couldn’t find anything matching <strong>“{query}”</strong>.
                </Typography>
              </Box>
            )}
          </>
        )}
      </Box>
    </Modal>
  );
};

export default CommandSearchModal;
