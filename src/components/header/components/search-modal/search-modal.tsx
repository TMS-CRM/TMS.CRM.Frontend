import { BusinessCenterOutlined, Close as CloseIcon, PeopleAltOutlined, Search as SearchIcon, SearchOff as SearchOffIcon } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  IconButton,
  InputBase,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import defaultImage from '../../../../assets/default-image.jpg';
import { api } from '../../../../services/api';
import type { Customer } from '../../../../types/customer';
import type { DealWithCustomer } from '../../../../types/deal';
import type { User } from '../../../../types/user';
import EmptyState from '../../../empty-state/empty-state';

interface CommandSearchModalProps {
  open: boolean;
  onClose: () => void;
}

export const CommandSearchModal: React.FC<CommandSearchModalProps> = ({ open, onClose }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const [deals, setDeals] = useState<DealWithCustomer[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [totalCustomers, setTotalCustomers] = useState<number>(0);
  const [totalDeals, setTotalDeals] = useState<number>(0);
  const [totalUsers, setTotalUsers] = useState<number>(0);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isFetchingRef = useRef(false);

  const [dealPage, setDealPage] = useState(0);
  const [customerPage, setCustomerPage] = useState(0);
  const [userPage, setUserPage] = useState(0);

  const [activeSearchType, setActiveSearchType] = useState<'deal' | 'customer' | 'user' | ''>('');

  const delay = 1500;
  const pageSize = 2;

  const navigate = useNavigate();

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
    switch (activeSearchType) {
      case 'deal':
        setDealPage(newPage);
        void fetchDeals(newPage, query);
        break;
      case 'customer':
        setCustomerPage(newPage);
        void fetchCustomers(newPage, query);
        break;
      case 'user':
        setUserPage(newPage);
        void fetchUsers(newPage, query);
        break;
    }
  }

  async function fetchDeals(currentPage: number, query: string): Promise<void> {
    if (isFetchingRef.current) {
      return;
    }

    isFetchingRef.current = true;
    setIsLoading(true);

    try {
      const searchValue = encodeURIComponent(query);
      const response = await api.get<{ data: { items: DealWithCustomer[]; total: number } }>(
        `/deals?limit=${pageSize}&offset=0&search=${searchValue}`,
      );
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

  async function fetchCustomers(currentPage: number, query: string): Promise<void> {
    if (isFetchingRef.current) {
      return;
    }

    isFetchingRef.current = true;
    setIsLoading(true);

    try {
      const searchValue = encodeURIComponent(query);

      const response = await api.get<{ data: { items: Customer[]; total: number } }>(`/customers?limit=${pageSize}&offset=0&search=${searchValue}`);
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

  async function fetchUsers(currentPage: number, query: string): Promise<void> {
    if (isFetchingRef.current) {
      return;
    }

    isFetchingRef.current = true;
    setIsLoading(true);

    try {
      const searchValue = encodeURIComponent(query);

      const response = await api.get<{ data: { items: User[]; total: number } }>(`/users?limit=${pageSize}&offset=0&search=${searchValue}`);
      const responseData = response.data.data;

      setUsers((prevCustomers) => (currentPage === 0 ? responseData.items : [...prevCustomers, ...responseData.items]));
      setTotalCustomers(responseData.total);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }

  async function fetchData(query: string): Promise<void> {
    if (isFetchingRef.current) return;

    isFetchingRef.current = true;
    setIsLoading(true);

    try {
      const searchValue = encodeURIComponent(query);
      const [dealsResponse, customersResponse, usersResponse] = await Promise.all([
        api.get<{ data: { items: DealWithCustomer[]; total: number } }>(`/deals?limit=${pageSize}&offset=0&search=${searchValue}`),
        api.get<{ data: { items: Customer[]; total: number } }>(`/customers?limit=${pageSize}&offset=0&search=${searchValue}`),
        api.get<{ data: { items: User[]; total: number } }>(`/users?limit=${pageSize}&offset=0&search=${searchValue}`),
      ]);

      setDeals(dealsResponse.data.data.items);
      setTotalDeals(dealsResponse.data.data.total);

      setCustomers(customersResponse.data.data.items);
      setTotalCustomers(customersResponse.data.data.total);

      setUsers(usersResponse.data.data.items);
      setTotalUsers(usersResponse.data.data.total);

      if (dealsResponse.data.data.total > 0) {
        setActiveSearchType('deal');
      } else if (customersResponse.data.data.total > 0) {
        setActiveSearchType('customer');
      } else if (usersResponse.data.data.total > 0) {
        setActiveSearchType('user');
      }
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

  function handleDealClick(dealUuid: string): void {
    void navigate(`/deal-details/${dealUuid}`);
    onClose();
  }

  function handleCustomerClick(customerUuid: string): void {
    void navigate(`/customer-details/${customerUuid}`);
    onClose();
  }

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
            <Typography variant="body2" color="secondary" px={1} pb={2}>
              Results for: <strong>{query}</strong>
            </Typography>

            {isLoading && <EmptyState message="Loading..." />}

            {!isLoading && deals.length > 0 && (
              <>
                <Paper variant="outlined" sx={{ borderRadius: 2, mb: 3 }}>
                  <Box px={2} py={1.5} borderBottom="1px solid #eee">
                    <Typography variant="h5" display="flex" alignItems="center" gap={1}>
                      <BusinessCenterOutlined fontSize="small" color="primary" />
                      Deals
                    </Typography>
                  </Box>

                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: 'background.default' }}>
                        <TableCell>Deal</TableCell>
                        <TableCell>Customer</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {deals.map((deal) => (
                        <TableRow key={deal.uuid} onClick={() => handleDealClick(deal.uuid)} hover sx={{ cursor: 'pointer', '& td': { py: 1.5 } }}>
                          <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box>
                              <Typography variant="body2">{deal.street}...</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="primary">
                              {deal.customer?.firstName} {deal.customer?.lastName}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <Box textAlign="center" py={1}>
                    <Button
                      sx={{ fontSize: '14px' }}
                      variant="text"
                      disabled={isLoading || deals.length >= totalDeals}
                      onClick={() => setPageAndRefresh(dealPage + 1)}
                    >
                      Load more deals
                    </Button>
                  </Box>
                </Paper>
              </>
            )}

            {!isLoading && customers.length > 0 && (
              <>
                <Paper variant="outlined" sx={{ borderRadius: 2, mb: 3 }}>
                  <Box px={2} py={1.5} borderBottom="1px solid #eee">
                    <Typography variant="h5" display="flex" alignItems="center" gap={1}>
                      <PeopleAltOutlined fontSize="small" color="primary" />
                      Customers
                    </Typography>
                  </Box>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: 'background.default' }}>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {customers.map((cust) => (
                        <TableRow key={cust.uuid} onClick={() => onClose()} hover sx={{ cursor: 'pointer' }}>
                          <TableCell>
                            <Typography variant="body2">
                              {cust.firstName} {cust.lastName}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{cust.email}</Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <Box textAlign="center" py={1}>
                    <Button
                      sx={{ fontSize: '14px' }}
                      variant="text"
                      disabled={isLoading || customers.length >= totalCustomers}
                      onClick={() => setPageAndRefresh(customerPage + 1)}
                    >
                      Load more customers
                    </Button>
                  </Box>
                </Paper>
              </>
            )}

            {/* Users Table */}
            {!isLoading && users.length > 0 && (
              <Paper variant="outlined" sx={{ borderRadius: 2, mb: 3 }}>
                <Box px={2} py={1.5} borderBottom="1px solid #eee">
                  <Typography variant="h5" display="flex" alignItems="center" gap={1}>
                    <PeopleAltOutlined fontSize="small" color="primary" />
                    Users
                  </Typography>
                </Box>

                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: 'background.default' }}>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.uuid} onClick={() => onClose()} hover sx={{ cursor: 'pointer' }}>
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>
                            {user.firstName} {user.lastName}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{user.email}</Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <Box textAlign="center" py={1}>
                  <Button
                    sx={{ fontSize: '14px' }}
                    variant="text"
                    disabled={isLoading || users.length >= totalUsers}
                    onClick={() => setPageAndRefresh(userPage + 1)}
                  >
                    Load more users
                  </Button>
                </Box>
              </Paper>
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
