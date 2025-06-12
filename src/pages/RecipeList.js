import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  IconButton,
  Pagination,
  CircularProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { recipeService } from '../services/api';

const RecipeList = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const data = await recipeService.getAll((page - 1) * 10, 10);
      setRecipes(Array.isArray(data) ? data : []);
      setTotalPages(Math.ceil((Array.isArray(data) ? data.length : 0) / 10));
    } catch (error) {
      console.error('Erro ao buscar receitas:', error);
      setRecipes([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchRecipes();
      return;
    }

    try {
      setLoading(true);
      const data = await recipeService.searchByName(searchTerm.trim(), (page - 1) * 10, 10);
      setRecipes(Array.isArray(data) ? data : []);
      setTotalPages(Math.ceil((Array.isArray(data) ? data.length : 0) / 10));
    } catch (error) {
      console.error('Erro ao buscar receitas:', error);
      setRecipes([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta receita?')) {
      try {
        await recipeService.remove(id);
        if (searchTerm.trim()) {
          handleSearch();
        } else {
          fetchRecipes();
        }
      } catch (error) {
        console.error('Erro ao excluir receita:', error);
      }
    }
  };

  useEffect(() => {
    if (searchTerm.trim()) {
      handleSearch();
    } else {
      fetchRecipes();
    }
  }, [page]);

  return (
    <Box sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
        <TextField
          fullWidth
          label="Buscar receitas"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          sx={{ minWidth: '120px' }}
        >
          Buscar
        </Button>
        <Button
          variant="outlined"
          onClick={() => navigate('/receitas/nova')}
          sx={{ minWidth: '120px' }}
        >
          Nova Receita
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {recipes.length > 0 ? (
              recipes.map((recipe) => (
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
              ))
            ) : (
              <Grid item xs={12}>
                <Typography variant="h6" align="center" color="textSecondary">
                  Nenhuma receita encontrada
                </Typography>
              </Grid>
            )}
          </Grid>

          {totalPages > 1 && (
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(e, value) => setPage(value)}
                color="primary"
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default RecipeList; 