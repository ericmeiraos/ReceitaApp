import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Grid, Paper, Card, CardContent, CardMedia, IconButton, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { recipeService } from '../services/api';

function Home() {
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

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta receita?')) {
      try {
        await recipeService.remove(id);
        fetchRecipes();
      } catch (error) {
        console.error('Erro ao excluir receita:', error);
      }
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

        {/* <Grid item xs={12} md={4}>
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
          >
            <RestaurantIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Receitas Populares
            </Typography>
            <Typography color="text.secondary">
              As receitas mais amadas da comunidade
            </Typography>
          </Paper>
        </Grid> */}
      </Grid>

      {/* Seção de Receitas Recentes */}
      {/* <Box sx={{ mt: 8 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          Receitas Recentes
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {recipes.map((recipe) => (
              <Grid item xs={12} sm={6} md={4} key={recipe.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      transition: 'transform 0.3s ease-in-out',
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={recipe.imagem || 'https://picsum.photos/300/200'}
                    alt={recipe.nome}
                    sx={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/receitas/${recipe.id}`)}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="h2"
                      sx={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/receitas/${recipe.id}`)}
                    >
                      {recipe.nome}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {recipe.descricao}
                    </Typography>
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                      <IconButton
                        onClick={() => navigate(`/receitas/editar/${recipe.id}`)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(recipe.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {recipes.length > 0 && (
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button
              variant="contained"
              onClick={() => navigate('/receitas')}
              sx={{ mt: 2 }}
            >
              Ver Todas as Receitas
            </Button>
          </Box>
        )}
      </Box> */}
    </Box>
  );
}

export default Home; 