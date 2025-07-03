import { Box, Card, Typography } from '@mui/material';
import React from 'react';
import './counter-card.css';

interface CounterCardProps {
  title: string;
  count: number;
  iconCounter: string;
  onClick: () => void;
}

const CounterCard: React.FC<CounterCardProps> = (props: CounterCardProps) => {
  // Determine if the count is 0
  const isCountZero = props.count === 0;

  return (
    <Card className="card-counter" onClick={props.onClick} style={{ cursor: 'pointer' }}>
      <Box className="content">
        <Typography variant="h5" className={`title-counter ${isCountZero ? 'zero-count' : ''}`}>
          {props.title}
        </Typography>
        <Typography color="secondary" className={`body-text-counter ${isCountZero ? 'zero-count' : ''}`}>
          {props.count}
        </Typography>
      </Box>
      <img
        className="image-counter"
        src={props.iconCounter}
        alt={props.title}
        width={80}
        height={80}
        style={{
          borderRadius: '50%',
          filter: isCountZero ? 'grayscale(100%)' : 'none',
        }}
      />
    </Card>
  );
};

export default CounterCard;
