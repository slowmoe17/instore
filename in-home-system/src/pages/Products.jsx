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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  GetApp as ExportIcon,
} from '@mui/icons-material';
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
      const response = await axios.get('/products/exportProductsToExcel', {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'products.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('تم تصدير المنتجات بنجاح');
    } catch (error) {
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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

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
      <Typography variant="h4" sx={{ mb: 3, textAlign: 'center', width: '100%' }}>
        المنتجات
      </Typography>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          width: '100%',
          mb: 2,
          gap: 2,
        }}
      >
        {user?.role === 'superadmin' && (
          <Button
            variant="outlined"
            startIcon={<ExportIcon />}
            onClick={handleExport}
          >
            تصدير إلى EXCEL
          </Button>
        )}
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/products/add')}
        >
          إضافة منتج
        </Button>
      </Box>

      <TextField
        fullWidth
        label="البحث في المنتجات"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3, maxWidth: 600, textAlign: 'center', alignSelf: 'center' }}
        dir="rtl"
      />

      <TableContainer component={Paper} sx={{ width: '100%', maxWidth: 1000, margin: '0 auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">اسم المنتج</TableCell>
              <TableCell align="center">اسم المتجر</TableCell>
              <TableCell align="center">السعر</TableCell>
              <TableCell align="center">الكمية</TableCell>
              <TableCell align="center">الكمية المباعة</TableCell>
              <TableCell align="center">العمولة</TableCell>
              <TableCell align="center">الحالة</TableCell>
              <TableCell align="center">الإجراءات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product._id}>
                <TableCell align="center">{product.name}</TableCell>
                <TableCell align="center">{product.storename}</TableCell>
                <TableCell align="center">{formatCurrency(product.price)}</TableCell>
                <TableCell align="center">{product.quantity}</TableCell>
                <TableCell align="center">{product.quantitySold || 0}</TableCell>
                <TableCell align="center">{product.commission}%</TableCell>
                <TableCell align="center">
                  <Chip
                    label={product.isFreezed ? 'مجمدة' : 'نشطة'}
                    color={product.isFreezed ? 'error' : 'success'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    size="small"
                    onClick={() => {
                      setSelectedProduct(product);
                      setViewDialogOpen(true);
                    }}
                  >
                    <ViewIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => navigate(`/products/edit/${product._id}`)}
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
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* View Product Dialog and Delete Dialog remain unchanged */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>تفاصيل المنتج</DialogTitle>
        <DialogContent>
          {selectedProduct && (
            <Box>
              <Typography variant="h6" gutterBottom>{selectedProduct.name}</Typography>
              <Typography><strong>اسم المتجر:</strong> {selectedProduct.storename}</Typography>
              <Typography><strong>السعر:</strong> {formatCurrency(selectedProduct.price)}</Typography>
              <Typography><strong>الكمية:</strong> {selectedProduct.quantity}</Typography>
              <Typography><strong>الكمية المباعة:</strong> {selectedProduct.quantitySold || 0}</Typography>
              <Typography><strong>العمولة:</strong> {selectedProduct.commission}%</Typography>
              <Typography><strong>الوصف:</strong> {selectedProduct.description}</Typography>
              
              {selectedProduct.adSpendingHistory && selectedProduct.adSpendingHistory.length > 0 && (
                <Box mt={2}>
                  <Typography variant="h6" gutterBottom>تاريخ إنفاق الإعلانات</Typography>
                  {selectedProduct.adSpendingHistory.map((ad, index) => (
                    <Box key={index} p={1} border={1} borderColor="grey.300" borderRadius={1} mb={1}>
                      <Typography><strong>المنصة:</strong> {ad.platform}</Typography>
                      <Typography><strong>السعر:</strong> {formatCurrency(ad.price)}</Typography>
                      {ad.notes && <Typography><strong>ملاحظات:</strong> {ad.notes}</Typography>}
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>إغلاق</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>تأكيد الحذف</DialogTitle>
        <DialogContent>
          <Typography>
            هل أنت متأكد من حذف المنتج "{selectedProduct?.name}"؟
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>إلغاء</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            حذف
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 