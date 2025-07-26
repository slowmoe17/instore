import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  CircularProgress,
  LinearProgress,
} from '@mui/material';
import {
  Inventory as ProductsIcon,
  TrendingUp as SalesIcon,
  AttachMoney as RevenueIcon,
  Campaign as AdsIcon,
  TrendingDown as TrendingDownIcon,
  TrendingUp as TrendingUpIcon,
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

  const StatCard = ({ title, value, icon, color, gradient, trend, subtitle }) => (
    <Card 
      sx={{ 
        height: '100%',
        background: gradient || `linear-gradient(135deg, ${color}15 0%, ${color}25 100%)`,
        border: `1px solid ${color}30`,
        borderRadius: 3,
        boxShadow: `0 8px 32px ${color}20`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: `0 16px 48px ${color}30`,
        },
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: gradient || `linear-gradient(90deg, ${color}, ${color}80)`,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography 
              color="textSecondary" 
              gutterBottom 
              variant="h6"
              sx={{ 
                fontWeight: 'medium',
                color: `${color}dd`,
                fontSize: '0.9rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              {title}
            </Typography>
            <Typography 
              variant="h3" 
              component="div" 
              sx={{ 
                fontWeight: 'bold',
                color: color,
                mb: 1,
              }}
            >
              {loading ? (
                <CircularProgress size={32} sx={{ color: color }} />
              ) : (
                value
              )}
            </Typography>
            {subtitle && (
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'text.secondary',
                  fontSize: '0.875rem',
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              backgroundColor: color,
              borderRadius: '50%',
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 8px 24px ${color}40`,
              width: 60,
              height: 60,
            }}
          >
            {icon}
          </Box>
        </Box>
        
        {trend && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {trend > 0 ? (
              <TrendingUpIcon sx={{ color: '#2e7d32', fontSize: 20 }} />
            ) : (
              <TrendingDownIcon sx={{ color: '#d32f2f', fontSize: 20 }} />
            )}
            <Typography 
              variant="body2" 
              sx={{ 
                color: trend > 0 ? '#2e7d32' : '#d32f2f',
                fontWeight: 'medium',
                fontSize: '0.875rem',
              }}
            >
              {trend > 0 ? '+' : ''}{trend}% من الشهر الماضي
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1,
          }}
        >
          لوحة التحكم
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: 'text.secondary',
            maxWidth: 600,
            mx: 'auto',
          }}
        >
          نظرة عامة على أداء النظام وإحصائيات المنتجات والعمولات
        </Typography>
      </Box>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="إجمالي المنتجات"
            value={stats.totalProducts}
            icon={<ProductsIcon sx={{ color: 'white', fontSize: 28 }} />}
            color="#1976d2"
            gradient="linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)"
            trend={12}
            subtitle="منتج نشط في النظام"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="إجمالي المبيعات"
            value={stats.totalSales}
            icon={<SalesIcon sx={{ color: 'white', fontSize: 28 }} />}
            color="#2e7d32"
            gradient="linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)"
            trend={8}
            subtitle="وحدة مباعة"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="إجمالي الإيرادات"
            value={`$${stats.totalRevenue.toLocaleString()}`}
            icon={<RevenueIcon sx={{ color: 'white', fontSize: 28 }} />}
            color="#ed6c02"
            gradient="linear-gradient(135deg, #ed6c02 0%, #ff9800 100%)"
            trend={15}
            subtitle="دولار أمريكي"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="إنفاق الإعلانات"
            value={`$${stats.totalAdSpending.toLocaleString()}`}
            icon={<AdsIcon sx={{ color: 'white', fontSize: 28 }} />}
            color="#d32f2f"
            gradient="linear-gradient(135deg, #d32f2f 0%, #f44336 100%)"
            trend={-5}
            subtitle="دولار أمريكي"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper 
            sx={{ 
              p: 4, 
              borderRadius: 3,
              background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
              border: '1px solid rgba(102, 126, 234, 0.1)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            }}
          >
            <Typography 
              variant="h5" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold',
                mb: 3,
                color: '#1e293b',
              }}
            >
              ملخص الأداء
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                  معدل النمو الشهري
                </Typography>
                <Typography variant="body2" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
                  12.5%
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={75} 
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  backgroundColor: 'rgba(46, 125, 50, 0.2)',
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(90deg, #2e7d32, #4caf50)',
                    borderRadius: 4,
                  },
                }} 
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                  معدل التحويل
                </Typography>
                <Typography variant="body2" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                  8.3%
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={65} 
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  backgroundColor: 'rgba(25, 118, 210, 0.2)',
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(90deg, #1976d2, #42a5f5)',
                    borderRadius: 4,
                  },
                }} 
              />
            </Box>

            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                  رضا العملاء
                </Typography>
                <Typography variant="body2" sx={{ color: '#ed6c02', fontWeight: 'bold' }}>
                  94.2%
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={94} 
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  backgroundColor: 'rgba(237, 108, 2, 0.2)',
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(90deg, #ed6c02, #ff9800)',
                    borderRadius: 4,
                  },
                }} 
              />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper 
            sx={{ 
              p: 4, 
              borderRadius: 3,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Typography 
              variant="h5" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold',
                mb: 3,
                textAlign: 'center',
              }}
            >
              نظام إدارة المنتجات
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                textAlign: 'center',
                lineHeight: 1.6,
                opacity: 0.9,
              }}
            >
              مرحباً بك في نظام إدارة المنتجات والعمولات المتطور. 
              يمكنك من خلال هذا النظام إدارة المنتجات، تتبع المبيعات، 
              مراقبة إنفاق الإعلانات، وإدارة المستخدمين بكل سهولة وأمان.
            </Typography>
            
            <Box 
              sx={{ 
                mt: 3,
                p: 2,
                borderRadius: 2,
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                textAlign: 'center',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                {stats.totalProducts}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                منتج نشط في النظام
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
} 