
import React from 'react'
import { SignInPage } from '@toolpad/core/SignInPage';
import { useMsal } from '@azure/msal-react';
import { Box,Button,Typography } from '@mui/material';
import MicrosoftIcon from '@mui/icons-material/Microsoft';


export const Login = () => {

    const {instance} = useMsal()

      const handleSignIn = () => {
        instance.loginRedirect({
            scopes: ['user.read']
        })
    }
  return (
   <Box sx={{height:'100vh',border:'1px solid #fff',textAlign:'center'}}>
          <Typography variant='h3' sx={{marginTop:'250px'}}>
            POS (Point of Sale) 
          </Typography>
         <Box>
         <SignInPage handleSignIn={handleSignIn}/>
         <Button variant="contained" onClick={handleSignIn} ><MicrosoftIcon sx={{mx:1}}/> Sign in with Microsoft </Button>
         </Box>
   </Box>
  )
}

