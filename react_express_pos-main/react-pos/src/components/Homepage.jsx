import * as React from "react";
import { styled } from "@mui/material/styles";
import { Routes, Route,} from "react-router-dom";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { Sidenav } from "./content/Sidenav";
import { CheckOut } from "./content/CheckOut";
import { CartPage } from "./CartPage";
import { AddProduct } from "./products/AddProduct";
import { Management_pro } from "./products/Management_pro";
import {UpdateProduct } from "./products/UpdateProduct";
import { OrderAll } from "./orders/OrderAll";
import { Catagory } from "./Catagory";
import TotalGrowthBarChart from "./Dashboard/TotalGrowthBarChart";
import { Payment } from "./Payment";
import { Login } from "./Login";
import "/src/style/Allcontent.css";


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export const HomePage = () => {
  return (
  <Box sx={{ flexGrow: 1 }}>
  <Grid container sx={{ mt: 1 }}>
    <Grid item xs={2} lg={1}>
      <Item sx={{ height: "100vh" }}>
        <Sidenav />
      </Item>
    </Grid>
    <Grid item xs={10} lg={11}> {/* เพิ่ม Grid item ครอบ Routes */}
      <Routes>
        <Route path="/" element={<CartPage />} />
        <Route path="/home" element={<CartPage />} />
        <Route path="/checkout" element={<CheckOut />} />
        <Route path="/addproduct" element={<AddProduct />} />
        <Route path="/management_pro" element={<Management_pro />} />
        <Route path="/update_product/:id" element={<UpdateProduct/>} />
        <Route path="/orders" element={<OrderAll/>} />
        <Route path="/catagory" element={<Catagory/>} />
        <Route path="/dashboard" element={<TotalGrowthBarChart/>} />
        <Route path="/payment" element={<Payment/>} />
        {/* <Route path="/login" element={<Login/>} /> */}
      </Routes>
    </Grid>
  </Grid>
</Box>
  );
};
