import CelebrationIcon from '@mui/icons-material/Celebration';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import { Alert, IconButton, Snackbar } from '@mui/material';
import React from 'react';
import './alert.css';

interface AlertSnackbarProps {
  open: boolean;
  message: string | null;
  severity: 'saved' | 'deleted';
  onClose: () => void;
}

const AlertSnackbar: React.FC<AlertSnackbarProps> = ({ open, message, severity, onClose }) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const Icon = severity === 'saved' ? CelebrationIcon : WhatshotIcon;

  return (
    <Snackbar
      className="snack-bar-alert"
      open={open}
      autoHideDuration={5000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert
        onClose={onClose}
        severity={severity === 'saved' ? 'success' : 'error'}
        icon={<Icon className={`icon-${severity}`} />}
        action={
          <IconButton onClick={onClose}>
            <HighlightOffIcon className="close-alert" />
          </IconButton>
        }
        className="alert-snackbar"
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default AlertSnackbar;
