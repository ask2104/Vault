import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  IconButton,
} from '@mui/material';
import { Search as SearchIcon, Delete as DeleteIcon } from '@mui/icons-material';

const categories = ['electronics', 'furniture', 'appliances', 'other'];

const ItemList = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get('/api/items');
      setItems(res.data);
    } catch (err) {
      setError('Error fetching items');
      console.error('Error fetching items:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`/api/items/${id}`);
        setItems(items.filter(item => item._id !== id));
      } catch (err) {
        setError('Error deleting item');
        console.error('Error deleting item:', err);
      }
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
        <TextField
          fullWidth
          label="Search"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            label="Category"
          >
            <MenuItem value="all">All Categories</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Grid container spacing={3}>
        {filteredItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item._id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {item.description}
                </Typography>
                <Typography variant="body2">
                  <strong>Purchase Date:</strong> {new Date(item.purchaseDate).toLocaleDateString()}
                </Typography>
                {item.expiryDate && (
                  <Typography variant="body2">
                    <strong>Expiry Date:</strong> {new Date(item.expiryDate).toLocaleDateString()}
                  </Typography>
                )}
                <Typography variant="body2">
                  <strong>Category:</strong> {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                </Typography>
                {item.price && (
                  <Typography variant="body2">
                    <strong>Price:</strong> ₹{item.price}
                  </Typography>
                )}
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => navigate(`/item/${item._id}`)}>
                  View Details
                </Button>
                <Button size="small" onClick={() => navigate(`/edit/${item._id}`)}>
                  Edit
                </Button>
                <IconButton 
                  size="small" 
                  color="error" 
                  onClick={() => handleDelete(item._id)}
                  sx={{ ml: 'auto' }}
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ItemList; 