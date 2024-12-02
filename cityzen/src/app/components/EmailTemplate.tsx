import { Stack, Typography } from '@mui/material';
import { Container } from '@mui/system';
import * as React from 'react';

interface EmailTemplateProps {
  firstName: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
}) => (
  <Container>
    <Stack direction={'column'} spacing={2}>
    <Typography variant='h3'>Hello, {firstName}! You've subscribed to Metrall!</Typography>
    <Typography variant='body1' color='textSecondary'> Welcome to Metrall, the news AI platform that helps stay informed on events within your community.</Typography>
    </Stack>
  </Container>
);
