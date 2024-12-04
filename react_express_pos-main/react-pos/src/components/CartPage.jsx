import React from 'react'
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import { Listmenu } from './content/Listmenu';
import { Cart } from './content/Cart';
import { Box } from '@mui/material';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));
  

export const CartPage = () => {
  return (
    <>
      <Box sx={{ flexGrow: 1 }}> 
        <Grid container>
          <Grid item xs={8} lg={9}>
            <Item sx={{ 
              height: "100vh",
              overflow: 'auto' 
            }}>
              <Listmenu />
            </Item>
          </Grid>
          <Grid item xs={4} lg={3} className='cart'>
            <Item sx={{ 
              height: "100vh",
              overflow: 'auto' 
            }}>
              <Cart />
            </Item>
          </Grid> 
        </Grid>
      </Box>
       
    </>
  )
}
