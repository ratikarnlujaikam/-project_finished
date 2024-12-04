import * as React from "react";
import Box from "@mui/material/Box";
import "/src/style/Sidenav.css";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import TextSnippetOutlinedIcon from "@mui/icons-material/TextSnippetOutlined";
import HomeIcon from "@mui/icons-material/Home";
import PaymentIcon from "@mui/icons-material/Payment";
import BorderAllIcon from "@mui/icons-material/BorderAll";
import { useNavigate } from "react-router-dom";

const stylesidebar = {
  display:'flex', flexDirection:'column',alignItems: 'center'
}

export const Sidenav = () => {
  const navigate = useNavigate();

  const NavigateHome = () => {
    sessionStorage.removeItem('catagory');
    navigate("/home");
    // window.location.reload();
  }

  
  return (
    <Box sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      <nav aria-label='main mailbox folders'>
        <List>
          <ListItem disablePadding sx={{ my: 4 }} onClick={NavigateHome}>
            <ListItemButton sx={stylesidebar}>
                <HomeIcon />
              <ListItemText primary='HOME' className='menu' />
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListItem disablePadding sx={{ my: 4 }} onClick={()=>navigate('/catagory')}>
            <ListItemButton sx={stylesidebar}>
                <TextSnippetOutlinedIcon />
              <ListItemText primary='MENU' className='menu' />
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListItem disablePadding sx={{ my: 4 }} onClick={()=> navigate('/payment')}>
            <ListItemButton sx={stylesidebar}>           
                <PaymentIcon />
              <ListItemText primary='PAYMENT' className='menu' />
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListItem disablePadding sx={{ my: 4 }} onClick={()=> navigate('/orders')}>
            <ListItemButton sx={stylesidebar}>
                <BorderAllIcon/>
              <ListItemText primary='ORDERS' className='menu' />
            </ListItemButton>
          </ListItem>
        </List>
      </nav>
    </Box>
  );
};
