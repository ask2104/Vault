import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Paper,
  Grid,
  IconButton,
} from '@mui/material';
import { PhotoCamera, Delete as DeleteIcon } from '@mui/icons-material';

// Configure axios defaults
axios.defaults.baseURL = 'http://localhost:5000';

const categories = ['electronics', 'furniture', 'appliances', 'other'];

const ItemForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    purchaseDate: '',
    expiryDate: '',
    category: '',
    price: '',
    receipt: null,
  });
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (isEditMode) {
      fetchItem();
    }
  }, [isEditMode]);

  const fetchItem = async () => {
    try {
      const res = await axios.get(`/api/items/${id}`);
      const item = res.data;
      setFormData({
        title: item.title,
        description: item.description,
        purchaseDate: item.purchaseDate.split('T')[0],
        expiryDate: item.expiryDate ? item.expiryDate.split('T')[0] : '',
        category: item.category,
        price: item.price,
        receipt: null,
      });
      if (item.receiptPath) {
        setPreviewUrl(`http://localhost:5000/${item.receiptPath}`);
      }
    } catch (err) {
      setError('Error fetching item details');
      console.error('Error fetching item:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
    setError('');

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (isEditMode) {
        await axios.put(`/api/items/${id}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        await axios.post('/api/items', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || `Error ${isEditMode ? 'updating' : 'adding'} item`);
    }
  };

  const handleRemoveFile = () => {
    setFormData((prev) => ({
      ...prev,
      receipt: null,
    }));
    setPreviewUrl(null);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          {isEditMode ? 'Edit Item' : 'Add New Item'}
        </Typography>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
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
              <TextField
                fullWidth
                label="Purchase Date"
                name="purchaseDate"
                type="date"
                value={formData.purchaseDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Expiry Date"
                name="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  label="Category"
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                InputProps={{
                  startAdornment: '₹',
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<PhotoCamera />}
                >
                  {isEditMode ? 'Change Receipt' : 'Upload Receipt'}
                  <input
                    type="file"
                    hidden
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                  />
                </Button>
                {previewUrl && (
                  <IconButton onClick={handleRemoveFile} color="error">
                    <DeleteIcon />
                  </IconButton>
                )}
              </Box>
              {previewUrl && (
                <Box sx={{ mt: 2 }}>
                  {formData.receipt?.type === 'application/pdf' ? (
                    <Typography>PDF file selected</Typography>
                  ) : (
                    <img
                      src={previewUrl}
                      alt="Receipt preview"
                      style={{ maxWidth: '100%', maxHeight: 200 }}
                    />
                  )}
                </Box>
              )}
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  {isEditMode ? 'Update Item' : 'Add Item'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/')}
                  fullWidth
                >
                  Cancel
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default ItemForm; 