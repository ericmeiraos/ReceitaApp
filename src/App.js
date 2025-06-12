import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container } from '@mui/material';
import './App.css'; // Importa o CSS global

// Componentes
import Navbar from './components/Navbar';
import Home from './pages/Home';
import RecipeList from './pages/RecipeList';
import RecipeForm from './pages/RecipeForm';
import RecipeDetail from './pages/RecipeDetail';

// Tema personalizado
const theme = createTheme({
  palette: {
    primary: {
      main: '#FF6B6B',
    },
    secondary: {
      main: '#ffffff',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/receitas" element={<RecipeList />} />
            <Route path="/receitas/nova" element={<RecipeForm />} />
            <Route path="/receitas/:id" element={<RecipeDetail />} />
            <Route path="/receitas/editar/:id" element={<RecipeForm />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;
