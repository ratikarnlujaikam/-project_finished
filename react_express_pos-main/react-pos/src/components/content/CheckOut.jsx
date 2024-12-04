import React from 'react'
import axios from 'axios';
import {Grid,Box} from "@mui/material";
import { useState,useEffect } from 'react';
import slip from '../../assets/img/slip.jpg';
import Invoice from '../Invoice';
import { toast } from "react-toastify";
import {ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { clearCart, removeFromCart, getTotals} from '../../features/cart/cartSlice';
import {
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBCardImage,
    MDBCol,
    MDBContainer,
    MDBIcon,
    MDBInput,
    MDBRow,
    MDBTypography,
} from "mdb-react-ui-kit";


    
const imageFiles = import.meta.glob('../../assets/img/*.{jpg,jpeg,png,gif}', { eager: true });
const images = Object.fromEntries(
  Object.entries(imageFiles).map(([key, value]) => [
    key.split('/').pop(), // เอาเฉพาะชื่อไฟล์
    value.default
  ])
);


export const CheckOut = () => {

    const dispatch = useDispatch();
    const { cartItems, cartTotalQuantity, cartTotalAmount } = useSelector(
      (state) => state.cart
    );



    
    const cart = useSelector((state) => state.cart);

    console.log(cartItems,'cartItems')
    
    const vat = cartTotalAmount * 0.07;
    const totalAmountWithVat = cartTotalAmount + cartTotalAmount * 0.07

  
    // const DecreaseQuantity = (product) => {
    //     dispatch(decreaseCart(product));
    // };

    const handleRemoveFromCart = (product) => {
    dispatch(removeFromCart(product));
    };
    
    const [paymentMethod, setPaymentMethod] = useState(() => {
      return JSON.parse(sessionStorage.getItem('payment'))
    })
    const [open, setOpen] = useState(false);
    
    const navigate = useNavigate();

    const previos = () => {
        navigate('/')
    }
    const handlCheckOut = () => {
        setOpen(true)
       
        placeOrder();
    };

  const handleClose = () => setOpen(false);

    const handlePaymentChange = (pay) => {
        setPaymentMethod(pay)
    }

    //บันทึกการขาย
    const placeOrder = async () => {
      try {

        
        const orderitems = cartItems.map(item => ({
          product_id: item.product_id,
          quantity: item.cartQuantity,
          price: item.price
        }))

        const response = await axios.post("http://localhost:8000/order/place_order", {
          customer_id: "",
          employee_id: 1,
          payment_method: paymentMethod,
          total_amount: totalAmountWithVat,
          items: orderitems
        }, {
          headers: {
            "Content-Type": "application/json"
          }
        });
        // ตรวจสอบ response และแจ้งเตือน
        if (response.data.status === 'success') {
          toast.success("บันทึกการขายสำเร็จ!", {
            position: "top-right",
            autoClose: 2000
          });
          
          // เคลียร์ตะกร้าสินค้า
          dispatch(clearCart());
          
          // รอสักครู่แล้วนำทางไปหน้าหลัก
          setTimeout(() => {
            navigate('/');
          }, 2000);
        }
        console.log(response.data,'res');
      } catch (error) {
        console.error("Error placing order:", error);
      }
    }


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
            <Box sx={{ flexGrow: 1,backgroundColor:'#eee' , height:'100vh'}}>
              <Grid container  justifyContent={'center'}>
                <Grid  xs={12} lg={12} >
                {/* <Invoice open={open} handleClose={handleClose} /> */}
                <section >
                    <MDBContainer className="py-5 h-100">
                      <div className="d-flex justify-content-center" style={{marginBottom:'20px'}}>
                      <MDBBtn color="info" className='w-100 me-2 py-4' onClick={() => handlePaymentChange('โอนเงิน')}>
                            <h4>
                            โอนเงิน{" "}
                            <i className="fa-regular fa-money-bill-1 ms-2"></i>
                            </h4>           
                        </MDBBtn>
                        <MDBBtn color="info" className='w-100 ms-2 py-4' onClick={() => handlePaymentChange('บัตรเครดิต')}>
                            <h4>
                            บัตรเครดิต{" "}
                            <i className="fa-solid fa-credit-card ms-2"></i>
                            </h4>         
                        </MDBBtn>
                      </div>
                        <MDBRow className="justify-content-center align-items-center h-100">
                        <MDBCol style={{height:'100%',width:'100%'}}>
                            <MDBCard>
                            <MDBCardBody className="p-4">
                                <MDBRow>
                                <MDBCol lg="7">
                                    <MDBTypography tag="h5">
                                    <a href="#!" className="text-body">
                                        <MDBIcon fas icon="long-arrow-alt-left me-2" onClick={previos}/> Continue
                                        shopping
                                    </a>
                                    </MDBTypography>

                                    <hr />

                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                    <div>
                                        <p className="mb-1">Shopping cart</p>
                                        <p className="mb-0">You have {cartTotalQuantity} items in your cart</p>
                                    </div>
                                    <div>
                                        <p>
                                        <span className="text-muted">Sort by:</span>
                                        <a href="#!" className="text-body">
                                            price
                                            <MDBIcon fas icon="angle-down mt-1" />
                                        </a>
                                        </p>
                                    </div>
                                    </div>

                              <div  style={{overflow:'scroll',height:'600px'}}>
                              {cartItems.map ((item) => {
                                    const { name, price, img,cartQuantity, description, product_id } = item;
                                    return(
                                        <MDBCard className="mb-3" key={product_id} >
                                    <MDBCardBody>
                                        <div className="d-flex justify-content-between">
                                        <div className="d-flex flex-row align-items-center">
                                            <div>
                                            <MDBCardImage
                                                src={getImageUrl(img)}
                                                fluid className="rounded-3" style={{ width: "65px" }}
                                                alt="Shopping item" />
                                            </div>
                                            <div className="ms-3">
                                            <MDBTypography tag="h5">
                                                {name}
                                            </MDBTypography>
                                            <p className="small mb-0">{description}</p>
                                            </div>
                                        </div>
                                        <div className="d-flex flex-row align-items-center">
                                            <div style={{ width: "50px" }}>
                                            <MDBTypography tag="h5" className="fw-normal mb-0">
                                                {cartQuantity}
                                            </MDBTypography>
                                            </div>
                                            <div style={{ width: "80px" }}>
                                            <MDBTypography tag="h5" className="mb-0">
                                              {price} ฿
                                            </MDBTypography>
                                            </div>
                                            <a href="#!" style={{ color: "#cecece" }}>
                                            <MDBIcon fas icon="trash-alt" onClick={()=>handleRemoveFromCart(item)} />
                                            </a>
                                        </div>
                                        </div>
                                    </MDBCardBody>
                                    </MDBCard>
                                    )
                                    
                                  })}
                              </div>
                                    
                                </MDBCol>

                                <MDBCol lg="5">
                                {paymentMethod && paymentMethod == 'บัตรเครดิต' ?
                                    <MDBCard className="bg-primary text-white rounded-3">
                                    <MDBCardBody>
                                        <div className="d-flex justify-content-between align-items-center mb-4">
                                        <MDBTypography tag="h5" className="mb-0">
                                            Card details
                                        </MDBTypography>
                                        </div>

                                        <p className="small">Card type</p>
                                        <a href="#!" type="submit" className="text-white">
                                        <MDBIcon fab icon="cc-mastercard fa-2x me-2" />
                                        </a>
                                        <a href="#!" type="submit" className="text-white">
                                        <MDBIcon fab icon="cc-visa fa-2x me-2" />
                                        </a>
                                        <a href="#!" type="submit" className="text-white">
                                        <MDBIcon fab icon="cc-amex fa-2x me-2" />
                                        </a>
                                        <a href="#!" type="submit" className="text-white">
                                        <MDBIcon fab icon="cc-paypal fa-2x me-2" />
                                        </a>

                                        <form className="mt-4">
                                        <MDBInput className="mb-4" label="Cardholder's Name" type="text" size="lg"
                                            placeholder="Cardholder's Name" contrast />

                                        <MDBInput className="mb-4" label="Card Number" type="text" size="lg"
                                            minLength="19" maxLength="19" placeholder="1234 5678 9012 3457" contrast />

                                        <MDBRow className="mb-4">
                                            <MDBCol md="6">
                                            <MDBInput className="mb-4" label="Expiration" type="text" size="lg"
                                                minLength="7" maxLength="7" placeholder="MM/YYYY" contrast />
                                            </MDBCol>
                                            <MDBCol md="6">
                                            <MDBInput className="mb-4" label="Cvv" type="text" size="lg" minLength="3"
                                                maxLength="3" placeholder="&#9679;&#9679;&#9679;" contrast />
                                            </MDBCol>
                                        </MDBRow>
                                        </form>

                                        <hr />

                                        <div className="d-flex justify-content-between">
                                        <p className="mb-2">Subtotal</p>
                                        <p className="mb-2">{cartTotalAmount.toFixed(2)} ฿</p>
                                        </div>

                                        <div className="d-flex justify-content-between">
                                        <p className="mb-2">Vat</p>
                                        <p className="mb-2">{vat.toFixed(2)} ฿</p>
                                        </div>

                                        <div className="d-flex justify-content-between">
                                        <p className="mb-2">Total</p>
                                        <p className="mb-2">{totalAmountWithVat.toFixed(2)} ฿</p>
                                        </div>

                                        <MDBBtn color="info" block size="lg" onClick={handlCheckOut}>
                                        <div className="d-flex justify-content-between">
                                            <span>{totalAmountWithVat.toFixed(2)} ฿</span>
                                            <span>
                                            Checkout{" "}
                                            <i className="fas fa-long-arrow-alt-right ms-2"></i>
                                            </span>
                                        </div>
                                        </MDBBtn>
                                    </MDBCardBody>
                                    </MDBCard>
                                    :(
                                        <MDBCard className="bg-primary text-white rounded-3">
                                        <MDBCardBody>
                                          <div className="d-flex justify-content-between align-items-center mb-4">
                                            <MDBTypography tag="h5" className="mb-0">
                                              QR Payment
                                            </MDBTypography>
                                          </div>
                                
                                          {/* QR Code Section */}
                                          <div className="text-center mb-4">
                                            <img 
                                              src={slip} 
                                              alt="QR Code for payment" 
                                              className="img-fluid rounded-3 mb-3"
                                              style={{ width: "auto", height: "400px" }}
                                            />
                                            <p className="mb-1">Scan to pay</p>
                                            {/* <p className="small">Bank: XXX Bank</p>
                                            <p className="small">Account: XXXX-XXXX-XXXX</p> */}
                                          </div>
                                
                                          {/* Payment Instructions */}
                                          {/* <div className="bg-light text-dark p-3 rounded-3 mb-4">
                                            <h6 className="mb-3">Payment Instructions:</h6>
                                            <ol className="mb-0">
                                              <li className="mb-2">Scan QR code with your banking app</li>
                                              <li className="mb-2">Verify the amount: {totalAmountWithVat.toFixed(2)} ฿</li>
                                            </ol>
                                          </div>
                                 */}
                                          <hr />
                                
                                          {/* Payment Summary */}
                                          <div className="d-flex justify-content-between">
                                        <p className="mb-2">Subtotal</p>
                                        <p className="mb-2">{cartTotalAmount.toFixed(2)} ฿</p>
                                        </div>

                                        <div className="d-flex justify-content-between">
                                        <p className="mb-2">Vat</p>
                                        <p className="mb-2">{vat.toFixed(2)} ฿</p>
                                        </div>

                                        <div className="d-flex justify-content-between">
                                        <p className="mb-2">Total</p>
                                        <p className="mb-2">{totalAmountWithVat.toFixed(2)} ฿</p>
                                        </div>
                                
                                          <MDBBtn color="info" block size="lg" onClick={handlCheckOut}>
                                            <div className="d-flex justify-content-between">
                                              <span>{totalAmountWithVat.toFixed(2)} ฿</span>
                                              <span>
                                                Confirm Payment{" "}
                                                <i className="fas fa-long-arrow-alt-right ms-2"></i>
                                              </span>
                                            </div>
                                          </MDBBtn>
                                        </MDBCardBody>
                                    </MDBCard>
                                    )}
                                </MDBCol>

      
                                </MDBRow>
                            </MDBCardBody>
                            </MDBCard>
                        </MDBCol>
                        </MDBRow>
                    </MDBContainer>
                </section>

                </Grid> 
              </Grid> 
            </Box> 
        </>
  )
}
