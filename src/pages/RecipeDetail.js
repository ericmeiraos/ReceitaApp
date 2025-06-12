import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  CircularProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { recipeService } from '../services/api';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRecipe = async () => {
    try {
      setLoading(true);
      const data = await recipeService.getById(id);
      setRecipe(data);
    } catch (error) {
      console.error('Erro ao buscar receita:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Tem certeza que deseja excluir esta receita?')) {
      try {
        await recipeService.remove(id);
        navigate('/receitas');
      } catch (error) {
        console.error('Erro ao excluir receita:', error);
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!recipe) {
    return (
      <Typography variant="h5" sx={{ mt: 4, textAlign: 'center' }}>
        Receita não encontrada
      </Typography>
    );
  }

  const ingredientes =
    recipe.secoes?.find(s => s.nome === 'Ingredientes')?.conteudo ||
    recipe.ingredientes ||
    [];

  const instrucoes =
    recipe.secoes?.find(s => s.nome === 'Modo de Preparo')?.conteudo ||
    recipe.instrucoes ||
    [];

  return (
    <Paper sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      <Box sx={{ position: 'relative' }}>
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            display: 'flex',
            gap: 1,
          }}
        >
          <IconButton
            color="primary"
            onClick={() => navigate(`/receitas/editar/${id}`)}
          >
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { md: 'center' }, gap: 4, mb: 4 }}>
          {recipe.imagem && (
            <Box
              component="img"
              src={recipe.imagem}
              alt={recipe.nome}
              sx={{
                width: { xs: '100%', md: 220 },
                height: 'auto',
                borderRadius: 2,
                boxShadow: 3,
                objectFit: 'cover',
                mb: { xs: 2, md: 0 }
              }}
            />
          )}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h3" gutterBottom>
              {recipe.nome}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
              {recipe.descricao}
            </Typography>
            {recipe.video && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Vídeo:</Typography>
                <a href={recipe.video} target="_blank" rel="noopener noreferrer">{recipe.video}</a>
              </Box>
            )}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Informações Gerais
            </Typography>
            <Typography variant="body1"><strong>Tempo de Preparo:</strong> {recipe.tempo_preparo} minutos</Typography>
            <Typography variant="body1"><strong>Tempo de Cozimento:</strong> {recipe.tempo_cozimento} minutos</Typography>
            <Typography variant="body1"><strong>Porções:</strong> {recipe.porcoes}</Typography>
            <Typography variant="body1"><strong>Dificuldade:</strong> {recipe.dificuldade}</Typography>
            <Typography variant="body1"><strong>Categoria:</strong> {recipe.categoria}</Typography>
            <Typography variant="body1"><strong>Tags:</strong> {Array.isArray(recipe.tags) ? recipe.tags.join(', ') : ''}</Typography>
          </Paper>

          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Ingredientes
            </Typography>
            <List>
              {ingredientes.map((ingrediente, index) => (
                <ListItem key={index}>
                  <ListItemText primary={ingrediente} />
                </ListItem>
              ))}
            </List>
          </Paper>

          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Instruções
            </Typography>
            <List>
              {instrucoes.map((instrucao, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={`Passo ${index + 1}`}
                    secondary={instrucao}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>

          {Array.isArray(recipe.secoes) && recipe.secoes.length > 0 && (
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Seções
              </Typography>
              {recipe.secoes.map((secao, idx) => (
                <Box key={idx} sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>{secao.nome}</Typography>
                  {Array.isArray(secao.conteudos) && secao.conteudos.length > 0 ? (
                    secao.conteudos.map((conteudo, cidx) => (
                      <Box key={cidx} sx={{ ml: 2, mb: 2 }}>
                        {conteudo.tipo && (
                          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>Tipo: </Typography>
                        )}
                        {conteudo.tipo && (
                          <Typography variant="body2" color="text.secondary" sx={{ display: 'inline', ml: 0.5 }}>{conteudo.tipo}</Typography>
                        )}
                        {conteudo.tipo && <br />}
                        {conteudo.texto && (
                          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>Texto: </Typography>
                        )}
                        {conteudo.texto && (
                          <Typography variant="body2" color="text.secondary" sx={{ display: 'inline', ml: 0.5 }}>{conteudo.texto}</Typography>
                        )}
                        {conteudo.texto && <br />}
                        {conteudo.imagem && (
                          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>Imagem: </Typography>
                        )}
                        {conteudo.imagem && (
                          <Typography variant="body2" color="text.secondary" sx={{ display: 'inline', ml: 0.5 }}>{conteudo.imagem}</Typography>
                        )}
                        {conteudo.imagem && <br />}
                        {conteudo.video && (
                          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>Vídeo: </Typography>
                        )}
                        {conteudo.video && (
                          <Typography variant="body2" color="text.secondary" sx={{ display: 'inline', ml: 0.5 }}>{conteudo.video}</Typography>
                        )}
                        {conteudo.video && <br />}
                        {Array.isArray(conteudo.lista) && conteudo.lista.length > 0 && (
                          <>
                            <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>Lista:</Typography>
                            <ul style={{ margin: '4px 0 8px 24px', padding: 0 }}>
                              {conteudo.lista.map((item, i) => (
                                <li key={i} style={{ fontSize: 14, color: '#555' }}>{item}</li>
                              ))}
                            </ul>
                          </>
                        )}
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">Sem conteúdos</Typography>
                  )}
                </Box>
              ))}
            </Paper>
          )}
        </Box>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/receitas')}
            sx={{ mr: 2 }}
          >
            Voltar para Lista
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate(`/receitas/editar/${id}`)}
          >
            Editar Receita
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default RecipeDetail; 