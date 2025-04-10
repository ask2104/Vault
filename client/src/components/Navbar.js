import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const Navbar = () => {
  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            Warranty Manager
          </Typography>
          <Button
            color="inherit"
            component={RouterLink}
            to="/add"
            startIcon={<AddIcon />}
          >
            Add Item
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 