import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  Divider,
  Badge,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Inventory as ProductsIcon,
  Person as ProfileIcon,
  PersonAdd as CreateUserIcon,
  Logout as LogoutIcon,
  AccountCircle,
  Notifications as NotificationsIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const expandedWidth = 280;
const collapsedWidth = 72;

const menuItems = [
  { text: 'لوحة التحكم', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'المنتجات', icon: <ProductsIcon />, path: '/products' },
  { text: 'الملف الشخصي', icon: <ProfileIcon />, path: '/profile' },
];

const superAdminItems = [
  { text: 'إنشاء مستخدم', icon: <CreateUserIcon />, path: '/create-user' },
];

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleProfileMenuClose();
    navigate('/login');
  };

  const handleSidebarCollapse = () => {
    setSidebarOpen((prev) => !prev);
  };

  const drawer = (
    <Box sx={{
      height: '100%',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      transition: 'width 0.3s cubic-bezier(.4,2,.6,1)',
      width: sidebarOpen ? expandedWidth : collapsedWidth,
      overflowX: 'hidden',
      position: 'relative',
      border: 'none',
      boxShadow: '4px 0 20px rgba(0,0,0,0.1)',
    }}>
      <Box sx={{
        p: 3,
        pt: 2,
        pb: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: sidebarOpen ? 'space-between' : 'center',
        background: 'rgba(255, 255, 255, 0.1)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        minHeight: 64,
      }}>
        {sidebarOpen && (
          <Typography
            variant="h6"
            sx={{
              color: 'white',
              fontWeight: 'bold',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              whiteSpace: 'nowrap',
            }}
          >
            نظام إدارة المنتجات
          </Typography>
        )}
        <IconButton onClick={handleSidebarCollapse} sx={{ color: 'white', ml: sidebarOpen ? 1 : 0 }}>
          {sidebarOpen ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Box>
      <List sx={{ pt: 2 }}>
        {menuItems.map((item) => (
          <Tooltip key={item.text} title={!sidebarOpen ? item.text : ''} placement="right">
            <ListItem disablePadding sx={{ mb: 1, mx: 2, justifyContent: 'center' }}>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 2,
                  color: 'white',
                  minHeight: 48,
                  justifyContent: sidebarOpen ? 'initial' : 'center',
                  px: sidebarOpen ? 2 : 1,
                  '&.Mui-selected': {
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.25)',
                    },
                  },
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.1)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 0, mr: sidebarOpen ? 2 : 'auto', justifyContent: 'center' }}>
                  {item.icon}
                </ListItemIcon>
                {sidebarOpen && (
                  <ListItemText
                    primary={item.text}
                    sx={{
                      opacity: sidebarOpen ? 1 : 0,
                      transition: 'opacity 0.2s',
                      '& .MuiListItemText-primary': {
                        fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                      },
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          </Tooltip>
        ))}
        {user?.role === 'superadmin' && (
          <>
            <Divider sx={{ my: 2, mx: 2, borderColor: 'rgba(255, 255, 255, 0.2)' }} />
            {superAdminItems.map((item) => (
              <Tooltip key={item.text} title={!sidebarOpen ? item.text : ''} placement="right">
                <ListItem disablePadding sx={{ mb: 1, mx: 2, justifyContent: 'center' }}>
                  <ListItemButton
                    selected={location.pathname === item.path}
                    onClick={() => navigate(item.path)}
                    sx={{
                      borderRadius: 2,
                      color: 'white',
                      minHeight: 48,
                      justifyContent: sidebarOpen ? 'initial' : 'center',
                      px: sidebarOpen ? 2 : 1,
                      '&.Mui-selected': {
                        background: 'rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(10px)',
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.25)',
                        },
                      },
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.1)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <ListItemIcon sx={{ color: 'inherit', minWidth: 0, mr: sidebarOpen ? 2 : 'auto', justifyContent: 'center' }}>
                      {item.icon}
                    </ListItemIcon>
                    {sidebarOpen && (
                      <ListItemText
                        primary={item.text}
                        sx={{
                          opacity: sidebarOpen ? 1 : 0,
                          transition: 'opacity 0.2s',
                          '& .MuiListItemText-primary': {
                            fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                          },
                        }}
                      />
                    )}
                  </ListItemButton>
                </ListItem>
              </Tooltip>
            ))}
          </>
        )}
      </List>
      <Box sx={{ mt: 'auto', p: 2 }}>
        <Divider sx={{ mb: 2, borderColor: 'rgba(255, 255, 255, 0.2)' }} />
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            color: 'white',
            background: 'rgba(220, 53, 69, 0.2)',
            '&:hover': {
              background: 'rgba(220, 53, 69, 0.3)',
            },
            transition: 'all 0.3s ease',
            minHeight: 48,
            justifyContent: sidebarOpen ? 'initial' : 'center',
            px: sidebarOpen ? 2 : 1,
          }}
        >
          <ListItemIcon sx={{ color: 'inherit', minWidth: 0, mr: sidebarOpen ? 2 : 'auto', justifyContent: 'center' }}>
            <LogoutIcon />
          </ListItemIcon>
          {sidebarOpen && <ListItemText primary="تسجيل الخروج" />}
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${sidebarOpen ? expandedWidth : collapsedWidth}px)` },
          ml: { sm: `${sidebarOpen ? expandedWidth : collapsedWidth}px` },
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          backdropFilter: 'blur(10px)',
          transition: 'width 0.3s cubic-bezier(.4,2,.6,1), margin-left 0.3s cubic-bezier(.4,2,.6,1)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                whiteSpace: 'nowrap',
              }}
            >
              {menuItems.find(item => item.path === location.pathname)?.text || 'النظام'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              size="large"
              color="inherit"
              sx={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.2)',
                },
              }}
            >
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography
                variant="body2"
                sx={{
                  color: 'white',
                  fontWeight: 'medium',
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                {user?.name}
              </Typography>
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls="primary-search-account-menu"
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
                sx={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.2)',
                  },
                }}
              >
                <AccountCircle />
              </IconButton>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{
          width: { sm: sidebarOpen ? expandedWidth : collapsedWidth },
          flexShrink: { sm: 0 },
          transition: 'width 0.3s cubic-bezier(.4,2,.6,1)',
        }}
        aria-label="mailbox folders"
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: expandedWidth,
              border: 'none',
            },
          }}
        >
          {drawer}
        </Drawer>
        {/* Desktop Collapsible Drawer */}
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: sidebarOpen ? expandedWidth : collapsedWidth,
              border: 'none',
              boxShadow: '4px 0 20px rgba(0,0,0,0.1)',
              transition: 'width 0.3s cubic-bezier(.4,2,.6,1)',
              overflowX: 'hidden',
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0,
          width: { sm: `calc(100% - ${sidebarOpen ? expandedWidth : collapsedWidth}px)` },
          background: '#f8fafc',
          minHeight: '100vh',
          transition: 'width 0.3s cubic-bezier(.4,2,.6,1)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Toolbar />
        {/* Remove maxWidth and centering, make Outlet full width */}
        <Box sx={{ flex: 1, width: '100%', height: '100%' }}>
          <Outlet />
        </Box>
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        onClick={handleProfileMenuClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            border: '1px solid rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)',
          },
        }}
      >
        <MenuItem onClick={() => navigate('/profile')} sx={{ gap: 2 }}>
          <ListItemIcon>
            <ProfileIcon fontSize="small" />
          </ListItemIcon>
          الملف الشخصي
        </MenuItem>
        <MenuItem onClick={handleLogout} sx={{ gap: 2, color: 'error.main' }}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" color="error" />
          </ListItemIcon>
          تسجيل الخروج
        </MenuItem>
      </Menu>
    </Box>
  );
} 