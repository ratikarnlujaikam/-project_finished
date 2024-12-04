import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import { Grid2,Box } from "@mui/material"


// Import รูปภาพโดยตรง
import menu1 from '../assets/menu-image/menu-1.jpg';
import milk from '../assets/menu-image/milk.jpg';
import menu3 from '../assets/menu-image/menu-3.jpg';
import menu4 from '../assets/menu-image/menu-4.jpg';



export const Payment = () => {

    const navigate = useNavigate();

    const setSession = (pay) => {
        sessionStorage.setItem('payment',JSON.stringify(pay))
        navigate('/checkout');
    }

    const data = [
        {id: 1, name: 'เงินสด', image:`${menu1}`, description: 'ชำระเงินสด: จ่ายเป็นเงินสดทันทีเมื่อซื้อสินค้า/บริการ',icons:'fa-regular fa-money-bill-1'},
        {id: 2, name: 'โอนเงิน', image: `${milk}`, description: 'โอนเงิน: โอนเงินจากบัญชีธนาคารผ่านแอปหรืออินเทอร์เน็ตแบงก์กิ้ง', icons:'fa-solid fa-money-bill-transfer'},
        {id: 3, name: 'บัตรเครดิต', image: `${menu3}`, description: 'บัตรเครดิต: ชำระเงินผ่านบัตรเครดิต สามารถผ่อนชำระได้ตามเงื่อนไขของธนาคาร',icons:'fa-solid fa-credit-card ms-2'}
        
    ]
  return (
   <>
      <Box sx={{ flexGrow: 1,height:'100vh', backgroundColor: "#eee",border:'1px solid #eee'  }} >
        <Grid2  sx={{display:'flex', mt:5, alignItems:'center'}} >
            {data.map((item) => (
                <Grid2 key={item.id} item xs={12} sm={6} lg={4} sx={{mx:3,width:'100%'}}> {/* ปรับ responsive grid */}
                <Card onClick={()=> setSession(item.name)} sx={{width:'100%'}}>
                    <CardActionArea>
                    {/* <CardMedia
                        component="img"
                        height="140"
                        image={item.image}
                        alt="green iguana"
                    /> */}
                    <Box sx={{height:'200px',display:'flex',justifyContent:'center',alignItems:'center',background:'#03a9f4'}}>
                     <i className={item.icons} style={{fontSize:'120px',color:'#eee'}}></i>
                    </Box>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                        {item.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {item.description}
                        </Typography>
                    </CardContent>
                    </CardActionArea>
                    <CardActions>
                    <Button size="small" color="primary">
                        Click 
                    </Button>
                    </CardActions>
                </Card>
                </Grid2>
            ))}
        </Grid2>
    </Box>
   </>
  )
}
