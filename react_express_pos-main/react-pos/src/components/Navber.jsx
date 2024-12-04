import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import {Button} from "@mui/material";
import Badge from "@mui/material/Badge";
import InputBase from "@mui/material/InputBase";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useIsAuthenticated } from "@azure/msal-react";

import { useMsal } from '@azure/msal-react';


const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "#000",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

export const Navber = () => {

  const {instance} = useMsal()
  const isAuthenticated = useIsAuthenticated();

  const navigate = useNavigate();

  const nextcheckout = () => {
    navigate("/checkout");
  }
  const navigateAddproduct = () => {
    navigate("/addproduct");
  }
  const naviManagement_pro = () => {
    navigate("/management_pro");
  }

//   const handleSignIn = () => {
//     instance.loginRedirect({
//         scopes: ['user.read']
//     })
// }

const handleSignIn = async () => {
  try {
    const loginRequest = {
      scopes: ['user.read', 'openid', 'profile', 'email'],
      prompt: 'select_account'
    };
    await instance.loginRedirect(loginRequest);
  } catch (error) {
    console.error('Login failed:', error);
    // อาจจะเพิ่ม error handling UI ตรงนี้
    // เช่น แสดง toast notification หรือ error message
  }
};


const handleSignOut = () => {
  instance.logout();
  }

  const cart = useSelector((state) => state.cart);
  return (
    <Box sx={{ flexGrow: 1 }} >
      <AppBar position='static' sx={{ pt: 2, pb: 2,bgcolor:'#fff' }}>
        <Toolbar variant='dense'>
          <Typography
            variant='h6'
            color='primary'
            component='div'
            sx={{ pr: 4 }}
          >
            POS
          </Typography>
          {/* <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder='Search…'
              inputProps={{ "aria-label": "search" }}
            />
          </Search> */}
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{display:'flex', alignItems:'center'}}>
          <Typography
            variant='body-2'
            color='primary'
            component='div'
            sx={{ pr: 4, cursor: 'pointer' }}
            onClick={naviManagement_pro}
          >
           จัดการสินค้า
          </Typography>
          <Typography
            variant='body-2'
            color='primary'
            component='div'
            sx={{ pr: 4, cursor: 'pointer' }}
            onClick={navigateAddproduct}
          >
            เพิ่มสินค้า
          </Typography>
          <Typography
            variant='body-2'
            color='primary'
            component='div'
            sx={{ pr: 4, cursor: 'pointer' }}
            onClick={()=> navigate('/dashboard')}
          >
           ยอดขาย
          </Typography>

        

          <IconButton
            size="large"
            aria-label="show shopping cart"
            color="inherit"
            sx={{ color: "primary.main" }}
            onClick={nextcheckout}
          >
            <Badge badgeContent={cart.cartTotalQuantity} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>

          {isAuthenticated ? (
           <Button
             variant='outlined'
             color='error'
             sx={{textTransform: 'none',ml:2}}
             onClick={handleSignOut}
           >
            Logout
           </Button>
          ):(
            <Button
            variant='outlined'
            color='primary'
            sx={{textTransform: 'none',ml:2}}
            onClick={handleSignIn}
            >
            Login
            </Button>

          )}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
