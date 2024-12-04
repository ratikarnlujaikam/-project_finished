import * as React from "react";
import { useEffect,useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

import { Orders } from "./Orders";


export const Cart = () => {

const [serialNumber, setSerialNumber] = useState(null);

console.log(serialNumber,'serialNumber')
useEffect(() =>{
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };
  
  fetch("http://localhost:8000/order/serial_number", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      if(result.status === "success") {
        setSerialNumber(result.result);
      }
    })
    .catch((error) => console.error(error));
},[]);

  return (
    <Box
      sx={{
        width: "100%",
        
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", pb: 4 }}>
        <Typography variant='h4' gutterBottom>
          ORDER
        </Typography>
        <Typography variant='h4' gutterBottom>
          {serialNumber && serialNumber[0]? serialNumber[0].sale_id: (
            <p style={{fontSize:'12px'}}>
            Loading...
            </p>
          )} 
        </Typography>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <Orders />
      {/* <TotalMoney /> */}
    </Box>
  );
};
