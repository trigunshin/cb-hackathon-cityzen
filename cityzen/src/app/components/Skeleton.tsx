import React from 'react';
import Skeleton from '@mui/material/Skeleton';

const MySkeleton = () => {
  return (
    <div>
      <Skeleton variant="text" width={200} />
      <Skeleton variant="rectangular" width={210} height={118} />
      <Skeleton variant="circular" width={40} height={40} />
    </div>
  );
};

export default MySkeleton;