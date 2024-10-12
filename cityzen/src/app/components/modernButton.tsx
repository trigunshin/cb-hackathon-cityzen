import React from 'react';
import { Button, ButtonProps, styled } from '@mui/material';

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  border: 0,
  borderRadius: 30,
  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
  color: 'white',
  height: 48,
  padding: '0 30px',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    boxShadow: '0 6px 10px 2px rgba(33, 203, 243, .5)',
    transform: 'translateY(-2px)',
  },
}));

interface ModernButtonProps extends Omit<ButtonProps, 'variant'> {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
}

const ModernButton: React.FC<ModernButtonProps> = ({ onClick, children, ...props }) => {
  return (
    <GradientButton variant="contained" onClick={onClick} {...props}>
      {children}
    </GradientButton>
  );
};

export default ModernButton;