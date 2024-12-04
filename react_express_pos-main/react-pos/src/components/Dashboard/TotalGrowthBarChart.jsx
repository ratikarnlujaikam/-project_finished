import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { Grid, Box } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Chart from 'react-apexcharts';
import SkeletonTotalGrowthBarChart from '../../ui-component/TotalGrowthBarChart';
import MainCard from '../../ui-component/MainCard';
import { gridSpacing } from '../../stores/constant';
import PopularCard from './PopularCard';

const status = [
  {
    value: 'today',
    label: 'Today'
  },
  {
    value: 'month',
    label: 'This Month'
  },
  {
    value: 'year',
    label: 'This Year'
  }
];

const TotalGrowthBarChart = () => {
  const [value, setValue] = useState('today');
  const [salesData, setSalesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);
  const theme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/sales");
        const data = await response.json();
        
        if (data?.result) {
          setSalesData(data.result);
          const total = data.result.reduce((sum, item) => 
            sum + Number(item.total_amount || 0), 0
          );
          setTotalAmount(total);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartColors = {
    primary: theme.palette.text.primary || '#000000',
    divider: theme.palette.divider || '#E5E7EB',
    grey500: theme.palette.grey[500] || '#6B7280',
    primary200: theme.palette.primary[200] || '#93C5FD',
    primaryDark: theme.palette.primary.dark || '#1E40AF',
    secondaryMain: theme.palette.secondary.main || '#7C3AED',
    secondaryLight: theme.palette.secondary.light || '#A78BFA'
  };

  const processChartData = () => {
    // Initialize monthly data structure
    const monthlyData = Array(12).fill().map(() => ({
      sales: 0,
      orders: new Set()
    }));
    
    salesData.forEach(sale => {
      const date = new Date(sale.sale_date);
      const month = date.getMonth(); // 0-11
      
      monthlyData[month].sales += Number(sale.total_amount);
      monthlyData[month].orders.add(sale.sale_id);
    });

    // Prepare series data
    const salesValues = monthlyData.map(data => Math.round(data.sales * 100) / 100);
    const orderCounts = monthlyData.map(data => data.orders.size);

    return {
      series: [
        {
          name: 'ยอดขาย (บาท)',
          data: salesValues
        },
        {
          name: 'จำนวนออเดอร์',
          data: orderCounts
        }
      ]
    };
  };

  const chartData = processChartData();

  const monthNames = [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
    'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
  ];

  const chartOptions = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: true
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 10,
        columnWidth: '60%',
      },
    },
    xaxis: {
      categories: monthNames,
      labels: {
        style: {
          colors: Array(12).fill(chartColors.primary)
        }
      }
    },
    dataLabels: {
      enabled: false  // เพิ่มบรรทัดนี้เพื่อซ่อนตัวเลขบนแท่ง
    },
    yaxis: [
      {
        title: {
          text: 'ยอดขาย (บาท)'
        },
        labels: {
          style: {
            colors: chartColors.primary
          },
          formatter: (value) => value.toLocaleString('th-TH')
        }
      },
      {
        opposite: true,
        title: {
          text: 'จำนวนออเดอร์'
        },
        labels: {
          style: {
            colors: chartColors.primaryDark
          }
        }
      }
    ],
    legend: {
      position: 'bottom',
      labels: {
        colors: chartColors.grey500
      }
    },
    fill: {
      opacity: 1
    },
    colors: [chartColors.primary200, chartColors.primaryDark],
    grid: {
      borderColor: chartColors.divider
    },
    tooltip: {
      theme: 'light',
      y: {
        formatter: (value, { seriesIndex }) => {
          if (seriesIndex === 0) {
            return `${value.toLocaleString('th-TH')} บาท`;
          }
          return `${value} ออเดอร์`;
        }
      }
    }
  };

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: "#eef2f6", p: 3, height: '100vh' }}>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12} md={8}>
          {isLoading ? (
            <SkeletonTotalGrowthBarChart />
          ) : (
            <MainCard sx={{ height: '100%' }}>
              <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                  <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                      <Grid container direction="column" spacing={1}>
                        <Grid item>
                          <Typography variant="subtitle2">ยอดขายรวม</Typography>
                        </Grid>
                        <Grid item>
                          <Typography variant="h3">
                            {totalAmount.toLocaleString('th-TH', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            })} ฿
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item>
                      <TextField
                        select
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        variant="standard"
                      >
                        {status.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Chart
                    type="bar"
                    height={350}
                    options={chartOptions}
                    series={chartData.series}
                  />
                </Grid>
              </Grid>
            </MainCard>
          )}
        </Grid>
        <Grid item xs={12} md={4}>
          <PopularCard />
        </Grid>
      </Grid>
    </Box>
  );
};

TotalGrowthBarChart.propTypes = {
  isLoading: PropTypes.bool
};

export default TotalGrowthBarChart;




