import React from 'react'

import {useMemo, useState, useEffect } from 'react'

import {
  Box,
  Stack,
  Grid,
  Button,
  Typography,
  MenuItem,
} from "@mui/material";

import Invoice from '../Invoice';

import { MaterialReactTable, useMaterialReactTable,} from "material-react-table";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { mkConfig, generateCsv, download } from "export-to-csv";

const csvConfig = mkConfig({
    fieldSeparator: ",",
    decimalSeparator: ".",
    useKeysAsHeaders: true,
  });

export const OrderAll = () => {
    const [s_id , setS_id] = useState(null)
    const [open, setOpen] = useState(false);

    const handleClose = () => setOpen(false);

    const [data,setData] = useState([])
    
    const handleViewDetail = (id) => {
      setS_id(id)
      setOpen(true);
    }

    const fetchProduct = (()=> {
        const requestOptions = {
          method: "GET",
          redirect: "follow"
        };
        
        fetch("http://localhost:8000/order", requestOptions)
          .then((response) => response.json())
          .then((result) => {
            console.log(result,'result')
               // ตรวจสอบโครงสร้างข้อมูลและแปลงให้เป็น array ถ้าจำเป็น
          const ordersArray = Array.isArray(result) ? result : 
          result.result ? Array.isArray(result.result) ? result.result : [] :
          [];
    
          console.log('Processed Products:', ordersArray); // ดูข้อมูลหลังแปลง
          setData(ordersArray);
          })
          .catch((error) => console.error(error));
      })

    // const handleDelete = ((product_id)=> {
    //     const requestOptions = {
    //         method: "DELETE",
    //         redirect: "follow"
    //       };
          
    //       fetch(`http://localhost:8000/products/delete/`+ product_id, requestOptions)
    //         .then((response) => response.json())
    //         .then((result) => {
    //             if(result.status =='success') {
    //                 alert('Deleted successfully')
    //                 fetchProduct();
    //             }
    //         })
    //         .catch((error) => console.error(error));
    // }) 

    const columns = useMemo(
        () => [
          {
            accessorKey: "sale_id",
            header: "ID",
            size: 100,
            Cell: ({ cell }) =>  '0000' + cell.getValue() ,
          },
          {
            accessorKey: "sale_date",
            header: "Date",
            size: 100,
            Cell: ({ cell }) => {
              const date = new Date(cell.getValue());
              return date.toLocaleDateString("en-CA").replaceAll("-", "/");
            },
    
          },
          {
            accessorKey: "total_amount",
            header: "TotalAmount",
            size: 100,
          },
          {
            accessorKey: "name",
            header: "Employee",
            size: 100,
          },
    ])

    const handleExportData = () => {
      const csv = generateCsv(csvConfig)(data);
      download(csvConfig)(csv);
    };


    const table = useMaterialReactTable({
        columns,
        data,
        // enableColumnResizing: false, 
        // enableColumnPinning: false,
        enableColumnActions: false,
        enableRowActions: true,
        initialState: {
          columnPinning: { right: ['mrt-row-actions'] },
        },
        muiTableHeadProps: {
          sx: {
            '& tr': {
              '& th': {
                backgroundColor: '#F6F8F9',
                color: '#000',
                borderBottom: '1px solid #e0e0e0 !important',
                borderRight: '1px solid #e0e0e0 !important',
                '&:last-child': {
                  borderRight: 'none !important',
                },
              },
            },
          },
        },
        muiTableHeadCellProps: {
          sx: {
            textAlign: 'center',
            '.Mui-TableHeadCell-Content': {
              justifyContent: 'center',
            },
          },
        },
        muiTableBodyProps: {
          sx: {
            '& tr': {
              '& td': {
                borderBottom: '1px solid #e0e0e0 !important',
                borderRight: '1px solid #e0e0e0 !important',
                '&:last-child': {
                  borderRight: 'none !important',
                },
              },
              '&:last-child': {
                '& td': {
                  borderBottom: 'none !important',
                },
              },
              "& td:nth-of-type(1)": {
                textAlign: 'center'
              },
              "& td:nth-of-type(2)": {
                textAlign: 'center'
              },
              "& td:nth-of-type(3)": {
                textAlign: 'center'
              },
              "& td:nth-of-type(4)": {
                textAlign: 'center'
              },
              "& td:nth-of-type(5)": {
                textAlign: 'center'
              },
            },
          },
        },
        renderTopToolbarCustomActions: ({ table }) => (
          <Box
            sx={{
              display: "flex",
              gap: "16px",
              padding: "8px",
              flexWrap: "wrap",
            }}
          >
            <Button
              //export Excel
              onClick={handleExportData}
              startIcon={<FileDownloadIcon />}
            >
              Export
            </Button>
          </Box>
        ),
    
        renderRowActionMenuItems: ({ row }) => [
            <MenuItem key="View" onClick={() => handleViewDetail(row.original.sale_id)}>
                Detail
            </MenuItem>
        
         
        ],
        enableFullScreenToggle: false,
      });
    
      useEffect(() => {
        
        fetchProduct();
      }, [])

  return (
    <>
          <Invoice open={open} handleClose={handleClose}  s_id={s_id} />
          <Box sx={{ flexGrow: 1,backgroundColor:'#eee' , height:'100vh'}}>
          <Grid container sx={{ mt: 1 }} justifyContent={'center'}>
            <Grid item xs={12} lg={12} >
              <Box sx={{ height: "610px",p: 3 }}>
                <MaterialReactTable table={table} />
              </Box>
            </Grid> 
          </Grid> 
          </Box> 
    </>
  )
}
