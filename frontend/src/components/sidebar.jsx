import React from 'react';
import { useNavigate } from 'react-router-dom';
import { List, ListItemButton, ListItemText, Drawer } from '@mui/material';
import { styled } from '@mui/system';

const StyledDrawer = styled(Drawer)(({ theme }) => ({
    '& .MuiDrawer-paper': {
      backgroundColor: '#2B3A2F',
      color: '#D2E3C8',
      width: '220px',
      borderRight: '1px solid #5F7E62',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
      marginTop: '64px',
      height: `calc(100vh - 64px)`,
    },
  }));
  
  const StyledListItem = styled(ListItemButton)(({ theme }) => ({
    borderRadius: '12px',
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    '&:hover': {
      backgroundColor: '#5F7E62',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    '&.Mui-selected': {
      backgroundColor: '#3E5641', 
      color: '#FFFFFF',
      fontWeight: 'bold',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    },
  }));
  
  const SideBar = () => {
    const navigate = useNavigate();
  
    const menuItems = [
      { label: 'Overview', route: '/dashboard' },
      { label: 'Inventory', route: '/inventory' },
      { label: 'Tax', route: '/tax' },
      { label: 'Invoice', route: '/invoice' },
      { label: 'Expense', route: '/expense' },
      { label: 'Sales', route: '/sales' },
      { label: 'Audit Logs', route: '/audit' },
      { label: 'Supplier', route: '/supplier' },
      { label: 'Category', route: '/category' },
    ];
  
    return (
      <StyledDrawer variant="permanent">
        <List>
          {menuItems.map((item, index) => (
            <StyledListItem
              key={index}
              onClick={() => navigate(item.route)}
              sx={{
                backgroundColor: window.location.pathname === item.route ? '#5F7E62' : 'inherit',
              }}
            >
              <ListItemText primary={item.label} />
            </StyledListItem>
          ))}
        </List>
      </StyledDrawer>
    );
  };
  
  export default SideBar;