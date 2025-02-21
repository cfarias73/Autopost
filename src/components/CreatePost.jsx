import React, { useState } from 'react';
import { Box, TextField, Button, Card, CardContent, CardMedia, Typography, FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material';
import axios from 'axios';

const CreatePost = () => {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('professional');
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [scheduledTime, setScheduledTime] = useState('');
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/generate-content', { topic, tone });
      if (response.data.success) {
        setGeneratedContent(response.data);
      } else {
        setError(response.data.error || 'Failed to generate content');
      }
    } catch (error) {
      console.error('Error generating content:', error);
      setError(error.response?.data?.error || error.message || 'Failed to generate content');
    } finally {
      setLoading(false);
    }
  };

  const handleSchedule = async () => {
    if (!generatedContent) return;

    try {
      await axios.post('/api/posts/schedule', {
        content: generatedContent.content,
        imageUrl: generatedContent.imageUrl,
        scheduledTime,
        platforms: ['instagram', 'facebook']
      });
      // Reset form after scheduling
      setTopic('');
      setTone('professional');
      setGeneratedContent(null);
      setScheduledTime('');
    } catch (error) {
      console.error('Error scheduling post:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Create New Post
      </Typography>
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 3 }}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <TextField
              fullWidth
              label="Topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              margin="normal"
              placeholder="Enter the topic for your post"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Tone</InputLabel>
              <Select
                value={tone}
                label="Tone"
                onChange={(e) => setTone(e.target.value)}
              >
                <MenuItem value="professional">Professional</MenuItem>
                <MenuItem value="casual">Casual</MenuItem>
                <MenuItem value="friendly">Friendly</MenuItem>
                <MenuItem value="humorous">Humorous</MenuItem>
              </Select>
            </FormControl>
            <Button
              fullWidth
              variant="contained"
              onClick={handleGenerate}
              disabled={!topic || loading}
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Generate Content'}
            </Button>
            {error && (
              <Typography color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
          </CardContent>
        </Card>

        {generatedContent && (
          <Card>
            <CardMedia
              component="img"
              height="300"
              image={generatedContent.imageUrl}
              alt="Generated image"
            />
            <CardContent>
              <Typography variant="body1" gutterBottom>
                {generatedContent.content}
              </Typography>
              <TextField
                fullWidth
                type="datetime-local"
                label="Schedule Time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleSchedule}
                disabled={!scheduledTime}
                sx={{ mt: 2 }}
              >
                Schedule Post
              </Button>
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
};

export default CreatePost;