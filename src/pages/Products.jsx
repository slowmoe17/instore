import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Typography,
  IconButton,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Card,
  CardContent,
  Grid,
  Divider,
  Avatar,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  GetApp as ExportIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Person as PersonIcon,
  Campaign as CampaignIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/products/getProducts');
      setProducts(response.data.products || []);
    } catch (error) {
      toast.error('حدث خطأ في جلب المنتجات');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/products/deleteProduct/${selectedProduct._id}`);
      toast.success('تم حذف المنتج بنجاح');
      setDeleteDialogOpen(false);
      setSelectedProduct(null);
      fetchProducts();
    } catch (error) {
      toast.error('حدث خطأ في حذف المنتج');
    }
  };

  const handleExport = async () => {
    try {
      // Prepare data for Excel export with all fields including adSpendingHistory and addedBy
      const exportData = products.map(product => {
        // Calculate total ad spending
        const totalAdSpending = getTotalAdSpending(product.adSpendingHistory);
        
        // Format ad spending history as readable text
        const adSpendingText = product.adSpendingHistory && product.adSpendingHistory.length > 0
          ? product.adSpendingHistory.map(ad => 
              `${ad.platform}: ${formatCurrency(ad.price)} (${formatDate(ad.date)})${ad.notes && ad.notes !== 'لا يوجد' ? ` - ${ad.notes}` : ''}`
            ).join('; ')
          : 'لا يوجد';

        // Format addedBy information
        const addedByInfo = product.addedBy 
          ? `${product.addedBy.name} (${product.addedBy.email}) - ${product.addedBy.phone}`
          : 'غير محدد';

        return {
          'اسم المنتج': product.name,
          'اسم المتجر': product.storename,
          'رابط المنتج': product.productLink,
          'رابط العمولة': product.affiliateLink,
          'الوصف': product.description,
          'السعر': product.price,
          'الكمية': product.quantity,
          'الكمية المباعة': product.quantitySold || 0,
          'العمولة (%)': product.commission,
          'إجمالي إنفاق الإعلانات': totalAdSpending,
          'تاريخ إنفاق الإعلانات': adSpendingText,
          'أضيف بواسطة': addedByInfo,
          'الحالة': product.isFreezed ? 'مجمدة' : 'نشطة',
          'تاريخ الإنشاء': formatDate(product.createdAt),
          'تاريخ التحديث': formatDate(product.updatedAt),
        };
      });

      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(exportData);

      // Set column widths for better readability
      const columnWidths = [
        { wch: 20 }, // اسم المنتج
        { wch: 15 }, // اسم المتجر
        { wch: 30 }, // رابط المنتج
        { wch: 30 }, // رابط العمولة
        { wch: 40 }, // الوصف
        { wch: 12 }, // السعر
        { wch: 10 }, // الكمية
        { wch: 15 }, // الكمية المباعة
        { wch: 12 }, // العمولة
        { wch: 20 }, // إجمالي إنفاق الإعلانات
        { wch: 50 }, // تاريخ إنفاق الإعلانات
        { wch: 35 }, // أضيف بواسطة
        { wch: 10 }, // الحالة
        { wch: 15 }, // تاريخ الإنشاء
        { wch: 15 }, // تاريخ التحديث
      ];
      worksheet['!cols'] = columnWidths;

      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'المنتجات');

      // Generate Excel file
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      // Create download link
      const url = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `products_export_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('تم تصدير المنتجات بنجاح مع جميع البيانات');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('حدث خطأ في تصدير المنتجات');
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.storename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'غير محدد';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ar-EG');
    } catch {
      return dateString;
    }
  };

  const getTotalAdSpending = (adSpendingHistory) => {
    if (!adSpendingHistory || !Array.isArray(adSpendingHistory)) return 0;
    return adSpendingHistory.reduce((sum, ad) => sum + (parseFloat(ad.price) || 0), 0);
  };

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="400px"
        sx={{ p: 4 }}
      >
        <CircularProgress size={60} sx={{ color: '#667eea' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      {/* Header Section */}
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
          المنتجات
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: 'text.secondary',
            maxWidth: 600,
            mx: 'auto',
          }}
        >
          إدارة المنتجات والعمولات في النظام
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
            }}
          >
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                {products.length}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                إجمالي المنتجات
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)',
              color: 'white',
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(46, 125, 50, 0.3)',
            }}
          >
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                {products.filter(p => !p.isFreezed).length}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                المنتجات النشطة
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              background: 'linear-gradient(135deg, #ed6c02 0%, #ff9800 100%)',
              color: 'white',
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(237, 108, 2, 0.3)',
            }}
          >
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                {products.reduce((sum, p) => sum + (parseInt(p.quantitySold) || 0), 0)}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                إجمالي المبيعات
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              background: 'linear-gradient(135deg, #d32f2f 0%, #f44336 100%)',
              color: 'white',
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(211, 47, 47, 0.3)',
            }}
          >
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                {formatCurrency(products.reduce((sum, p) => sum + getTotalAdSpending(p.adSpendingHistory), 0))}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                إجمالي إنفاق الإعلانات
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Actions */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="البحث في المنتجات"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: '#667eea',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#667eea',
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              {user?.role === 'superadmin' && (
                <Button
                  variant="outlined"
                  startIcon={<ExportIcon />}
                  onClick={handleExport}
                  sx={{
                    borderRadius: 2,
                    borderColor: '#667eea',
                    color: '#667eea',
                    '&:hover': {
                      borderColor: '#5a6fd8',
                      backgroundColor: 'rgba(102, 126, 234, 0.04)',
                    },
                  }}
                >
                  تصدير إلى EXCEL
                </Button>
              )}
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/products/add')}
                sx={{
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                    boxShadow: '0 12px 40px rgba(102, 126, 234, 0.6)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                إضافة منتج
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Products Table */}
      <Paper 
        sx={{ 
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          border: '1px solid rgba(102, 126, 234, 0.1)',
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
                <TableCell 
                  align="center" 
                  sx={{ 
                    fontWeight: 'bold',
                    color: '#1e293b',
                    borderBottom: '2px solid #667eea',
                  }}
                >
                  اسم المنتج
                </TableCell>
                <TableCell 
                  align="center" 
                  sx={{ 
                    fontWeight: 'bold',
                    color: '#1e293b',
                    borderBottom: '2px solid #667eea',
                  }}
                >
                  اسم المتجر
                </TableCell>
                <TableCell 
                  align="center" 
                  sx={{ 
                    fontWeight: 'bold',
                    color: '#1e293b',
                    borderBottom: '2px solid #667eea',
                  }}
                >
                  السعر
                </TableCell>
                <TableCell 
                  align="center" 
                  sx={{ 
                    fontWeight: 'bold',
                    color: '#1e293b',
                    borderBottom: '2px solid #667eea',
                  }}
                >
                  الكمية
                </TableCell>
                <TableCell 
                  align="center" 
                  sx={{ 
                    fontWeight: 'bold',
                    color: '#1e293b',
                    borderBottom: '2px solid #667eea',
                  }}
                >
                  الكمية المباعة
                </TableCell>
                <TableCell 
                  align="center" 
                  sx={{ 
                    fontWeight: 'bold',
                    color: '#1e293b',
                    borderBottom: '2px solid #667eea',
                  }}
                >
                  العمولة
                </TableCell>
                <TableCell 
                  align="center" 
                  sx={{ 
                    fontWeight: 'bold',
                    color: '#1e293b',
                    borderBottom: '2px solid #667eea',
                  }}
                >
                  إنفاق الإعلانات
                </TableCell>
                <TableCell 
                  align="center" 
                  sx={{ 
                    fontWeight: 'bold',
                    color: '#1e293b',
                    borderBottom: '2px solid #667eea',
                  }}
                >
                  أضيف بواسطة
                </TableCell>
                <TableCell 
                  align="center" 
                  sx={{ 
                    fontWeight: 'bold',
                    color: '#1e293b',
                    borderBottom: '2px solid #667eea',
                  }}
                >
                  تاريخ الإنشاء
                </TableCell>
                <TableCell 
                  align="center" 
                  sx={{ 
                    fontWeight: 'bold',
                    color: '#1e293b',
                    borderBottom: '2px solid #667eea',
                  }}
                >
                  الحالة
                </TableCell>
                <TableCell 
                  align="center" 
                  sx={{ 
                    fontWeight: 'bold',
                    color: '#1e293b',
                    borderBottom: '2px solid #667eea',
                  }}
                >
                  الإجراءات
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.map((product, index) => (
                <TableRow 
                  key={product._id}
                  sx={{ 
                    '&:nth-of-type(odd)': { 
                      backgroundColor: 'rgba(102, 126, 234, 0.02)' 
                    },
                    '&:hover': { 
                      backgroundColor: 'rgba(102, 126, 234, 0.05)' 
                    },
                    transition: 'background-color 0.3s ease',
                  }}
                >
                  <TableCell align="center" sx={{ fontWeight: 'medium' }}>
                    {product.name}
                  </TableCell>
                  <TableCell align="center">{product.storename}</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                    {formatCurrency(product.price)}
                  </TableCell>
                  <TableCell align="center">{product.quantity}</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                    {product.quantitySold || 0}
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={`${product.commission}%`}
                      color="primary"
                      size="small"
                      sx={{ 
                        fontWeight: 'bold',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      }}
                    />
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold', color: '#d32f2f' }}>
                    {formatCurrency(getTotalAdSpending(product.adSpendingHistory))}
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                        {product.addedBy?.name?.charAt(0)?.toUpperCase() || '?'}
                      </Avatar>
                      <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                        {product.addedBy?.name || 'غير محدد'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                      {formatDate(product.createdAt)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={product.isFreezed ? 'مجمدة' : 'نشطة'}
                      color={product.isFreezed ? 'error' : 'success'}
                      size="small"
                      sx={{ fontWeight: 'bold' }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedProduct(product);
                          setViewDialogOpen(true);
                        }}
                        sx={{
                          color: '#1976d2',
                          '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.1)' },
                        }}
                      >
                        <ViewIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/products/edit/${product._id}`)}
                        sx={{
                          color: '#ed6c02',
                          '&:hover': { backgroundColor: 'rgba(237, 108, 2, 0.1)' },
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      {user?.role === 'superadmin' && (
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => {
                            setSelectedProduct(product);
                            setDeleteDialogOpen(true);
                          }}
                          sx={{
                            '&:hover': { backgroundColor: 'rgba(211, 47, 47, 0.1)' },
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* View Product Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
          }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontWeight: 'bold',
        }}>
          تفاصيل المنتج
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {selectedProduct && (
            <Box>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#1e293b' }}>
                {selectedProduct.name}
              </Typography>
              
              {/* Basic Product Info */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Typography><strong>اسم المتجر:</strong> {selectedProduct.storename}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography><strong>السعر:</strong> {formatCurrency(selectedProduct.price)}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography><strong>الكمية:</strong> {selectedProduct.quantity}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography><strong>الكمية المباعة:</strong> {selectedProduct.quantitySold || 0}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography><strong>العمولة:</strong> {selectedProduct.commission}%</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography><strong>إجمالي إنفاق الإعلانات:</strong> {formatCurrency(getTotalAdSpending(selectedProduct.adSpendingHistory))}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography><strong>الوصف:</strong> {selectedProduct.description}</Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              {/* Added By Info */}
              {selectedProduct.addedBy && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1e293b', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon sx={{ color: '#667eea' }} />
                    أضيف بواسطة
                  </Typography>
                  <Card sx={{ 
                    p: 2, 
                    border: '1px solid rgba(102, 126, 234, 0.2)',
                    borderRadius: 2,
                    background: 'rgba(102, 126, 234, 0.02)',
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ width: 48, height: 48 }}>
                        {selectedProduct.addedBy.name?.charAt(0)?.toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          {selectedProduct.addedBy.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {selectedProduct.addedBy.email}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {selectedProduct.addedBy.phone}
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                </Box>
              )}

              {/* Ad Spending History */}
              {selectedProduct.adSpendingHistory && selectedProduct.adSpendingHistory.length > 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1e293b', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CampaignIcon sx={{ color: '#667eea' }} />
                    تاريخ إنفاق الإعلانات
                  </Typography>
                  <Grid container spacing={2}>
                    {selectedProduct.adSpendingHistory.map((ad, index) => (
                      <Grid item xs={12} sm={6} key={index}>
                        <Card sx={{ 
                          p: 2, 
                          border: '1px solid rgba(102, 126, 234, 0.2)',
                          borderRadius: 2,
                          background: 'rgba(102, 126, 234, 0.02)',
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <MoneyIcon sx={{ color: '#2e7d32', fontSize: 20 }} />
                            <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                              {formatCurrency(ad.price)}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <CampaignIcon sx={{ color: '#667eea', fontSize: 16 }} />
                            <Typography variant="body2">
                              <strong>المنصة:</strong> {ad.platform}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <CalendarIcon sx={{ color: '#ed6c02', fontSize: 16 }} />
                            <Typography variant="body2">
                              <strong>التاريخ:</strong> {formatDate(ad.date)}
                            </Typography>
                          </Box>
                          {ad.notes && ad.notes !== 'لا يوجد' && (
                            <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                              <strong>ملاحظات:</strong> {ad.notes}
                            </Typography>
                          )}
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setViewDialogOpen(false)}
            sx={{ 
              borderRadius: 2,
              px: 3,
            }}
          >
            إغلاق
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={deleteDialogOpen} 
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
          }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #d32f2f 0%, #f44336 100%)',
          color: 'white',
          fontWeight: 'bold',
        }}>
          تأكيد الحذف
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography>
            هل أنت متأكد من حذف المنتج "{selectedProduct?.name}"؟
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ 
              borderRadius: 2,
              px: 3,
            }}
          >
            إلغاء
          </Button>
          <Button 
            onClick={handleDelete} 
            color="error" 
            variant="contained"
            sx={{ 
              borderRadius: 2,
              px: 3,
              background: 'linear-gradient(135deg, #d32f2f 0%, #f44336 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #b71c1c 0%, #d32f2f 100%)',
              },
            }}
          >
            حذف
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 