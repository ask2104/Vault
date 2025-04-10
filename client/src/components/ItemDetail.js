import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  IconButton,
  Grid,
  Chip,
} from '@mui/material';
import { Delete as DeleteIcon, ArrowBack as ArrowBackIcon, Edit as EditIcon } from '@mui/icons-material';

// Configure axios defaults
axios.defaults.baseURL = 'http://localhost:5000';

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    try {
      const res = await axios.get(`/api/items/${id}`);
      setItem(res.data);
    } catch (err) {
      setError('Error fetching item details');
      console.error('Error fetching item:', err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`/api/items/${id}`);
        navigate('/');
      } catch (err) {
        setError('Error deleting item');
        console.error('Error deleting item:', err);
      }
    }
  };

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="error">{error}</Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/')}
            sx={{ mt: 2 }}
          >
            Back to List
          </Button>
        </Paper>
      </Container>
    );
  }

  if (!item) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography>Loading...</Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/')}
          >
            Back to List
          </Button>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/edit/${id}`)}
            >
              Edit
            </Button>
            <IconButton
              color="error"
              onClick={handleDelete}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>

        <Typography variant="h4" gutterBottom>
          {item.title}
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Chip
              label={item.category}
              color="primary"
              sx={{ mb: 2 }}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="body1" paragraph>
              {item.description}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" color="textSecondary">
              Purchase Date
            </Typography>
            <Typography variant="body1">
              {new Date(item.purchaseDate).toLocaleDateString()}
            </Typography>
          </Grid>

          {item.expiryDate && (
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" color="textSecondary">
                Expiry Date
              </Typography>
              <Typography variant="body1">
                {new Date(item.expiryDate).toLocaleDateString()}
              </Typography>
            </Grid>
          )}

          {item.price && (
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" color="textSecondary">
                Price
              </Typography>
              <Typography variant="body1">
                ₹{item.price}
              </Typography>
            </Grid>
          )}

          {item.receiptPath && (
            <Grid item xs={12}>
              <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                Receipt
              </Typography>
              {item.receiptPath.endsWith('.pdf') ? (
                <Button
                  variant="outlined"
                  href={`http://localhost:5000/${item.receiptPath}`}
                  target="_blank"
                >
                  View PDF Receipt
                </Button>
              ) : (
                <Box
                  component="img"
                  src={`http://localhost:5000/${item.receiptPath}`}
                  alt="Receipt"
                  sx={{
                    maxWidth: '100%',
                    maxHeight: 400,
                    objectFit: 'contain',
                  }}
                />
              )}
            </Grid>
          )}
        </Grid>
      </Paper>
    </Container>
  );
};

export default ItemDetail; 