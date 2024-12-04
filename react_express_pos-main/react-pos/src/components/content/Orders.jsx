import React, { useEffect, useState } from "react";
import { Stack } from "@mui/material";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import { useDispatch, useSelector } from "react-redux";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import {ToastContainer } from 'react-toastify';
import {
  getTotals,
  decreaseCart,
  removeFromCart,
  addToCart,
  clearCart,
} from "../../features/cart/cartSlice";
import { TotalMoney } from "./TotalMoney";


const imageFiles = import.meta.glob('../../assets/img/*.{jpg,jpeg,png,gif}', { eager: true });
const images = Object.fromEntries(
  Object.entries(imageFiles).map(([key, value]) => [
    key.split('/').pop(), // เอาเฉพาะชื่อไฟล์
    value.default
  ])
);

export const Orders = () => {
  const dispatch = useDispatch();
  const { cartItems, cartTotalQuantity, cartTotalAmount } = useSelector(
    (state) => state.cart
  );
  const cart = useSelector((state) => state.cart);

  const vat = cartTotalAmount * 0.07;
  const totalAmountWithVat = cartTotalAmount + cartTotalAmount * 0.07;

  
  const handleAddToCart = (product) => {
    dispatch(addToCart(product));

  };
  // const handleRemoveFromCart = (product) => {
  //   dispatch(removeFromCart(product));
  // };
  const DecreaseQuantity = (product) => {
    dispatch(decreaseCart(product));
  };
  const handleClearCart = () => {
    dispatch(clearCart());
  };

  useEffect(() => {
    dispatch(getTotals());
  }, [cart, dispatch]);

     // ฟังก์ชันสำหรับหา URL ของรูปภาพ
     const getImageUrl = (imageName) => {
      // ถ้าไม่มีชื่อไฟล์รูปภาพ ให้ใช้รูป default
      if (!imageName) return '/default-product-image.jpg';
      
      // หารูปภาพจาก images object
      const imageUrl = images[imageName]?.default || images[imageName];
      return imageUrl || '/default-product-image.jpg';
    };

    
  return (
    <>
    <ToastContainer  autoClose={1000}/>
      <Stack>
        {cartItems.map((item) => (
          <ListItem
            key={item.product_id}
            sx={{
              borderRadius: "14px",
              background: "var(--actions-extras-light-bue-background, #EAF0F0)",
              mt: 2,
            }}
          >
            <Imageitem image={getImageUrl(item.img)} title={item.name} 
            />
            <Description title={item.name} price={item.price} />
            <Stack sx={{ alignItems: "center" }}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Quantity
              </Typography>
              <Stack direction="row">
                <button
                  onClick={() => {
                    DecreaseQuantity(item);
                  }}
                >
                  -
                </button>
                <input
                  type="number"
                  readOnly
                  value={item.cartQuantity}
                  style={{ width: "40px", textAlign: "center" }}
                />
                <button
                  onClick={() => {
                    handleAddToCart(item);
                  }}
                >
                  +
                </button>
              </Stack>
            </Stack>
          </ListItem>
        ))}
      </Stack>

      <Stack sx={{ mt: 4, px: 2 }}>
        <Stack direction="row" sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6">TotalQuantity</Typography>
          <Typography variant="h6">
            {cartTotalQuantity} <span style={{ fontSize: "12px" }}>Pce.</span>
          </Typography>
        </Stack>
        <Stack direction="row" sx={{ justifyContent: "space-between", mt: 2 }}>
          <Typography variant="h6">Vat 7%</Typography>
          <Typography variant="h6">฿{vat.toFixed(2)}</Typography>
        </Stack>
      </Stack>
      <TotalMoney
        totalAmountWithVat={totalAmountWithVat}
        handleClearCart={handleClearCart}
      />
    </>
  );
};

const Imageitem = (props) => {
  return (
    <ListItemAvatar sx={{ pr: 2 }}>
      <Card>
        <CardMedia
          sx={{ height: 63, width: 63 }}
          image={props.image}
          title={props.title}
          width="100%"
        />
      </Card>
    </ListItemAvatar>
  );
};

const Description = (props) => {
  return (
    <Stack
      direction="row"
      sx={{
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <Stack>
        <Typography variant="subtitle1">{props.title}</Typography>
        <Typography variant="h6">{props.price}</Typography>
      </Stack>
    </Stack>
  );
};
