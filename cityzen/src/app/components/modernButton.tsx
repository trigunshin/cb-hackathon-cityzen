import React from 'react';
import { Button, ButtonProps, styled } from '@mui/material';

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'white',
  borderRadius: 15,
  border: '1px solid #868686',
  boxShadow: '0 3px 5px 2px #a8a8a870',
  color: 'gray',
  height: 48,
  padding: '0 30px',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    boxShadow: '0 6px 10px 2px rgba(85, 85, 85, 0.5)',
    transform: 'translateY(-2px)',
  },
}));

interface ModernButtonProps extends Omit<ButtonProps, 'variant'> {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
}

const ModernButton: React.FC<ModernButtonProps> = ({ onClick, children, ...props }) => {
  return (
    <GradientButton variant="contained" size='large' onClick={onClick} {...props}>
      {children}
    </GradientButton>
  );
};

export default ModernButton;