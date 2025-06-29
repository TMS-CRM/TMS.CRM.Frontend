import { Grid, Typography } from '@mui/material';

interface EmptyStateProps {
  icon: React.ReactNode;
  message: string;
  children?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, message, children }) => {
  return (
    <main>
      <Grid>
        <Typography className="empty-state-container">
          <span className="empty-state-icon">{icon}</span>
          <span className="empty-state-message">{message}</span>
        </Typography>
        {children}
      </Grid>
    </main>
  );
};
export default EmptyState;
