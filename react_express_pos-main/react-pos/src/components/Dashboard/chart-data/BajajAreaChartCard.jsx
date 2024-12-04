import React, { useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Chart from 'react-apexcharts';
import { useState,useEffect } from 'react';

const BajajAreaChartCard = () => {

  const [top_sales, setTop_Sales] = useState([]);
  const theme = useTheme();
  const orangeDark = theme.palette.secondary[800];

  console.log(top_sales,'top_sales22');


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/sales/top_sales");
        const data = await response.json();
        
        if (data?.result) {
          const topRank1 = data.result.filter(item => item.rank === 1); // กรองเฉพาะสินค้าที่ rank = 1
          setTop_Sales(topRank1);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, []);


  const chartData = useMemo(() => {
    return {
      type: 'area',
      height: 95,
      options: {
        chart: {
          id: 'support-chart',
          sparkline: {
            enabled: true
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth',
          width: 1
        },
        tooltip: {
          theme: 'light',
          fixed: {
            enabled: false
          },
          x: {
            show: false
          },
          y: {
            title: 'Price'
          },
          marker: {
            show: false
          }
        },
        colors: [orangeDark]
      },
      series: [
        {
          data: [0, 15, 10, 50, 30, 40, 25]
        }
      ]
    };
  }, [orangeDark]);

  return (
    <Card sx={{ bgcolor: 'secondary.light' }}>
      <Grid container sx={{ p: 2, pb: 0, color: '#fff' }}>
        {top_sales && top_sales.map((item)=>{
          return(
            <>
              <Grid item xs={12} key={item.product_id}>
              <Grid container alignItems="center" justifyContent="space-between">
                <Grid item>
                        <Typography variant="subtitle1" sx={{ color: 'secondary.dark' }} key={item.product_id}>
                          {item.name}
                        </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="h4" sx={{ color: 'grey.800' }}>
                    {item.price} ฿
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ color: 'grey.800' }}>
                อันดับที่ {item.rank}
              </Typography>
            </Grid>
            </>
          )
        })}
      </Grid>
      <Chart 
        type={chartData.type}
        height={chartData.height}
        options={chartData.options}
        series={chartData.series}
      />
    </Card>
  );
};

export default BajajAreaChartCard;