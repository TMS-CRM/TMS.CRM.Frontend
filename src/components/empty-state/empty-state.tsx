import { Grid, Typography } from '@mui/material';

interface EmptyStateProps {
  icon?: React.ReactNode;
  message: string;
  children?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, message, children }) => {
  return (
    <Grid container alignItems="center">
      <Typography
        variant="body1"
        sx={{
          display: 'flex',
          padding: '24px 12px',
          color: '#7e92a2',
          fontWeight: '500',
          gap: '13px',
        }}
      >
        {icon && <span>{icon}</span>}
        <span>{message}</span>
      </Typography>
      {children}
    </Grid>
  );
};

export default EmptyState;
