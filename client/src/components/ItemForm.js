import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Box,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';

const categories = ['electronics', 'furniture', 'appliances', 'other'];

// Configure axios defaults
axios.defaults.baseURL = 'http://localhost:5000';

const ItemForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    purchaseDate: new Date(),
    expiryDate: null,
    category: '',
    receipt: null,
  });

  const [previewUrl, setPreviewUrl] = useState('');

  const fetchItem = useCallback(async () => {
    try {
      const res = await axios.get(`/api/items/${id}`);
      const item = res.data;
      setFormData({
        ...item,
        purchaseDate: new Date(item.purchaseDate),
        expiryDate: item.expiryDate ? new Date(item.expiryDate) : null,
      });
      if (item.receiptPath) {
        setPreviewUrl(item.receiptPath);
      }
    } catch (err) {
      console.error('Error fetching item:', err);
      navigate('/');
    }
  }, [id, navigate]);

  useEffect(() => {
    if (isEditMode) {
      fetchItem();
    }
  }, [isEditMode, fetchItem]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (name) => (date) => {
    setFormData((prev) => ({
      ...prev,
      [name]: date,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        receipt: file,
      }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    
    // Add all form fields to FormData
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null) {
        if (key === 'purchaseDate' || key === 'expiryDate') {
          formDataToSend.append(key, format(formData[key], 'yyyy-MM-dd'));
        } else if (key === 'receipt' && formData[key] instanceof File) {
          formDataToSend.append('receipt', formData[key]);
        } else if (key !== 'receipt') {
          formDataToSend.append(key, formData[key]);
        }
      }
    });

    try {
      let response;
      if (isEditMode) {
        console.log('Updating item:', id);
        console.log('Form data:', Object.fromEntries(formDataToSend));
        response = await axios({
          method: 'put',
          url: `/api/items/${id}`,
          data: formDataToSend,
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });
      } else {
        response = await axios({
          method: 'post',
          url: '/api/items',
          data: formDataToSend,
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });
      }

      if (response.data) {
        navigate('/');
      }
    } catch (err) {
      console.error('Error saving item:', err);
      const errorMessage = err.response?.data?.msg || err.message || 'Error saving item. Please try again.';
      alert(errorMessage);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          {isEditMode ? 'Edit Item' : 'Add New Item'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Purchase Date"
                value={formData.purchaseDate}
                onChange={handleDateChange('purchaseDate')}
                renderInput={(params) => <TextField {...params} fullWidth required />}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Expiry Date"
                value={formData.expiryDate}
                onChange={handleDateChange('expiryDate')}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                component="label"
                fullWidth
              >
                Upload Receipt
                <input
                  type="file"
                  hidden
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                />
              </Button>
              {previewUrl && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    Current Receipt:
                  </Typography>
                  {previewUrl.endsWith('.pdf') ? (
                    <Typography variant="body2" color="textSecondary">
                      PDF file selected
                    </Typography>
                  ) : (
                    <img
                      src={previewUrl}
                      alt="Receipt preview"
                      style={{ maxWidth: '100%', maxHeight: '200px' }}
                    />
                  )}
                </Box>
              )}
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  {isEditMode ? 'Update' : 'Save'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default ItemForm; 