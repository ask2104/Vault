import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from '@mui/material';
import { Receipt as ReceiptIcon } from '@mui/icons-material';

const Navbar = () => {
  return (
    <AppBar position="sticky" elevation={0} sx={{ background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <ReceiptIcon sx={{ mr: 1, fontSize: 28 }} />
            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              sx={{
                textDecoration: 'none',
                color: 'white',
                fontWeight: 600,
                letterSpacing: '0.5px',
              }}
            >
              Warranty & Bills Locker
            </Typography>
          </Box>
          <Button
            component={RouterLink}
            to="/add"
            variant="contained"
            color="secondary"
            sx={{
              ml: 2,
              px: 3,
              py: 1,
              borderRadius: 2,
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              '&:hover': {
                boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
              },
            }}
          >
            Add New Item
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 