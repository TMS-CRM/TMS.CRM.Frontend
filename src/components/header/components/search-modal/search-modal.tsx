import { BusinessCenterOutlined, ChecklistOutlined, DashboardOutlined, PeopleAltOutlined } from '@mui/icons-material';
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter'; // para Deals
import CloseIcon from '@mui/icons-material/Close';
import GroupIcon from '@mui/icons-material/Group'; // para Customers
import HistoryIcon from '@mui/icons-material/History';
import SearchIcon from '@mui/icons-material/Search';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import { Box, Divider, IconButton, InputBase, List, ListItem, ListItemIcon, ListItemText, Modal, Tooltip, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { api } from '../../../../services/api';

const tmsSearch = [
  {
    name: 'Home',
    title: 'Home',
    path: '/',
    icon: (
      <Tooltip title="Home" placement="right">
        <DashboardOutlined className="icon-menu" />
      </Tooltip>
    ),
  },
  {
    name: 'Deals',
    title: 'Deals',
    path: '/deals',
    icon: (
      <Tooltip title="Deals" placement="right">
        <BusinessCenterOutlined className="icon-menu" />
      </Tooltip>
    ),
  },
  {
    name: 'Customers',
    title: 'Customers',
    path: '/customers',
    icon: (
      <Tooltip title="Customers" placement="right">
        <PeopleAltOutlined className="icon-menu" />
      </Tooltip>
    ),
  },
  {
    name: 'Tasks',
    title: 'Tasks',
    path: '/tasks',
    icon: (
      <Tooltip title="Tasks" placement="right">
        <ChecklistOutlined className="icon-menu" />
      </Tooltip>
    ),
  },
  {
    name: 'Users',
    title: 'Users',
    path: '/users',
    icon: (
      <Tooltip title="Users" placement="right">
        <AssignmentIndOutlinedIcon className="icon-menu" />
      </Tooltip>
    ),
  },
];

interface Deal {
  id: string;
  title: string;
}

interface Customer {
  id: string;
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
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const isFetchingRef = useRef(false);

  const controller = new AbortController();

  useEffect(() => {
    if (!query) {
      setDeals([]);
      setCustomers([]);
      return;
    }
  }, [query]);

  async function fetchData(query: string): Promise<void> {
    if (isFetchingRef.current) {
      return;
    }

    isFetchingRef.current = true;
    setIsLoading(true);

    try {
      const [dealsResponse, customersResponse] = await Promise.all([
        api.get<{ data: Deal[]; total: number }>(`/deals?search=${encodeURIComponent(query)}`),
        api.get<{ data: { items: Customer[]; total: number } }>(`/customers?search=${encodeURIComponent(query)}`),
      ]);

      const dealsData = dealsResponse.data.data || [];
      const customersData = customersResponse.data.data.items || [];

      setDeals(dealsData);
      setCustomers(customersData);
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
            onChange={(e) => setQuery(e.target.value)}
            fullWidth
            sx={{
              fontSize: '1rem',
              fontWeight: 400,
              color: 'text.primary',
            }}
          />
          {query && (
            <IconButton size="small" onClick={() => setQuery('')}>
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </Box>

        {/* Quando query está vazia */}
        {!query && (
          <>
            <Typography variant="overline" mt={3} mb={1.5} px={1} color="text.secondary">
              Recent Searches
            </Typography>
            <List dense disablePadding>
              {tmsSearch.map(({ name, path, icon }) => (
                <ListItem
                  key={path}
                  sx={{
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease-in-out',
                    '&:hover': {
                      backgroundColor: '#f0f0f0',
                    },
                  }}
                  onClick={() => setQuery(name)} // usar 'name' para a query
                >
                  <ListItemIcon>{icon /* já é um JSX Element com Tooltip */}</ListItemIcon>
                  <ListItemText primary={name} />
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 3 }} />
          </>
        )}

        {/* Quando tem query, mostra resultados */}
        {query && (
          <>
            <Typography variant="body2" color="secondary" px={1} pb={1}>
              Results for: <strong>{query}</strong>
            </Typography>

            {(isLoading || deals.length || customers.length) && (
              <>
                {deals.length > 0 && (
                  <>
                    <Typography variant="subtitle2" px={1} mb={1} color="text.primary">
                      Deals
                    </Typography>
                    <List dense disablePadding>
                      {deals.map((deal) => (
                        <ListItem
                          component="button"
                          key={deal.id}
                          sx={{
                            px: 2,
                            py: 1,
                            borderRadius: 2,
                            '&:hover': { backgroundColor: '#f0f0f0' },
                          }}
                          onClick={() => {
                            // handle click (ex: navegar)
                            console.log('Clicked deal', deal);
                            onClose();
                          }}
                        >
                          <ListItemIcon>
                            <BusinessCenterIcon fontSize="small" color="primary" />
                          </ListItemIcon>
                          <ListItemText primary={deal.title} />
                        </ListItem>
                      ))}
                    </List>
                  </>
                )}

                {customers.length > 0 && (
                  <>
                    <Typography variant="subtitle2" px={1} mt={2} mb={1} color="text.primary">
                      Customers
                    </Typography>
                    <List dense disablePadding>
                      {customers.map((cust) => (
                        <ListItem
                          component="button"
                          key={cust.id}
                          sx={{
                            px: 2,
                            py: 1,
                            borderRadius: 2,
                            '&:hover': { backgroundColor: '#f0f0f0' },
                          }}
                          onClick={() => {
                            console.log('Clicked customer', cust);
                            onClose();
                          }}
                        >
                          <ListItemIcon>
                            <GroupIcon fontSize="small" color="success" />
                          </ListItemIcon>
                          <ListItemText primary={cust.name} />
                        </ListItem>
                      ))}
                    </List>
                  </>
                )}
              </>
            )}

            {/* Loading e sem resultados */}
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
                  gap: 1.5,
                }}
              >
                <Typography variant="body2">No results found</Typography>
                <SearchOffIcon sx={{ width: 40, height: 40, color: 'text.disabled' }} />
              </Box>
            )}
          </>
        )}
      </Box>
    </Modal>
  );
};

export default CommandSearchModal;
