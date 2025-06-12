import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { recipeService } from '../services/api';

const Home = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const data = await recipeService.getAll(0, 6); // Buscando as 6 primeiras receitas
      setRecipes(data);
    } catch (error) {
      console.error('Erro ao buscar receitas:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ textAlign: 'center', py: 8 }}>
      <Typography
        variant="h2"
        component="h1"
        gutterBottom
        sx={{
          fontWeight: 'bold',
          color: 'primary.main',
          mb: 4,
        }}
      >
        Bem-vindo ao Receitas da Vovô
      </Typography>
      
      <Typography
        variant="h5"
        color="text.secondary"
        sx={{ mb: 6, maxWidth: '800px', mx: 'auto' }}
      >
        Descubra, compartilhe e crie receitas incríveis. 
        Sua fonte de inspiração culinária está aqui!
      </Typography>

      <Grid container spacing={4} justifyContent="center" sx={{ mt: 4 }}>
        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateY(-8px)',
                transition: 'transform 0.3s ease-in-out',
              },
            }}
            onClick={() => navigate('/receitas')}
          >
            <SearchIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Explorar Receitas
            </Typography>
            <Typography color="text.secondary">
              Descubra milhares de receitas deliciosas
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateY(-8px)',
                transition: 'transform 0.3s ease-in-out',
              },
            }}
            onClick={() => navigate('/receitas/nova')}
          >
            <AddIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Criar Receita
            </Typography>
            <Typography color="text.secondary">
              Compartilhe suas receitas favoritas
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {recipes.length > 0 && (
        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Button
            variant="contained"
            onClick={() => navigate('/receitas')}
            sx={{ mt: 2 }}
          >
            Ver Todas as Receitas
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Home; 