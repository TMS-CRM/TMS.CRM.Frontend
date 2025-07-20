import { ChecklistOutlined } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import ReportIcon from '@mui/icons-material/Report';
import {
  Backdrop,
  Button,
  CircularProgress,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React from 'react';
import { type JSX, useEffect, useRef, useState } from 'react';
import AlertSnackbar from '../../components/alert-snackbar/alert-snackbar';
import EmptyState from '../../components/empty-state/empty-state';
import SectionHeader from '../../components/section-header/section-header';
import TaskModal from '../../components/task-form-modal/task-form-modal';
import { useHeader } from '../../hooks/use-header';
import { api } from '../../services/api';
import type { Task } from '../../types/task';
// import './tasks.css';

const Tasks: React.FC = () => {
  const { setTitle, setButton } = useHeader();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedTaskUuid, setSelectedTaskUuid] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  const hasTasks = tasks.length > 0;

  const isEditing = selectedTaskUuid !== null;

  const [totalTasks, setTotalTasks] = useState<number>(0);
  const [page, setPage] = useState<number>(0);

  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'saved' | 'deleted'>('saved');

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingModalTransition, setIsLoadingModalTransition] = useState(false);

  const limit = 10;

  // isFetchingRef controls fetching state to avoid duplicates
  const isFetchingRef = useRef(false);

  useEffect(() => {
    setTitle('Tasks');
    setButton(
      <Button
        className="add-new-header"
        variant="contained"
        endIcon={<AddIcon sx={{ color: 'white' }} />}
        onClick={() => {
          setIsModalOpen(true);
          setSelectedTaskUuid(null);
        }}
      >
        Add New Task
      </Button>,
    );
  }, [setTitle, setButton]);

  useEffect(() => {
    void fetchTasks(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchTasks(currentPage: number): Promise<void> {
    if (isFetchingRef.current) {
      return;
    }

    isFetchingRef.current = true;
    setIsLoading(true);

    try {
      const response = await api.get<{ data: { items: Task[]; total: number } }>(`/tasks?limit=${limit}&offset=${page * limit}`);
      const responseData = response.data.data;

      setTasks((prevTasks) => (currentPage === 0 ? responseData.items : [...prevTasks, ...responseData.items]));
      setTotalTasks(responseData.total);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }

  function setPageAndRefresh(newPage: number): void {
    setPage(newPage);
    void fetchTasks(newPage);
  }

  function getStatusIcon(task: Task): JSX.Element | null {
    const currentDate = new Date();
    const dueDate = new Date(task.dueDate);

    if (task.completed) {
      return <CheckBoxIcon className="check-box-icon-task-card" />;
    } else if (dueDate < currentDate) {
      return <ReportIcon className="report-icon-task-card" />;
    }
    return null;
  }

  function isTaskOverdue(task: Task): boolean {
    const currentDate = new Date();
    const dueDate = new Date(task.dueDate);
    return !task.completed && dueDate < currentDate;
  }

  const columnHeaders = [
    { label: 'Done', icon: <CheckBoxIcon className="check-box-task-page" /> },
    { label: 'Due Date ' },
    { label: 'Task ' },
    { label: 'Edit', isRightAligned: true },
  ];

  return (
    <main>
      <Backdrop open={isLoadingModalTransition} sx={{ zIndex: 1500 }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Grid container sx={{ padding: { xs: '12px', sm: '16px', md: '24px ' } }}>
        {isLoading ? (
          <Grid size={{ xs: 12 }} sx={{ textAlign: 'center', paddingTop: '150px' }}>
            <CircularProgress size={40} />
          </Grid>
        ) : !hasTasks ? (
          <EmptyState icon={<ChecklistOutlined />} message="No tasks found." />
        ) : (
          <>
            <Grid size={{ xs: 12, md: 12 }}>
              <SectionHeader title="Tasks" counter={totalTasks} sortByValue={['Date Created', 'Alphabetic']} filterOptions={['Complete']} />
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
                    {tasks.map((task: Task) => (
                      <React.Fragment key={task.uuid}>
                        <TableRow
                          onClick={() => {
                            setSelectedTaskUuid(task.uuid);
                            setIsLoadingModalTransition(true);

                            setTimeout(() => {
                              setIsModalOpen(true);
                              setIsLoadingModalTransition(false);
                            }, 400);
                          }}
                          sx={{ cursor: 'pointer' }}
                        >
                          {/* Icon */}
                          <TableCell>
                            <Typography variant="caption">{getStatusIcon(task)}</Typography>
                          </TableCell>

                          {/* Date */}
                          <TableCell>
                            <Typography
                              variant="caption"
                              sx={{
                                color: isTaskOverdue(task) ? '#FE8084' : '#092C4C',
                              }}
                            >
                              {new Date(task.dueDate).toLocaleString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </Typography>
                          </TableCell>

                          {/* Description */}
                          <TableCell>
                            <Typography variant="caption">{task.description}</Typography>
                          </TableCell>

                          <TableCell
                            sx={{
                              textAlign: 'right',
                            }}
                          >
                            <Typography variant="body2">
                              <DriveFileRenameOutlineOutlinedIcon className="table-cell" />
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Button
                variant="outlined"
                disabled={isLoading || tasks.length >= totalTasks}
                onClick={() => setPageAndRefresh(page + 1)}
                sx={{ marginTop: '16px', justifyContent: 'center', display: 'flex' }}
              >
                Load more
              </Button>
            </Grid>
          </>
        )}
      </Grid>

      <TaskModal
        open={isModalOpen}
        taskUuid={isEditing ? selectedTaskUuid : null}
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

export default Tasks;
