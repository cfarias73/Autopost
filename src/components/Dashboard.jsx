import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, CardMedia, Typography, Button, Box, Chip } from '@mui/material';
import { format } from 'date-fns';
import axios from 'axios';

const Dashboard = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Fetch posts from backend
    const fetchPosts = async () => {
      try {
        const response = await axios.get('/api/posts');
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  const handleApprove = async (postId) => {
    try {
      await axios.post(`/api/posts/${postId}/approve`);
      // Refresh posts after approval
      const response = await axios.get('/api/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Error approving post:', error);
    }
  };

  const handleReject = async (postId) => {
    try {
      await axios.post(`/api/posts/${postId}/reject`);
      // Refresh posts after rejection
      const response = await axios.get('/api/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Error rejecting post:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Generated Posts
      </Typography>
      <Grid container spacing={3}>
        {posts.map((post) => (
          <Grid item xs={12} md={6} key={post._id}>
            <Card>
              {post.imageUrl && (
                <CardMedia
                  component="img"
                  height="200"
                  image={post.imageUrl}
                  alt="Post image"
                />
              )}
              <CardContent>
                <Typography variant="body1" gutterBottom>
                  {post.content}
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Chip
                      label={post.status}
                      color={post.status === 'pending' ? 'warning' : post.status === 'approved' ? 'success' : 'error'}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    {post.scheduledTime && (
                      <Chip
                        label={`Scheduled: ${format(new Date(post.scheduledTime), 'PPp')}`}
                        color="primary"
                        size="small"
                      />
                    )}
                  </Box>
                  {post.status === 'pending' && (
                    <Box>
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => handleApprove(post._id)}
                        sx={{ mr: 1 }}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleReject(post._id)}
                      >
                        Reject
                      </Button>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;