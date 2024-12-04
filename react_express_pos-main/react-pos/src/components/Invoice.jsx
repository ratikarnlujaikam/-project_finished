import { useRef, useState, useEffect } from "react";
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import CircularProgress from '@mui/material/CircularProgress';

const styleModal = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  height:'90vh',
  width: 600,
  background:'#fff',
  boxShadow: 24,
  p: 4,
};

const Invoice = ({open, handleClose, s_id}) => {
  const invoiceRef = useRef();
  const [details, setDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePrint = () => {
    window.print();
  };

   // เพิ่มฟังก์ชันสำหรับ format วันที่
   const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    // เพิ่ม 0 ข้างหน้าถ้าเป็นเลขหลักเดียว
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${day}/${month}`;
  };

  const fetchData = () => {
    setIsLoading(true);
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };
    
    fetch(`http://localhost:8000/order/order_details/${s_id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if(result.status === 'success') {
          setDetails(result);
        }
      })
      .catch((error) => console.error(error))
      .finally(() => {
        setIsLoading(false);
      });
  }

  useEffect(() => {
    if(s_id) {  // เช็คว่า s_id มีค่าแล้ว
      fetchData();
    }
  }, [s_id]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box style={styleModal} sx={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <div
              ref={invoiceRef}
              className="invoice-container"
              style={{
                fontFamily: "Arial, sans-serif",
                maxWidth: "210mm",
                margin: "0 auto",
                padding: "20px",
                border: "1px solid #ddd",
                boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                color: '#000',
                marginTop: '10px'
              }}
            >
              <h1>Invoice</h1>
             <div style={{display:'flex', justifyContent:'space-between'}}>
             <p>Date: {formatDate(details?.data?.sale_date) || 'May 14, 2022'}</p>
             <p>No.0000{details?.data?.sale_id}</p>
             </div>
              <p>
                <strong>To:</strong> {details?.data?.customer_name || 'Alex Bets'}
              </p>
              <p>Phone: </p>
              <p>Mail: </p>
              <hr />
              <table style={{ width: "100%" }}>
                <tbody>
                  {details?.data?.items ? (
                    details.data.items.map((item, index) => (
                      <tr key={index}>
                        <td style={{ textAlign: "start" }}>{item.product_name}</td>
                        <td style={{ textAlign: "right",fontSize:'12px' }}>({item.quantity})</td>
                        <td style={{ textAlign: "right" }}>{item.unit_price?.toFixed(2)} ฿</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td style={{ textAlign: "start" }}>UI Design</td>
                      <td style={{ textAlign: "right" }}>2,000.00 ฿</td>
                    </tr>
                  )}
                </tbody>
              </table>
              <hr />
              <p style={{display:'flex',justifyContent:'space-between'}}>
                <strong>Subtotal:</strong>
                <span>{details?.data?.summary?.subtotal?.toFixed(2)  || '10,300.00'} ฿</span>
              </p>
              <p style={{display:'flex',justifyContent:'space-between'}}>
                <strong>Tax:</strong>
                <span>{details?.data?.summary?.vat?.toFixed(2) || '620.00'} ฿</span>
              </p>
              <h2 style={{display:'flex',justifyContent:'space-between'}}>
                <strong>Total:</strong>
                <span>{details?.data?.summary?.grand_total?.toFixed(2) || '10,920.00'} ฿</span>
              </h2>
            </div>

            <button
              onClick={handlePrint}
              className="print-button"
              style={{
                display: "block",
                margin: "20px auto",
                padding: "10px 20px",
                backgroundColor: "black",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Print Invoice
            </button>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default Invoice;