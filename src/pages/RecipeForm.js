import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  IconButton,
  CircularProgress,
  Container,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { recipeService } from '../services/api';

const RecipeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState({
    nome: '',
    descricao: '',
    tempo_preparo: '',
    tempo_cozimento: '',
    porcoes: '',
    dificuldade: '',
    imagem: '',
    video: '',
    categoria: '',
    tags: '',
    ingredientes: [''],
    instrucoes: [''],
  });

  useEffect(() => {
    if (id) {
      fetchRecipe();
    }
  }, [id]);

  const fetchRecipe = async () => {
    try {
      setLoading(true);
      const data = await recipeService.getById(id);
      setRecipe({
        nome: data.nome || '',
        descricao: data.descricao || '',
        tempo_preparo: data.tempo_preparo ? data.tempo_preparo.toString() : '',
        tempo_cozimento: data.tempo_cozimento ? data.tempo_cozimento.toString() : '',
        porcoes: data.porcoes ? data.porcoes.toString() : '',
        dificuldade: data.dificuldade || '',
        imagem: data.imagem || '',
        video: data.video || '',
        categoria: data.categoria || '',
        tags: Array.isArray(data.tags) ? data.tags.join(', ') : (data.tags || ''),
        ingredientes: data.ingredientes && data.ingredientes.length > 0 ? data.ingredientes : [''],
        instrucoes: data.instrucoes && data.instrucoes.length > 0 ? data.instrucoes : [''],
      });
    } catch (error) {
      console.error('Erro ao buscar receita:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {  
    const { name, value } = e.target;
    setRecipe((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleIngredientChange = (index, value) => { 
    const newIngredients = [...recipe.ingredientes];
    newIngredients[index] = value;
    setRecipe((prev) => ({
      ...prev,
      ingredientes: newIngredients,
    }));
  };

  const handleInstructionChange = (index, value) => {  
    const newInstructions = [...recipe.instrucoes];
    newInstructions[index] = value;
    setRecipe((prev) => ({
      ...prev,
      instrucoes: newInstructions,
    }));
  };

  const addIngredient = () => {
    setRecipe((prev) => ({
      ...prev,
      ingredientes: [...prev.ingredientes, ''],
    }));
  };

  const removeIngredient = (index) => {
    setRecipe((prev) => ({
      ...prev,
      ingredientes: prev.ingredientes.filter((_, i) => i !== index),
    }));
  };

  const addInstruction = () => {
    setRecipe((prev) => ({
      ...prev,
      instrucoes: [...prev.instrucoes, ''],
    }));
  };

  const removeInstruction = (index) => {
    setRecipe((prev) => ({
      ...prev,
      instrucoes: prev.instrucoes.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const payload = {
        nome: recipe.nome,
        descricao: recipe.descricao,
        tempo_preparo: recipe.tempo_preparo ? Number(recipe.tempo_preparo) : undefined,
        tempo_cozimento: recipe.tempo_cozimento ? Number(recipe.tempo_cozimento) : undefined,
        porcoes: recipe.porcoes ? Number(recipe.porcoes) : undefined,
        dificuldade: recipe.dificuldade,
        imagem: recipe.imagem,
        video: recipe.video,
        categoria: recipe.categoria,
        tags: recipe.tags ? recipe.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        ingredientes: recipe.ingredientes,
        instrucoes: recipe.instrucoes,
        nutricao: {},
        secoes: []
      };

      if (id) { 
        await recipeService.update(id, payload);
      } else {
        await recipeService.create(payload);
      }
      navigate('/receitas');
    } catch (error) {
      console.error('Erro ao salvar receita:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm">
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          mt: 4, 
          mb: 4,
          borderRadius: 2,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            mb: 4, 
            textAlign: 'center',
            color: 'primary.main',
            fontWeight: 'bold'
          }}
        >
          {id ? 'Editar Receita' : 'Nova Receita'}
        </Typography>

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              fullWidth
              label="Nome da Receita"
              name="nome"
              value={recipe.nome}
              onChange={handleChange}
              required
              variant="outlined"
              size="medium"
              inputProps={{ style: { height: 40 } }}
            />
            <TextField
              fullWidth
              label="Descrição"
              name="descricao"
              value={recipe.descricao}
              onChange={handleChange}
              variant="outlined"
              size="medium"
              inputProps={{ style: { height: 40 } }}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Tempo de Preparo (min)"
                name="tempo_preparo"
                type="number"
                value={recipe.tempo_preparo}
                onChange={handleChange}
                variant="outlined"
                size="medium"
                inputProps={{ min: 0, style: { height: 40 } }}
                sx={{ flex: 1 }}
              />
              <TextField
                label="Tempo de Cozimento (min)"
                name="tempo_cozimento"
                type="number"
                value={recipe.tempo_cozimento}
                onChange={handleChange}
                variant="outlined"
                size="medium"
                inputProps={{ min: 0, style: { height: 40 } }}
                sx={{ flex: 1 }}
              />
              <TextField
                label="Porções"
                name="porcoes"
                type="number"
                value={recipe.porcoes}
                onChange={handleChange}
                variant="outlined"
                size="medium"
                inputProps={{ min: 0, style: { height: 40 } }}
                sx={{ flex: 1 }}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Dificuldade"
                name="dificuldade"
                value={recipe.dificuldade}
                onChange={handleChange}
                variant="outlined"
                size="medium"
                inputProps={{ style: { height: 40 } }}
                sx={{ flex: 1 }}
              />
              <TextField
                label="Categoria"
                name="categoria"
                value={recipe.categoria}
                onChange={handleChange}
                variant="outlined"
                size="medium"
                inputProps={{ style: { height: 40 } }}
                sx={{ flex: 1 }}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Imagem (URL)"
                name="imagem"
                value={recipe.imagem}
                onChange={handleChange}
                variant="outlined"
                size="medium"
                inputProps={{ style: { height: 40 } }}
                sx={{ flex: 1 }}
              />
              <TextField
                label="Vídeo (URL)"
                name="video"
                value={recipe.video}
                onChange={handleChange}
                variant="outlined"
                size="medium"
                inputProps={{ style: { height: 40 } }}
                sx={{ flex: 1 }}
              />
            </Box>
            <TextField
              fullWidth
              label="Tags (separadas por vírgula)"
              name="tags"
              value={recipe.tags}
              onChange={handleChange}
              variant="outlined"
              size="medium"
              inputProps={{ style: { height: 40 } }}
            />
            <Box>
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ color: 'primary.main', fontWeight: 'medium' }}
              >
                Ingredientes
              </Typography>
              {recipe.ingredientes.map((ingredient, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                  <TextField
                    fullWidth
                    label={`Ingrediente ${index + 1}`}
                    value={ingredient}
                    onChange={(e) => handleIngredientChange(index, e.target.value)}
                    required
                    variant="outlined"
                    size="medium"
                  />
                  <IconButton
                    color="error"
                    onClick={() => removeIngredient(index)}
                    disabled={recipe.ingredientes.length === 1}
                    sx={{ height: 40, width: 40 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
              <Button
                variant="outlined"
                onClick={addIngredient}
                startIcon={<AddIcon />}
                sx={{ borderRadius: 2, textTransform: 'none', mt: 1 }}
              >
                Adicionar Ingrediente
              </Button>
            </Box>

            <Box>
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ color: 'primary.main', fontWeight: 'medium' }}
              >
                Modo de Preparo
              </Typography>
              {recipe.instrucoes.map((instruction, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', mb: 2 }}>
                  <TextField
                    fullWidth
                    label={`Passo ${index + 1}`}
                    value={instruction}
                    onChange={(e) => handleInstructionChange(index, e.target.value)}
                    multiline
                    rows={3}
                    required
                    variant="outlined"
                    size="medium"
                  />
                  <IconButton
                    color="error"
                    onClick={() => removeInstruction(index)}
                    disabled={recipe.instrucoes.length === 1}
                    sx={{ height: 40, width: 40, mt: 1 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
              <Button
                variant="outlined"
                onClick={addInstruction}
                startIcon={<AddIcon />}
                sx={{ borderRadius: 2, textTransform: 'none', mt: 1 }}
              >
                Adicionar Passo
              </Button>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/receitas')}
                sx={{ borderRadius: 2, textTransform: 'none', px: 4 }}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{ borderRadius: 2, textTransform: 'none', px: 4 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Salvar'}
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default RecipeForm; 