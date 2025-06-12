import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';

function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <RestaurantMenuIcon sx={{ mr: 2 }} />
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: 'bold',
          }}
        >
          Receitas da Vovô
        </Typography>
        <Box>
          <Button
            color="inherit"
            component={RouterLink}
            to="/receitas"
            sx={{ mx: 1 }}
          >
            Receitas
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/receitas/nova"
            variant="outlined"
            sx={{ mx: 1 }}
          >
            Nova Receita
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar; 