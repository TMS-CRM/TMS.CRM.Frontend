/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ChecklistOutlined } from '@mui/icons-material';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import ReportIcon from '@mui/icons-material/Report';
import { Box, Button, Card, CardContent, Container, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import React, { Fragment, type JSX, useEffect, useState } from 'react';
import './task-card.css';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import type { Tasks } from '../../types/task';
import AlertSnackbar from '../alert-snackbar/alert-snackbar';
import TaskModal from '../task-form-modal/task-form-modal';

const TaskCard: React.FC = () => {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskUuid, setTaskUuid] = useState<number | null>(null);

  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'saved' | 'deleted'>('saved');

  const [tasks, setTasks] = useState<Tasks[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const limit = 8;

  useEffect(() => {
    void fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  async function fetchTasks(): Promise<void> {
    try {
      setIsLoading(true);
      const response = await api.get(`/tasks?limit=${limit}&offset=${page * limit}`);
      const responseData = response.data.data;
      setTasks(responseData.items);
      // setTotalTasks(responseData.total);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleTaskListChange(): Promise<void> {
    setPage(0);
    setTasks([]);
    await fetchTasks();
  }

  if (isLoading) {
    return <Typography sx={{ p: 4 }}>Loading tasks...</Typography>;
  }

  // const getStatusIcon = (task: Task) => {
  //   return new Date(task.dueDate) < new Date() ? <ReportIcon className="report-icon" /> : null;
  // };

  function getStatusIcon(task: Tasks): JSX.Element | null {
    const currentDate = new Date();
    const dueDate = new Date(task.dueDate);

    if (task.completed) {
      return <CheckBoxIcon className="check-box-icon-task-card" />;
    } else if (dueDate < currentDate) {
      return <ReportIcon className="report-icon-task-card" />;
    }
    return null;
  }

  function isTaskOverdue(task: Tasks): boolean {
    const currentDate = new Date();
    const dueDate = new Date(task.dueDate);
    return !task.completed && dueDate < currentDate;
  }

  const hasTask = tasks.length > 0;

  if (!hasTask) {
    return (
      <>
        <Card
          className="task-card"
          sx={{
            height: { xs: 290, sm: 350, md: 400 },
          }}
        >
          <CardContent
            className="card-content-task"
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box className="header-task-card">
              <Typography className="title-task">Task To Do</Typography>
            </Box>

            <Box className="not-found-task-card">
              <ChecklistOutlined className="icon-not-found-card" />
              <Typography>No upcoming tasks found.</Typography>
            </Box>
          </CardContent>
          <Box onClick={() => setIsModalOpen(true)} className="add-new-task-box">
            <Button className="add-new-task-button">Add new task</Button>
            <ArrowForwardOutlinedIcon className="arrow-task-card" />
          </Box>
        </Card>
      </>
    );
  }

  return (
    <>
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
              {tasks.map((task: Tasks) => (
                <Fragment key={task.uuid}>
                  <Grid
                    container
                    className="task-body"
                    onClick={() => {
                      setTaskUuid(task.uuid);
                      setIsModalOpen(true);
                    }}
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
      <TaskModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onShowSnackbar={(message, severity) => {
          setSnackbarMessage(message);
          setSnackbarSeverity(severity);
          setSnackbarOpen(true);
        }}
        onTaskListChange={() => void handleTaskListChange()}
        taskUuid={taskUuid}
      />
      <AlertSnackbar open={snackbarOpen} message={snackbarMessage} severity={snackbarSeverity} onClose={() => setSnackbarOpen(false)} />
    </>
  );
};

export default TaskCard;
