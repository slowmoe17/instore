import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  InputAdornment,
  Alert,
  Fade,
  Slide,
  Divider,
  Chip,
  Avatar,
  LinearProgress,
} from '@mui/material';
import {
  PersonAdd as PersonAddIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Security as SecurityIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

export default function CreateUser() {
  const navigate = useNavigate();
  const { createUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    Cpassword: '',
    phone: '',
    address: '',
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name || formData.name.length < 3) {
      newErrors.name = 'الاسم يجب أن يكون 3 أحرف على الأقل';
    }

    if (!formData.email) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صحيح';
    }

    if (!formData.password || formData.password.length < 3) {
      newErrors.password = 'كلمة المرور يجب أن تكون 3 أحرف على الأقل';
    }

    if (!formData.Cpassword) {
      newErrors.Cpassword = 'تأكيد كلمة المرور مطلوب';
    } else if (formData.password !== formData.Cpassword) {
      newErrors.Cpassword = 'كلمة المرور غير متطابقة';
    }

    if (!formData.phone) {
      newErrors.phone = 'رقم الهاتف مطلوب';
    } else if (formData.phone.length !== 11) {
      newErrors.phone = 'رقم الهاتف يجب أن يكون 11 رقم';
    }

    if (!formData.address || formData.address.trim().length === 0) {
      newErrors.address = 'العنوان مطلوب';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      await createUser(formData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Create user error:', error);
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

  const getFormCompletion = () => {
    const fields = Object.keys(formData);
    const filledFields = fields.filter(field => formData[field] && formData[field].trim() !== '');
    return (filledFields.length / fields.length) * 100;
  };

  const formCompletion = getFormCompletion();

  return (
    <Box 
      sx={{ 
        p: 4,
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      }}
    >
      {/* Header Section */}
      <Fade in timeout={800}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
              textShadow: '0 4px 8px rgba(0,0,0,0.1)',
            }}
          >
            إنشاء مستخدم جديد
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'text.secondary',
              maxWidth: 700,
              mx: 'auto',
              fontWeight: 300,
            }}
          >
            إضافة مستخدم جديد إلى النظام مع الصلاحيات المناسبة والتحكم الكامل
          </Typography>
        </Box>
      </Fade>

      {/* Progress Bar */}
      <Fade in timeout={1000}>
        <Box sx={{ mb: 4, maxWidth: 800, mx: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', mr: 1 }}>
              اكتمال النموذج
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#667eea' }}>
              {Math.round(formCompletion)}%
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={formCompletion}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: 'rgba(102, 126, 234, 0.1)',
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: 4,
              },
            }}
          />
        </Box>
      </Fade>

      <Grid container spacing={4} justifyContent="center" maxWidth="1400px" mx="auto">
        {/* Info Card */}
        <Grid item xs={12} lg={4}>
          <Slide direction="right" in timeout={1000}>
            <Card 
              sx={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                borderRadius: 4,
                boxShadow: '0 20px 60px rgba(102, 126, 234, 0.3)',
                height: 'fit-content',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                  opacity: 0.3,
                },
              }}
            >
              <CardContent sx={{ textAlign: 'center', p: 4, position: 'relative', zIndex: 1 }}>
                <Box
                  sx={{
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(20px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                    border: '3px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
                    },
                  }}
                >
                  <PersonAddIcon sx={{ fontSize: 50, color: 'white' }} />
                </Box>
                
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                  إضافة مستخدم جديد
                </Typography>
                
                <Typography variant="body1" sx={{ opacity: 0.9, mb: 4, lineHeight: 1.6 }}>
                  قم بملء النموذج أدناه لإنشاء حساب جديد للمستخدم مع جميع المعلومات المطلوبة والصلاحيات المناسبة
                </Typography>
                
                <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.2)' }} />
                
                <Box 
                  sx={{ 
                    p: 3,
                    borderRadius: 3,
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <SecurityIcon sx={{ mr: 1, fontSize: 20 }} />
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      متطلبات النظام
                    </Typography>
                  </Box>
                  
                  <Box sx={{ textAlign: 'right' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CheckCircleIcon sx={{ fontSize: 16, mr: 1, color: '#4caf50' }} />
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        الاسم يجب أن يكون 3 أحرف على الأقل
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CheckCircleIcon sx={{ fontSize: 16, mr: 1, color: '#4caf50' }} />
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        كلمة المرور يجب أن تكون 3 أحرف على الأقل
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CheckCircleIcon sx={{ fontSize: 16, mr: 1, color: '#4caf50' }} />
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        رقم الهاتف يجب أن يكون 11 رقم
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CheckCircleIcon sx={{ fontSize: 16, mr: 1, color: '#4caf50' }} />
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        جميع الحقول مطلوبة
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ mt: 3 }}>
                  <Chip
                    icon={<InfoIcon />}
                    label="مستخدم جديد"
                    sx={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      fontWeight: 'bold',
                      backdropFilter: 'blur(10px)',
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Slide>
        </Grid>

        {/* Form */}
        <Grid item xs={12} lg={8}>
          <Slide direction="left" in timeout={1200}>
            <Paper 
              sx={{ 
                p: 5, 
                borderRadius: 4,
                boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
                border: '1px solid rgba(102, 126, 234, 0.1)',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <Avatar
                  sx={{
                    width: 56,
                    height: 56,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    mr: 2,
                  }}
                >
                  <PersonIcon sx={{ fontSize: 28 }} />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1e293b', mb: 0.5 }}>
                    معلومات المستخدم
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    أدخل جميع البيانات المطلوبة لإنشاء الحساب
                  </Typography>
                </Box>
              </Box>

              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="الاسم الكامل"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      error={!!errors.name}
                      helperText={errors.name}
                      required
                      dir="rtl"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon sx={{ color: formData.name ? '#667eea' : 'text.secondary' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          transition: 'all 0.3s ease',
                          '&:hover fieldset': {
                            borderColor: '#667eea',
                            borderWidth: '2px',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#667eea',
                            borderWidth: '2px',
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#667eea',
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="البريد الإلكتروني"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      error={!!errors.email}
                      helperText={errors.email}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon sx={{ color: formData.email ? '#667eea' : 'text.secondary' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          transition: 'all 0.3s ease',
                          '&:hover fieldset': {
                            borderColor: '#667eea',
                            borderWidth: '2px',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#667eea',
                            borderWidth: '2px',
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#667eea',
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="كلمة المرور"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      error={!!errors.password}
                      helperText={errors.password}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon sx={{ color: formData.password ? '#667eea' : 'text.secondary' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          transition: 'all 0.3s ease',
                          '&:hover fieldset': {
                            borderColor: '#667eea',
                            borderWidth: '2px',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#667eea',
                            borderWidth: '2px',
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#667eea',
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="تأكيد كلمة المرور"
                      name="Cpassword"
                      type="password"
                      value={formData.Cpassword}
                      onChange={handleChange}
                      error={!!errors.Cpassword}
                      helperText={errors.Cpassword}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon sx={{ color: formData.Cpassword ? '#667eea' : 'text.secondary' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          transition: 'all 0.3s ease',
                          '&:hover fieldset': {
                            borderColor: '#667eea',
                            borderWidth: '2px',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#667eea',
                            borderWidth: '2px',
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#667eea',
                        },
                      }}
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
                      required
                      dir="rtl"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneIcon sx={{ color: formData.phone ? '#667eea' : 'text.secondary' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          transition: 'all 0.3s ease',
                          '&:hover fieldset': {
                            borderColor: '#667eea',
                            borderWidth: '2px',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#667eea',
                            borderWidth: '2px',
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#667eea',
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="العنوان"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      error={!!errors.address}
                      helperText={errors.address}
                      required
                      dir="rtl"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LocationIcon sx={{ color: formData.address ? '#667eea' : 'text.secondary' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          transition: 'all 0.3s ease',
                          '&:hover fieldset': {
                            borderColor: '#667eea',
                            borderWidth: '2px',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#667eea',
                            borderWidth: '2px',
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#667eea',
                        },
                      }}
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 4 }} />

                <Box display="flex" gap={3} justifyContent="center" flexWrap="wrap">
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    size="large"
                    startIcon={loading ? null : <SaveIcon />}
                    sx={{
                      borderRadius: 3,
                      px: 6,
                      py: 2,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4)',
                      fontWeight: 'bold',
                      fontSize: '1.1rem',
                      minWidth: 200,
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                        boxShadow: '0 12px 40px rgba(102, 126, 234, 0.6)',
                        transform: 'translateY(-2px)',
                      },
                      '&:disabled': {
                        background: 'linear-gradient(135deg, #b0b0b0 0%, #808080 100%)',
                        boxShadow: 'none',
                        transform: 'none',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {loading ? 'جاري الإنشاء...' : 'إنشاء المستخدم'}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/dashboard')}
                    size="large"
                    startIcon={<CancelIcon />}
                    sx={{
                      borderRadius: 3,
                      px: 6,
                      py: 2,
                      borderColor: '#667eea',
                      color: '#667eea',
                      fontWeight: 'bold',
                      fontSize: '1.1rem',
                      minWidth: 200,
                      borderWidth: '2px',
                      '&:hover': {
                        borderColor: '#5a6fd8',
                        backgroundColor: 'rgba(102, 126, 234, 0.04)',
                        borderWidth: '2px',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    إلغاء
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Slide>
        </Grid>
      </Grid>
    </Box>
  );
} 