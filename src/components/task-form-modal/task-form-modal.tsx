/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { yupResolver } from '@hookform/resolvers/yup';
import CancelIcon from '@mui/icons-material/Cancel';
import { Box, Button, CircularProgress, Modal, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import './task-form-modal.css';
import '../../styles/modal.css';
import { FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { api } from '../../services/api';
import EmptyState from '../empty-state/empty-state';
import CheckboxController from '../form/check-box-controller';
import DatePickerController from '../form/date-picker-controller';
import TextFieldController from '../form/text-field-controller';

interface TaskModalProps {
  onShowSnackbar: (message: string, severity: 'saved' | 'deleted') => void;
  open: boolean;
  onClose: (refresh: boolean) => void;
  taskUuid: string | null;
}

interface FormValues {
  completed: boolean;
  description: string;
  dueDate: Date;
}

const TaskModal: React.FC<TaskModalProps> = (props: TaskModalProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [wasDeleted, setWasDeleted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isFetchingRef = useRef(false);

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
    if (props.taskUuid && !wasDeleted && props.open) {
      async function fetchTask(): Promise<void> {
        if (isFetchingRef.current) {
          return;
        }

        setIsLoading(true);
        isFetchingRef.current = true;

        try {
          const response = await api.get(`/tasks/${props.taskUuid}`);
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
          isFetchingRef.current = false;
        }
      }

      void fetchTask();
    } else if (props.open && !props.taskUuid) {
      form.reset({
        completed: false,
        description: '',
        dueDate: undefined,
      });
    }
  }, [props.taskUuid, form, wasDeleted, props.open]);

  async function onSubmit(formData: FormValues): Promise<void> {
    setIsSubmitting(true);

    try {
      if (props.taskUuid) {
        await api.put(`/tasks/${props.taskUuid}`, formData);
      } else {
        await api.post(`/tasks`, formData);
      }

      form.reset();
      props.onClose(true);

      props.onShowSnackbar('Task Saved', 'saved');
    } catch (error) {
      console.error('Error saving task:', error);
      props.onShowSnackbar('Failed to save task', 'deleted');
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleDelete = async (): Promise<void> => {
    if (!props.taskUuid) return;
    setIsDeleting(true);

    try {
      await api.delete(`/tasks/${props.taskUuid}`);

      setWasDeleted(true);
      form.reset();

      props.onClose(true);

      props.onShowSnackbar?.('Task Deleted', 'deleted');
    } catch (error) {
      console.error('Error deleting task:', error);
      props.onShowSnackbar?.('Failed to delete task', 'deleted');
    } finally {
      setIsDeleting(true);
    }
  };

  function handleCancel(): void {
    form.reset();
    if (props.open) {
      props.onClose(false);
    }
  }

  return (
    <>
      <Modal open={props.open} onClose={() => props.onClose(false)}>
        <Box
          className="box"
          sx={{
            width: { xs: 290, sm: 350, md: 400 },
          }}
        >
          {isLoading ? (
            <EmptyState message="Loading task..." />
          ) : (
            <>
              <Box className="form-title">
                <Typography variant="h5" className="title-header-modal">
                  {props.taskUuid ? 'Edit Task' : 'Add New Task'}
                </Typography>
                <Button sx={{ minWidth: 0, margin: 0 }} endIcon={<CancelIcon sx={{ color: '#7E92A2' }} />} onClick={handleCancel} />
              </Box>

              <FormProvider {...form}>
                <Box className="form-container">
                  {props.taskUuid && (
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

                  <Box className="footer-new-task">
                    {!props.taskUuid && (
                      <Button onClick={handleCancel} variant="text" className="button-task button-task--cancel">
                        Cancel
                      </Button>
                    )}

                    {props.taskUuid && (
                      <Button
                        onClick={() => {
                          void handleDelete();
                        }}
                        variant="text"
                        className="button-task button-task--delete"
                      >
                        {isDeleting ? <CircularProgress size={20} color="inherit" /> : 'Delete'}
                      </Button>
                    )}

                    <Button variant="contained" onClick={form.handleSubmit(onSubmit)} className="save-button-task" disabled={!form.formState.isDirty}>
                      {isSubmitting ? <CircularProgress size={20} color="inherit" /> : props.taskUuid ? 'Done' : 'Save Task'}
                    </Button>
                  </Box>
                </Box>
              </FormProvider>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default TaskModal;
