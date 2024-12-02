import React from 'react';
import { Button, ButtonProps, styled } from '@mui/material';
import Link from 'next/link';

const GradientButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
  borderRadius: theme.spacing(2),
  border: `1px solid ${theme.palette.primary.contrastText}`,
  color: `${theme.palette.text.primary}`,
  fontWeight: 700,
  height: 56,
  padding: '0 30px',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    // Optional: Add hover styles if needed
  },
}));

interface ModernButtonProps extends Omit<ButtonProps, 'variant'> {
  query?: string | null;
  email?: string | null;
  children: React.ReactNode;
  onEmailSubmit?: (email: string) => Promise<void>; // Expecting a function that returns a promise
}

const ModernButton: React.FC<ModernButtonProps> = ({
  children,
  query,
  email,
  onEmailSubmit,
  ...props
}) => {
  const handleClick = async () => {
    if (email && onEmailSubmit) {
      await onEmailSubmit(email);
    }
  };

  if (query) {
    const url = `query?question=${query}`;
    return (
      <GradientButton variant="contained" size="large" {...props}>
        <Link href={url}>{children}</Link>
      </GradientButton>
    );
  } else {
    return (
      <GradientButton
        variant="contained"
        size="large"
        onClick={handleClick} // Use onClick for handling email submission
        {...props}
      >
        {children}
      </GradientButton>
    );
  }
};

export default ModernButton;
