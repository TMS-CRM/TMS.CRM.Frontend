import { ChecklistOutlined } from '@mui/icons-material';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import ReportIcon from '@mui/icons-material/Report';
import { Box, Button, Card, CardContent, Container, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import React, { Fragment, type JSX, useEffect, useRef, useState } from 'react';
import './task-card.css';
import { useNavigate } from 'react-router-dom';
import AlertSnackbar from '../../../../components/alert-snackbar/alert-snackbar';
import EmptyState from '../../../../components/empty-state/empty-state';
import TaskModal from '../../../../components/task-form-modal/task-form-modal';
import { api } from '../../../../services/api';
import type { Task } from '../../../../types/task';

const TaskCard: React.FC = () => {
  const navigate = useNavigate();

  const isFetchingRef = useRef(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskUuid, setTaskUuid] = useState<string | null>(null);

  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'saved' | 'deleted'>('saved');

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const limit = 8;

  useEffect(() => {
    void fetchTasks();
  }, [page]);

  // async function fetchTasks(): Promise<void> {
  //   if (isFetchingRef.current) {
  //     return;
  //   }

  //   isFetchingRef.current = true;
  //   setIsLoading(true);

  //   try {
  //     const response = await api.get(`/tasks?limit=${limit}&offset=${page * limit}`);
  //     const responseData = response.data.data;
  //     setTasks(responseData.items);
  //   } catch (error) {
  //     console.error('Error fetching tasks:', error);
  //   } finally {
  //     setIsLoading(false);
  //     isFetchingRef.current = false;
  //   }
  // }

  function fetchTasks(): void {
    if (isFetchingRef.current) {
      return;
    }

    isFetchingRef.current = true;
    setIsLoading(true);

    try {
      const response = {
        data: {
          data: {
            items: [],
            total: 0,
          },
        },
      };
      const responseData = response.data.data;
      setTasks(responseData.items);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }

  // async function handleTaskListChange(): Promise<void> {
  //   setPage(0);
  //   setTasks([]);
  //   await fetchTasks();
  // }

  if (isLoading) {
    return <Typography sx={{ p: 4 }}>Loading tasks...</Typography>;
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

  return (
    <>
      {tasks.length > 0 ? (
        <Container className="container-task">
          <Card className="task-card">
            <CardContent className="card-content-task">
              <Box className="header-task-card">
                <Typography variant="h5" className="title-task-card">
                  Task To Do
                </Typography>
                <Button
                  onClick={() => void navigate('/task')}
                  variant="text"
                  color="primary"
                  sx={{
                    '&:hover': {
                      backgroundColor: 'transparent',
                      boxShadow: 'none',
                    },
                  }}
                >
                  View All
                </Button>
              </Box>

              <Box className="task-list">
                {tasks.map((task: Task) => (
                  <Fragment key={task.uuid}>
                    <Grid
                      container
                      className="task-body"
                      onClick={() => {
                        setTaskUuid(task.uuid);
                        setIsModalOpen(true);
                      }}
                      sx={{ mb: 3 }} // Add margin bottom for line height between tasks
                    >
                      <Grid size={{ xs: 8, sm: 5, md: 4, lg: 4.5 }}>
                        <Box className="date-icon-conatiner">
                          <Typography
                            variant="body2"
                            sx={{
                              color: isTaskOverdue(task) ? '#FE8084' : '#092C4C',
                            }}
                          >
                            {new Date(task.dueDate).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              // hour: '2-digit',
                              // minute: '2-digit',
                            })}
                          </Typography>
                          {getStatusIcon(task)}
                        </Box>
                      </Grid>

                      <Grid size={{ xs: 12, sm: 7, md: 8, lg: 7.5 }}>
                        <Typography variant="body2" className="task-description">
                          {task.description}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Fragment>
                ))}
              </Box>
            </CardContent>

            <Box className="add-new-task-box">
              <Button
                onClick={() => {
                  setTaskUuid(null);
                  setIsModalOpen(true);
                }}
                className="add-new-task-button"
              >
                Add new task
              </Button>
              <ArrowForwardOutlinedIcon className="arrow-task-card" />
            </Box>
          </Card>
        </Container>
      ) : (
        <Card
          className="task-card"
          sx={{
            height: { xs: 290, sm: 350, md: 400 },
          }}
        >
          <EmptyState message="No upcoming tasks found." icon={<ChecklistOutlined />} />
        </Card>
      )}

      <TaskModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onShowSnackbar={(message, severity) => {
          setSnackbarMessage(message);
          setSnackbarSeverity(severity);
          setSnackbarOpen(true);
        }}
        taskUuid={taskUuid}
      />
      <AlertSnackbar open={snackbarOpen} message={snackbarMessage} severity={snackbarSeverity} onClose={() => setSnackbarOpen(false)} />
    </>
  );
};

export default TaskCard;
