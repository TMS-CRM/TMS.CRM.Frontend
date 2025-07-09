import { PeopleAltOutlined } from '@mui/icons-material';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import AddIcon from '@mui/icons-material/Add';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import { Button, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AlertSnackbar from '../../components/alert-snackbar/alert-snackbar';
import EmptyState from '../../components/empty-state/empty-state';
import SectionHeader from '../../components/section-header/section-header';
import UserFormModal from '../../components/user-form-modal/user-form-modal';
import { useHeader } from '../../hooks/use-header';
import { api } from '../../services/api';
import type { User } from '../../types/user';

const Users: React.FC = () => {
  const { setTitle, setButton } = useHeader();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  const hasUsers = users.length > 0;

  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [page, setPage] = useState<number>(0);

  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'saved' | 'deleted'>('saved');

  const limit = 10;

  // isLoading controls the UI display for loading state
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // isFetchingRef controls fetching state to avoid duplicates
  const isFetchingRef = useRef(false);

  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    setTitle('Users');
    setButton(
      <Button className="add-new-header" variant="contained" endIcon={<AddIcon sx={{ color: 'white' }} />} onClick={() => setIsModalOpen(true)}>
        Add new user
      </Button>,
    );
  }, [setTitle, setButton]);

  useEffect(() => {
    const state = location.state as { snackbarMessage?: string; snackbarSeverity?: 'saved' | 'deleted'; refresh?: boolean } | null;

    if (state?.snackbarMessage) {
      setSnackbarMessage(state.snackbarMessage);
      setSnackbarSeverity(state.snackbarSeverity ?? 'saved');
      setSnackbarOpen(true);
    }

    if (state?.refresh) {
      setPageAndRefresh(0);
    }

    // Clean up: remove state only after it's been used
    setTimeout(() => {
      window.history.replaceState({}, document.title);
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchUsers(currentPage: number): Promise<void> {
    if (isFetchingRef.current) {
      return;
    }

    isFetchingRef.current = true;
    setIsLoading(true);

    try {
      const response = await api.get<{ data: { items: User[]; total: number } }>(`/users?limit=${limit}&offset=${currentPage * limit}`);
      const responseData = response.data.data;

      setUsers((prevUsers) => (currentPage === 0 ? responseData.items : [...prevUsers, ...responseData.items]));
      setTotalUsers(responseData.total);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }

  useEffect(() => {
    void fetchUsers(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function setPageAndRefresh(newPage: number): void {
    setPage(newPage);
    void fetchUsers(newPage);
  }

  function handleUserClick(userUuid: string): void {
    void navigate(`/user-details/${userUuid}`);
  }

  const columnHeaders = [
    { label: 'Profile', icon: <AccountBoxIcon /> },
    { label: 'Name' },
    { label: 'Email ' },
    { label: 'Edit', isRightAligned: true },
  ];

  return (
    <main>
      <Grid container sx={{ padding: { xs: '12px', sm: '16px', md: '24px ' } }}>
        {isLoading ? (
          <Grid size={{ xs: 12 }} sx={{ textAlign: 'center', paddingTop: '150px' }}>
            <CircularProgress size={40} />
          </Grid>
        ) : !hasUsers ? (
          <EmptyState icon={<PeopleAltOutlined />} message="No users found." />
        ) : (
          <>
            <Grid size={{ xs: 12, md: 12 }}>
              <SectionHeader title="Users" counter={totalUsers} sortByValue={['Date Created', 'Alphabetic']} filterOptions={['Name', 'Email']} />
            </Grid>
            <Grid size={{ xs: 12, md: 12 }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      {columnHeaders.map((header, index) => (
                        <TableCell
                          key={index}
                          sx={{
                            textAlign: header.isRightAligned ? 'right' : 'left',
                          }}
                        >
                          {header.icon ?? header.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user: User) => (
                      <React.Fragment key={user.uuid}>
                        <TableRow key={user.uuid} sx={{ cursor: 'pointer' }} onClick={() => handleUserClick(user.uuid)}>
                          <TableCell>
                            <img src={undefined} alt="Profile" width={44} height={44} style={{ borderRadius: '50%' }} />
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption">
                              {user.firstName} {user.lastName}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption">{user.email}</Typography>
                          </TableCell>

                          <TableCell>
                            <Typography variant="body2" sx={{ textAlign: 'right' }}>
                              <DriveFileRenameOutlineOutlinedIcon />
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </>
        )}
      </Grid>
      <UserFormModal
        open={isModalOpen}
        userUuid={null}
        onClose={(refresh: boolean) => {
          setIsModalOpen(false);
          if (refresh) {
            setPageAndRefresh(0);
          }
        }}
        onShowSnackbar={(message, severity) => {
          setSnackbarMessage(message);
          setSnackbarSeverity(severity);
          setSnackbarOpen(true);
        }}
      />
      <AlertSnackbar open={snackbarOpen} message={snackbarMessage} severity={snackbarSeverity} onClose={() => setSnackbarOpen(false)} />
    </main>
  );
};

export default Users;
