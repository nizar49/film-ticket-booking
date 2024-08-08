import React from 'react';
import { TextField, IconButton, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useTheme } from '../theme/themeContext';

export default function SearchBar({ setQuery }) {
  const { mode } = useTheme();

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const isDarkMode = mode === 'dark';

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '60px',
      borderRadius: '25px',
      marginTop: '30px',
      padding: '0 40px',
    }}>
      <TextField
        size="small"
        variant="outlined"
        placeholder="Search movies, language, category..."
        onChange={handleChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon style={{ color: isDarkMode ? '#4CAF50' : '#1976D2' }} />
            </InputAdornment>
          ),
          style: {
            borderRadius: '25px',
            backgroundColor: isDarkMode ? '#1f1d1d' : '#f5f5f5',
            color: isDarkMode ? '#fff' : '#000',
          },
        }}
        style={{
          width: '100%',
          maxWidth: '600px',
          marginRight: '5px',
        }}
      />
    </div>
  );
}
