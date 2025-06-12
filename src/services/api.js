import axios from 'axios';

const API_URL = 'https://api-receitas-5xhs.onrender.com';

const api = axios.create({
  baseURL: API_URL,
});

export const recipeService = {
  // Listar todas as receitas
  getAll: async (skip = 0, limit = 10) => {
    const response = await api.get(`/api/receitas/?skip=${skip}&limit=${limit}`);
    return response.data;
  },

  // Buscar receita por ID
  getById: async (id) => {
    const response = await api.get(`/api/receitas/${id}`);
    return response.data;
  },

  // Buscar receitas por nome
  searchByName: async (name, skip = 0, limit = 10) => {
    const response = await api.get(`/api/receitas/buscar/${name}?skip=${skip}&limit=${limit}`);
    return response.data;
  },

  // Criar nova receita
  create: async (recipe) => {
    const response = await api.post('/api/receitas', recipe);
    return response.data;
  },

  // Atualizar receita
  update: async (id, recipe) => {
    const response = await api.put(`/api/receitas/${id}`, recipe);
    return response.data;
  },

  // Excluir receita
  remove: async (id) => {
    const response = await api.delete(`/api/receitas/${id}`);
    return response.data;
  },

  // Listar todos os ingredientes
  getAllIngredients: async () => {
    const response = await api.get('/api/ingredientes');
    return response.data;
  },

  // Buscar ingredientes por nome
  searchIngredients: async (name) => {
    const response = await api.get(`/api/ingredientes/busca/${name}`);
    return response.data;
  },
};

export default api; 