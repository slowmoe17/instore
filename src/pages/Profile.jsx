import { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
  Avatar,
  Divider,
  Alert,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name || formData.name.length < 3) {
      newErrors.name = 'الاسم يجب أن يكون 3 أحرف على الأقل';
    }

    if (formData.phone && formData.phone.length !== 11) {
      newErrors.phone = 'رقم الهاتف يجب أن يكون 11 رقم';
    }

    if (formData.address && formData.address.trim().length === 0) {
      newErrors.address = 'العنوان لا يمكن أن يكون فارغاً';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const success = await updateProfile(formData);
      if (success) {
        setEditing(false);
      }
    } catch (error) {
      console.error('Profile update error:', error);
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

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      phone: user?.phone || '',
      address: user?.address || '',
    });
    setErrors({});
    setEditing(false);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        الملف الشخصي
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <Avatar
            sx={{ width: 80, height: 80, mr: 2 }}
          >
            {user?.name?.charAt(0)?.toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h5">{user?.name}</Typography>
            <Typography color="textSecondary">{user?.email}</Typography>
            <Typography variant="body2" color="textSecondary">
              {user?.role === 'superadmin' ? 'مدير عام' : 'مدير'}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {editing ? (
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="الاسم"
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
                  label="رقم الهاتف"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  error={!!errors.phone}
                  helperText={errors.phone}
                  dir="rtl"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="العنوان"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  error={!!errors.address}
                  helperText={errors.address}
                  multiline
                  rows={3}
                  dir="rtl"
                />
              </Grid>
            </Grid>

            <Box display="flex" gap={2} mt={3}>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
              >
                {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
              </Button>
              <Button
                variant="outlined"
                onClick={handleCancel}
              >
                إلغاء
              </Button>
            </Box>
          </Box>
        ) : (
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  الاسم
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {user?.name}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  البريد الإلكتروني
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {user?.email}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  رقم الهاتف
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {user?.phone || 'غير محدد'}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  العنوان
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {user?.address || 'غير محدد'}
                </Typography>
              </Grid>
            </Grid>

            <Box mt={3}>
              <Button
                variant="contained"
                onClick={() => setEditing(true)}
              >
                تعديل الملف الشخصي
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
} 