/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { yupResolver } from '@hookform/resolvers/yup';
import CancelIcon from '@mui/icons-material/Cancel';
import { Box, Button, Modal, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import './task-form-modal.css';
import '../../styles/modal.css';
import { FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { api } from '../../services/api';
import CheckboxController from '../form/check-box-controller';
import DatePickerController from '../form/date-picker-controller';
import TextFieldController from '../form/text-field-controller';

interface TaskModalProps {
  onShowSnackbar: (message: string, severity: 'saved' | 'deleted') => void;
  open: boolean;
  onClose: () => void;
  onTaskListChange?: () => void;
  taskUuid: number | null;
}

interface FormValues {
  completed: boolean;
  description: string;
  dueDate: Date;
}

const TaskModal: React.FC<TaskModalProps> = (props: TaskModalProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [wasDeleted, setWasDeleted] = useState<boolean>(false);

  const taskUuid = props.taskUuid;

  const schema = yup.object().shape({
    completed: yup.boolean().required('Completion status is required'),
    description: yup.string().required('Task description is required'),
    dueDate: yup.date().nullable().required('Due date is required'),
  });

  const form = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      completed: false,
      description: undefined,
      dueDate: undefined,
    },
  });

  useEffect(() => {
    if (taskUuid && !wasDeleted && props.open) {
      async function fetchTask(): Promise<void> {
        try {
          setIsLoading(true);
          const response = await api.get(`/tasks/${taskUuid}`);
          const responseData = response.data.data;

          // console.log('task fetched', response.data.data);

          form.reset({
            completed: responseData.completed,
            description: responseData.description,
            dueDate: new Date(responseData.dueDate as string),
          } as FormValues);
        } catch (error) {
          console.error('Failed to fetch task', error);
        } finally {
          setIsLoading(false);
        }
      }

      void fetchTask();
    } else {
      form.reset({
        completed: false,
        description: '',
        dueDate: undefined,
      });
    }
  }, [taskUuid, form, wasDeleted, props.open]);

  const handleDelete = async (): Promise<void> => {
    if (!taskUuid) return;

    try {
      await api.delete(`/tasks/${taskUuid}`);

      setWasDeleted(true);
      form.reset();

      props.onClose();
      props.onTaskListChange?.();

      props.onShowSnackbar?.('Task Deleted', 'deleted');
    } catch (error) {
      console.error('Error deleting task:', error);
      props.onShowSnackbar?.('Failed to delete task', 'deleted');
    }
  };

  const onSubmit = form.handleSubmit(async (formData) => {
    console.log('FormData', formData);
    try {
      if (taskUuid) {
        await api.put(`/tasks/${taskUuid}`, formData);
        console.log(taskUuid);
      } else {
        await api.post('/tasks', formData);
      }

      form.reset();

      props.onClose();
      props.onTaskListChange?.();

      props.onShowSnackbar?.('Task Saved', 'saved');
    } catch (error) {
      console.error('Error saving task:', error);
      props.onShowSnackbar?.('Failed to save task', 'deleted');
    }
  });

  function handleCancel(): void {
    form.reset();
    if (props.open) {
      props.onClose();
    }
  }

  if (isLoading) {
    return <Typography sx={{ p: 4 }}>Loading task...</Typography>;
  }

  return (
    <>
      <Modal open={props.open} onClose={props.onClose}>
        <Box
          className="box"
          sx={{
            width: { xs: 290, sm: 350, md: 400 },
            maxHeight: '90vh',
          }}
        >
          <Box className="form-title">
            <Typography variant="h5" className="title-header-modal">
              {taskUuid ? 'Edit Task' : ' Add New Task'}
            </Typography>
            <Button sx={{ minWidth: 0, margin: 0 }} endIcon={<CancelIcon sx={{ color: '#7E92A2' }} />} onClick={props.onClose} />
          </Box>
          <FormProvider {...form}>
            <Box className="form-container">
              {taskUuid && (
                <Box className="completed-container">
                  <Typography className="label">Completed?</Typography>
                  <CheckboxController name="completed" className="check-box-icon-modal" />
                </Box>
              )}

              <TextFieldController name="description" type="text" multiline rows={4} placeholder="Enter task description" />

              <Box className="due-date-box-new-task">
                <Typography variant="body1" className="label">
                  Due Date
                </Typography>
                <DatePickerController name="dueDate" />
              </Box>

              <Box className="form-footer">
                {!taskUuid && (
                  <Button onClick={handleCancel} variant="text" className="button-task button-task--cancel">
                    Cancel
                  </Button>
                )}

                {taskUuid && (
                  <Button
                    onClick={() => {
                      void handleDelete();
                    }}
                    variant="text"
                    className="button-task button-task--delete"
                  >
                    Delete
                  </Button>
                )}

                <Button
                  variant="contained"
                  onClick={() => {
                    void onSubmit();
                  }}
                  className="save-button-task"
                  disabled={!form.formState.isDirty}
                >
                  {taskUuid ? 'Done' : 'Save Task'}
                </Button>
              </Box>
            </Box>
          </FormProvider>
        </Box>
      </Modal>
    </>
  );
};

export default TaskModal;
