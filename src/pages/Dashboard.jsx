import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  CircularProgress,
} from '@mui/material';
import {
  Inventory as ProductsIcon,
  TrendingUp as SalesIcon,
  AttachMoney as RevenueIcon,
  Campaign as AdsIcon,
} from '@mui/icons-material';
import axios from 'axios';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSales: 0,
    totalRevenue: 0,
    totalAdSpending: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get('/products/getProducts');
      const products = response.data.products || [];
      
      const totalProducts = products.length;
      const totalSales = products.reduce((sum, product) => sum + (parseInt(product.quantitySold) || 0), 0);
      const totalRevenue = products.reduce((sum, product) => {
        const sales = parseInt(product.quantitySold) || 0;
        const price = parseFloat(product.price) || 0;
        const commission = parseFloat(product.commission) || 0;
        return sum + (sales * price * (commission / 100));
      }, 0);
      
      const totalAdSpending = products.reduce((sum, product) => {
        const adHistory = product.adSpendingHistory || [];
        return sum + adHistory.reduce((adSum, ad) => adSum + (parseFloat(ad.price) || 0), 0);
      }, 0);

      setStats({
        totalProducts,
        totalSales,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalAdSpending: Math.round(totalAdSpending * 100) / 100,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="textSecondary" gutterBottom variant="h6">
              {title}
            </Typography>
            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
              {loading ? <CircularProgress size={24} /> : value}
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: color,
              borderRadius: '50%',
              p: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box
      sx={{
        maxWidth: 1000,
        width: '100%',
        margin: '32px auto 0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ mb: 4, textAlign: 'center', width: '100%' }}>
        لوحة التحكم
      </Typography>
      
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="إجمالي المنتجات"
            value={stats.totalProducts}
            icon={<ProductsIcon sx={{ color: 'white' }} />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="إجمالي المبيعات"
            value={stats.totalSales}
            icon={<SalesIcon sx={{ color: 'white' }} />}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="إجمالي الإيرادات"
            value={`$${stats.totalRevenue}`}
            icon={<RevenueIcon sx={{ color: 'white' }} />}
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="إجمالي إنفاق الإعلانات"
            value={`$${stats.totalAdSpending}`}
            icon={<AdsIcon sx={{ color: 'white' }} />}
            color="#d32f2f"
          />
        </Grid>
      </Grid>

      <Paper sx={{ mt: 4, p: 3, width: '100%', textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          ملخص النظام
        </Typography>
        <Typography variant="body1" color="textSecondary">
          مرحباً بك في نظام إدارة المنتجات والعمولات. يمكنك من خلال هذا النظام إدارة المنتجات، 
          تتبع المبيعات، مراقبة إنفاق الإعلانات، وإدارة المستخدمين.
        </Typography>
      </Paper>
    </Box>
  );
} 