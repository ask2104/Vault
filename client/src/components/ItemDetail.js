import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Button,
  Box,
  Chip,
  Link,
} from '@mui/material';
import { format } from 'date-fns';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Configure axios defaults
axios.defaults.baseURL = 'http://localhost:5000';

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);

  const fetchItem = useCallback(async () => {
    try {
      const res = await axios.get(`/api/items/${id}`);
      setItem(res.data);
    } catch (err) {
      console.error('Error fetching item:', err);
      navigate('/');
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchItem();
  }, [fetchItem]);

  if (!item) {
    return null;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/')}
          >
            Back
          </Button>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/edit/${id}`)}
          >
            Edit
          </Button>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h4" gutterBottom>
              {item.title}
            </Typography>
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
              {format(new Date(item.purchaseDate), 'MMMM d, yyyy')}
            </Typography>
          </Grid>

          {item.expiryDate && (
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" color="textSecondary">
                Expiry Date
              </Typography>
              <Typography variant="body1">
                {format(new Date(item.expiryDate), 'MMMM d, yyyy')}
              </Typography>
            </Grid>
          )}

          {item.receiptPath && (
            <Grid item xs={12}>
              <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                Receipt
              </Typography>
              {item.receiptPath.endsWith('.pdf') ? (
                <Link href={item.receiptPath} target="_blank" rel="noopener">
                  View PDF Receipt
                </Link>
              ) : (
                <Box sx={{ mt: 2 }}>
                  <img
                    src={item.receiptPath}
                    alt="Receipt"
                    style={{ maxWidth: '100%', maxHeight: '400px' }}
                  />
                </Box>
              )}
            </Grid>
          )}
        </Grid>
      </Paper>
    </Container>
  );
};

export default ItemDetail; 