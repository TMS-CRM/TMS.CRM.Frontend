import { Box, Card, Typography } from '@mui/material';
import React from 'react';
import './counter-card.css';

interface CounterCardProps {
  title: string;
  count: number;
  iconCounter: unknown;
}

const CounterCard: React.FC<CounterCardProps> = (props: CounterCardProps) => {
  const { title, count } = props;

  // Determine if the count is 0
  const isCountZero = count === 0;

  return (
    <Card className="card-counter">
      <Box className="content">
        <Typography variant="h5" className={`title-counter ${isCountZero ? 'zero-count' : ''}`}>
          {title}
        </Typography>
        <Typography color="secondary" className={`body-text-counter ${isCountZero ? 'zero-count' : ''}`}>
          {count}
        </Typography>
      </Box>
      {/* <Image
        className="image-counter"
        src={iconCounter}
        alt={title}
        width={80}
        height={80}
        style={{
          borderRadius: '50%',
          filter: isCountZero ? 'grayscale(100%)' : 'none',
        }}
      /> */}
    </Card>
  );
};

export default CounterCard;
