import React from 'react'
import { Box, Grid } from '@mui/material'
import { useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
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
    

export const Management_pro = () => {

    const navigate = useNavigate();

    const [allproducts,setAllProducts] = useState([])

    const productsAmount = allproducts ? allproducts.length :0;

    const fetchProduct = (()=> {
        const requestOptions = {
          method: "GET",
          redirect: "follow"
        };
        
        fetch("http://localhost:8000/products", requestOptions)
          .then((response) => response.json())
          .then((result) => {
            console.log(result,'result')
               // ตรวจสอบโครงสร้างข้อมูลและแปลงให้เป็น array ถ้าจำเป็น
          const productsArray = Array.isArray(result) ? result : 
          result.result ? Array.isArray(result.result) ? result.result : [] :
          [];
    
          console.log('Processed Products:', productsArray); // ดูข้อมูลหลังแปลง
          setAllProducts(productsArray);
          })
          .catch((error) => console.error(error));
      })

    const handleDelete = ((product_id)=> {
        const requestOptions = {
            method: "DELETE",
            redirect: "follow"
          };
          
          fetch(`http://localhost:8000/products/delete/`+ product_id, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                if(result.status =='success') {
                    alert('Deleted successfully')
                    fetchProduct();
                }
            })
            .catch((error) => console.error(error));
    }) 
    
      useEffect(() => {
        
        fetchProduct();
      }, [])

               // ฟังก์ชันสำหรับหา URL ของรูปภาพ
     const getImageUrl = (imageName) => {
        // ถ้าไม่มีชื่อไฟล์รูปภาพ ให้ใช้รูป default
        if (!imageName) return '/default-product-image.jpg';
        
        // หารูปภาพจาก images object
        const imageUrl = images[imageName]?.default || images[imageName];
        return imageUrl || '/default-product-image.jpg';
      };
  


  return (
    <Box sx={{ flexGrow: 1,height:'100vh', backgroundColor: "#eee"  }} >
          <Grid container >
            <Grid xs={12} lg={12}>
            <section className="h-100 h-custom " >
                <MDBContainer className="py-5 h-100">
                    <MDBRow className="justify-content-center align-items-center h-100">
                    <MDBCol style={{height:'800px',width:'100%',overflow:'scroll'}}>
                        <MDBCard>
                        <MDBCardBody className="p-4">
                            <MDBRow>
                            <MDBCol lg="12">
                                <MDBTypography tag="h5">
                                <a href="#!" className="text-body">
                                    <MDBIcon fas icon="long-arrow-alt-left me-2" /> Continue
                                    shopping
                                </a>
                                </MDBTypography>

                                <hr />

                                <div className="d-flex justify-content-between align-items-center mb-4">
                                <div>
                                    <p className="mb-1">Shopping cart</p>
                                    <p className="mb-0">You have {productsAmount} items in your cart</p>
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

                               {allproducts && allproducts.map ((item) => {
                                 const { name, price, img, cartQuantity, description, product_id, category, stock_quantity } = item;
                                 return(
                                    <MDBCard className="mb-3" key={product_id}>
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

                                 

                                    <div className="d-flex flex-row align-items-center,">
                                        <div style={{ width: "100px", 
                                             display:'flex', flexDirection:'column', 
                                             justifyContent:'start',alignItems:'center',
                                            marginRight:'40px'
                                        }}>
                                        <p className="small mb-0"> Catagory</p>
                                        <p  className="small mb-0">
                                            {category}
                                        </p>
                                        </div>

                                        <div style={{ width: "50px", 
                                            display:'flex', flexDirection:'column', 
                                            justifyContent:'start',alignItems:'center',
                                            marginRight:'50px'
                                        }}>
                                        <p className="small mb-0"> Stock </p>
                                        <p  className="small mb-0">
                                            {stock_quantity}
                                        </p>
                                        </div>
                                        <div style={{ width: "80px" }}>
                                        <MDBTypography tag="h5" className="mb-0">
                                           {price} ฿
                                        </MDBTypography>
                                        </div>
                                        <a href="#!" style={{ color: "#cecece" , display:'flex', flexDirection:'column'}}>
                                        <MDBIcon fas icon="trash-alt" onClick={()=>handleDelete(product_id)} />
                                        <MDBIcon fas icon="fa-regular fa-pen-to-square" onClick={()=>navigate(`/update_product/${product_id}`)} className='mt-3' />
                                        </a>
                                    </div>
                                    </div>
                                </MDBCardBody>
                                </MDBCard>
                                 )
                                 
                               })}
                                
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
  )
}
