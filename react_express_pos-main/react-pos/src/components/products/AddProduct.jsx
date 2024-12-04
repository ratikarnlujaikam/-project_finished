import React, { useState } from 'react';
import axios from 'axios';
import {
  Grid,
  TextField,
  Button,
  Paper,
  Typography,
  Box,
  InputAdornment,
  Alert,
  Snackbar
} from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { styled } from '@mui/material/styles';

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: '70px',
}));

const Input = styled('input')({
  display: 'none',
});

const PreviewImage = styled('img')({
  maxWidth: '100%',
  maxHeight: '200px',
  objectFit: 'contain',
  marginTop: '16px',
});

export const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    stock_quantity: 0,
    desc: '',
    category: '',
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) { // 5MB limit
        setSnackbarMessage('File size should be less than 5MB');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        return;
      }
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('stock_quantity', formData.stock_quantity);
    formDataToSend.append('desc', formData.desc);
    formDataToSend.append('category', formData.category);
    if (image) {
      formDataToSend.append('img', image); // Changed to 'img' to match backend
    }

    try {
      const response = await axios.post(
        'http://localhost:8000/products/create_product', 
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      if (response.data.status === 'success') {
        setSnackbarMessage('Product created successfully');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        // Reset form
        setFormData({
          name: '',
          price: 0,
          stock_quantity: 0,
          desc: '',
          category: '',
        });
        setImage(null);
        setPreview('');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      setSnackbarMessage('Error creating product');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (    

    <Box sx={{ flexGrow: 1,height:'100vh', backgroundColor: "#eee"  }} >
          <Grid container justifyContent={'center'} >
            <Grid item xs={12} lg={6}>
            <StyledPaper elevation={3} >
            <Typography variant="h5" gutterBottom>
              Add New Product
            </Typography>

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Product Name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    variant="outlined"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">฿</InputAdornment>,
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Stock Quantity"
                    type="number"
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData({...formData, stock_quantity: e.target.value})}
                    variant="outlined"
                  />
                </Grid>
                

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    multiline
                    rows={4}
                    value={formData.desc}
                    onChange={(e) => setFormData({...formData, desc: e.target.value})}
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12}>
                    <FormControl sx={{ width:'100%'}}>
                    <InputLabel id="demo-simple-select-helper-label">catagory</InputLabel>
                    <Select
                    labelId="demo-simple-select-helper-label"
                    id="catagory"
                    value={formData.category}
                    label="catagory"
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    <MenuItem value={'อาหารเสริม'}>อาหารเสริม</MenuItem>
                    <MenuItem value={'นม-โยเกิร์ต'}>นม/โยเกิร์ต</MenuItem>
                    <MenuItem value={'ยาสามัญ'}>ยาสามัญ</MenuItem>
                    <MenuItem value={'เครื่องดื่ม'}>เครื่องดื่ม</MenuItem>
                    </Select>
                    </FormControl>
                </Grid>

            
                <Grid item xs={12}>
                  <label htmlFor="contained-button-file">
                    <Input
                      accept="image/*"
                      id="contained-button-file"
                      type="file"
                      onChange={handleImageChange}
                    />
                    <Button variant="contained" component="span">
                      Upload Product Image
                    </Button>
                  </label>
                  {preview && (
                    <Box mt={2} display="flex" justifyContent="center">
                      <PreviewImage src={preview} alt="Preview" />
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="large"
                  >
                    Create Product
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </StyledPaper>

          <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
          >
            <Alert 
              onClose={handleCloseSnackbar} 
              severity={snackbarSeverity}
              variant="filled"
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
            </Grid>
          </Grid>
    </Box>
  );
};