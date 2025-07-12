import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
  IconButton,
  Card,
  CardContent,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function AddProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    storename: '',
    productLink: '',
    affiliateLink: '',
    description: '',
    price: '',
    quantity: '',
    commission: '',
    quantitySold: '',
  });
  const [adSpendingHistory, setAdSpendingHistory] = useState([]);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name || formData.name.length < 3) {
      newErrors.name = 'اسم المنتج يجب أن يكون 3 أحرف على الأقل';
    }

    if (!formData.storename || formData.storename.length < 3) {
      newErrors.storename = 'اسم المتجر يجب أن يكون 3 أحرف على الأقل';
    }

    if (!formData.productLink) {
      newErrors.productLink = 'رابط المنتج مطلوب';
    } else if (!isValidUrl(formData.productLink)) {
      newErrors.productLink = 'رابط المنتج غير صحيح';
    }

    if (!formData.affiliateLink) {
      newErrors.affiliateLink = 'رابط العمولة مطلوب';
    } else if (!isValidUrl(formData.affiliateLink)) {
      newErrors.affiliateLink = 'رابط العمولة غير صحيح';
    }

    if (!formData.description || formData.description.length < 3) {
      newErrors.description = 'الوصف يجب أن يكون 3 أحرف على الأقل';
    }

    if (!formData.price || parseFloat(formData.price) < 0) {
      newErrors.price = 'السعر يجب أن يكون رقم موجب';
    }

    if (!formData.quantity || parseInt(formData.quantity) < 0) {
      newErrors.quantity = 'الكمية يجب أن تكون رقم موجب';
    }

    if (!formData.commission || parseFloat(formData.commission) < 0) {
      newErrors.commission = 'العمولة يجب أن تكون رقم موجب';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        commission: parseFloat(formData.commission),
        quantitySold: formData.quantitySold ? parseInt(formData.quantitySold) : 0,
        adSpendingHistory: adSpendingHistory.map(ad => ({
          ...ad,
          price: parseFloat(ad.price),
        })),
      };

      await axios.post('/products/addProduct', productData);
      toast.success('تم إضافة المنتج بنجاح');
      navigate('/products');
    } catch (error) {
      const message = error.response?.data?.message || 'حدث خطأ في إضافة المنتج';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const addAdSpending = () => {
    setAdSpendingHistory(prev => [...prev, {
      platform: '',
      price: '',
      notes: '',
    }]);
  };

  const removeAdSpending = (index) => {
    setAdSpendingHistory(prev => prev.filter((_, i) => i !== index));
  };

  const updateAdSpending = (index, field, value) => {
    setAdSpendingHistory(prev => prev.map((ad, i) => 
      i === index ? { ...ad, [field]: value } : ad
    ));
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        إضافة منتج جديد
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="اسم المنتج"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                required
                dir="rtl"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="اسم المتجر"
                name="storename"
                value={formData.storename}
                onChange={handleChange}
                error={!!errors.storename}
                helperText={errors.storename}
                required
                dir="rtl"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="رابط المنتج"
                name="productLink"
                value={formData.productLink}
                onChange={handleChange}
                error={!!errors.productLink}
                helperText={errors.productLink}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="رابط العمولة"
                name="affiliateLink"
                value={formData.affiliateLink}
                onChange={handleChange}
                error={!!errors.affiliateLink}
                helperText={errors.affiliateLink}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="وصف المنتج"
                name="description"
                value={formData.description}
                onChange={handleChange}
                error={!!errors.description}
                helperText={errors.description}
                multiline
                rows={4}
                required
                dir="rtl"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="السعر"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                error={!!errors.price}
                helperText={errors.price}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="الكمية"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleChange}
                error={!!errors.quantity}
                helperText={errors.quantity}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="العمولة (%)"
                name="commission"
                type="number"
                value={formData.commission}
                onChange={handleChange}
                error={!!errors.commission}
                helperText={errors.commission}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="الكمية المباعة (اختياري)"
                name="quantitySold"
                type="number"
                value={formData.quantitySold}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">تاريخ إنفاق الإعلانات (اختياري)</Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={addAdSpending}
            >
              إضافة إعلان
            </Button>
          </Box>

          {adSpendingHistory.map((ad, index) => (
            <Card key={index} sx={{ mb: 2 }}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="المنصة"
                      value={ad.platform}
                      onChange={(e) => updateAdSpending(index, 'platform', e.target.value)}
                      dir="rtl"
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="السعر"
                      type="number"
                      value={ad.price}
                      onChange={(e) => updateAdSpending(index, 'price', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={5}>
                    <TextField
                      fullWidth
                      label="ملاحظات"
                      value={ad.notes}
                      onChange={(e) => updateAdSpending(index, 'notes', e.target.value)}
                      dir="rtl"
                    />
                  </Grid>
                  <Grid item xs={12} md={1}>
                    <IconButton
                      color="error"
                      onClick={() => removeAdSpending(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}

          <Box display="flex" gap={2} mt={3}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              size="large"
            >
              {loading ? 'جاري الإضافة...' : 'إضافة المنتج'}
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/products')}
              size="large"
            >
              إلغاء
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
} 