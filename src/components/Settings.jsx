import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, TextField, Button, Typography, Snackbar, Alert } from '@mui/material';
import axios from 'axios';

const Settings = () => {
  const [settings, setSettings] = useState({
    openaiApiKey: '',
    facebookAccessToken: '',
    instagramUsername: '',
    instagramPassword: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    // Fetch current settings
    const fetchSettings = async () => {
      try {
        const response = await axios.get('/api/settings');
        setSettings(response.data);
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post('/api/settings', settings);
      setSnackbar({
        open: true,
        message: 'Settings updated successfully',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error updating settings',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      <Card sx={{ maxWidth: 600, mx: 'auto', mt: 3 }}>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="OpenAI API Key"
              name="openaiApiKey"
              value={settings.openaiApiKey}
              onChange={handleChange}
              margin="normal"
              type="password"
            />
            <TextField
              fullWidth
              label="Facebook Access Token"
              name="facebookAccessToken"
              value={settings.facebookAccessToken}
              onChange={handleChange}
              margin="normal"
              type="password"
            />
            <TextField
              fullWidth
              label="Instagram Username"
              name="instagramUsername"
              value={settings.instagramUsername}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Instagram Password"
              name="instagramPassword"
              value={settings.instagramPassword}
              onChange={handleChange}
              margin="normal"
              type="password"
            />
            <Button
              fullWidth
              variant="contained"
              type="submit"
              sx={{ mt: 3 }}
            >
              Save Settings
            </Button>
          </form>
        </CardContent>
      </Card>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Settings;