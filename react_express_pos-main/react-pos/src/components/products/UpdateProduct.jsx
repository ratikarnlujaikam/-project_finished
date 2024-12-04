import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Snackbar,
  CircularProgress,
  IconButton
} from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';

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

const imageFiles = import.meta.glob('../../assets/img/*.{jpg,jpeg,png,gif}', { eager: true });
const images = Object.fromEntries(
  Object.entries(imageFiles).map(([key, value]) => [
    key.split('/').pop(), // เอาเฉพาะชื่อไฟล์
    value.default
  ])
);


export const UpdateProduct = () => {
  const { id } = useParams(); // รับ id จาก URL
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    stock_quantity: 0,
    description: '',
    category: '',
    img: ''
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [oldname, setOldname] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [originalImage, setOriginalImage] = useState('');

  console.log(originalImage,'originalImage')

  console.log(image,'image')
     // ฟังก์ชันสำหรับหา URL ของรูปภาพ
     const getImageUrl = (imageName) => {
      // ถ้าไม่มีชื่อไฟล์รูปภาพ ให้ใช้รูป default
      if (!imageName) return '/default-product-image.jpg';
      
      // หารูปภาพจาก images object
      const imageUrl = images[imageName]?.default || images[imageName];
      return imageUrl || '/default-product-image.jpg';
    };

  // Fetch existing product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/products/${id}`);
        const productData = response.data.result[0];
        
        setFormData({
          name: productData.name || '',
          price: productData.price || 0,
          stock_quantity: productData.stock_quantity || 0,
          description: productData.description || '',
          category: productData.category || '',
          img: productData.img || ''
        });

        // If there's an existing image, set the preview
        //  if (productData.img) {
        //  setPreview(`${getImageUrl(productData.img)}`);
        //   setOldname(`${productData.img}`);
        //   setOriginalImage(productData.img); // เก็บชื่อไฟล์รูปภาพต้นฉบับ
        // }

        if (productData.img) {
          const imagePath = getImageUrl(productData.img);
          setPreview(imagePath);
          setOldname(`${productData.img}`);
          setOriginalImage(imagePath);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setSnackbarMessage('Error fetching product data');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

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

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
    
  //   const formDataToSend = new FormData();
  //   formDataToSend.append('name', formData.name);
  //   formDataToSend.append('price', formData.price);
  //   formDataToSend.append('stock_quantity', formData.stock_quantity);
  //   formDataToSend.append('description', formData.description);
  //   formDataToSend.append('category', formData.category);
  //   if (image) {
  //     formDataToSend.append('img', image);
  //   } else if (!preview) {
  //     formDataToSend.append('img', '');
  //   } else {
  //     formDataToSend.append('img', originalImage);
  //   }



  //   console.log(formDataToSend,'formDataToSend');

  //   try {
  //     const response = await axios.put(
  //       `http://localhost:8000/products/update/${id}`,
  //       formDataToSend,
  //       {
  //         headers: {
  //           'Content-Type': 'multipart/form-data'
  //         }
  //       }
  //     );
      
  //     if (response.data.status === 'success') {
  //       setSnackbarMessage('Product updated successfully');
  //       setSnackbarSeverity('success');
  //       setOpenSnackbar(true);
        
  //       // Redirect after successful update
  //       setTimeout(() => {
  //         navigate('/management_pro');
  //       }, 1000);
  //     }
  //   } catch (error) {
  //     console.error('Error updating product:', error);
  //     setSnackbarMessage('Error updating product');
  //     setSnackbarSeverity('error');
  //     setOpenSnackbar(true);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('stock_quantity', formData.stock_quantity);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('category', formData.category);
  
    // แก้ไขการจัดการรูปภาพ
    if (image) {
      // กรณีมีการอัพโหลดรูปใหม่
      formDataToSend.append('img', image);
    } else if (!preview && !originalImage) {
      // กรณีไม่มีรูปเลย
      formDataToSend.append('img', '');
    } else {
      // กรณียังใช้รูปเดิม
      formDataToSend.append('currentImage', oldname); // ส่งชื่อไฟล์รูปเดิม
    }
  
    try {
      const response = await axios.put(
        `http://localhost:8000/products/update/${id}`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      if (response.data.status === 'success') {
        setSnackbarMessage('Product updated successfully');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        
        setTimeout(() => {
          navigate('/management_pro');
        }, 1000);
      }
    } catch (error) {
      console.error('Error updating product:', error);
      setSnackbarMessage('Error updating product');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };


  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  
  const handleDeleteImage = async () => {
    try {
      const response = await axios.put(`http://localhost:8000/products/clear-image/${id}`);
      
      if (response.data.status === 'success') {
        setPreview('');
        setOldname(null);
        setFormData(prev => ({ ...prev, img: '' }));
        setSnackbarMessage('Image deleted successfully');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        setImage(null);
        setOriginalImage('');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      setSnackbarMessage('Error deleting image');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  

  return (    
    <Box sx={{ flexGrow: 1,height:'100vh', backgroundColor: "#eee"  }} >
          <Grid container justifyContent={'center'} >
          <Grid lg={6}>
        <StyledPaper elevation={3}>
          <Typography variant="h5" gutterBottom>
            Update Product
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
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl sx={{ width: '100%' }}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={formData.category}
                    label="Category"
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
                <Box display="flex" flexDirection="column" alignItems="start" gap={2}>
                  <label htmlFor="contained-button-file">
                    <Input
                      accept="image/*"
                      id="contained-button-file"
                      type="file"
                      onChange={handleImageChange}
                    />
                    <Button variant="contained" component="span">
                      Change Product Image
                    </Button>
                  </label>
                  {/* {preview &&(
                    <Box mt={2} display="flex" justifyContent="center" width="100%">
                      <PreviewImage src={preview} alt="Preview" />
                    </Box>
                  )} */}

              {preview && (
                <Box mt={2} display="flex" flexDirection="column" alignItems="center" width="100%">
                  <Box position="relative" width="fit-content">
                    <PreviewImage src={preview} alt="Preview" sx={{boxShadow:3,}}/>
                    <IconButton
                      onClick={handleDeleteImage}
                      sx={{
                        position: 'absolute',
                        top: 15,
                        right: 0,
                        backgroundColor: 'white',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        },
                      }}
                    >
                      <CloseIcon color="error" />
                    </IconButton>
                  </Box>
                </Box>
              )}
                      
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                >
                  Update Product
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