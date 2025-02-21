import React, { useState, useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';
import { format } from 'date-fns';
import axios from 'axios';

const ScheduledPosts = () => {
  const [scheduledPosts, setScheduledPosts] = useState([]);

  useEffect(() => {
    const fetchScheduledPosts = async () => {
      try {
        const response = await axios.get('/api/posts/scheduled');
        setScheduledPosts(response.data);
      } catch (error) {
        console.error('Error fetching scheduled posts:', error);
      }
    };

    fetchScheduledPosts();
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Scheduled Posts
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Content</TableCell>
              <TableCell>Scheduled Time</TableCell>
              <TableCell>Platforms</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {scheduledPosts.map((post) => (
              <TableRow key={post._id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {post.imageUrl && (
                      <img
                        src={post.imageUrl}
                        alt="Post preview"
                        style={{ width: 50, height: 50, marginRight: 16, objectFit: 'cover' }}
                      />
                    )}
                    <Typography variant="body2" sx={{ maxWidth: 300 }}>
                      {post.content.length > 100
                        ? `${post.content.substring(0, 100)}...`
                        : post.content}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  {format(new Date(post.scheduledTime), 'PPp')}
                </TableCell>
                <TableCell>
                  {post.platforms.map((platform) => (
                    <Chip
                      key={platform}
                      label={platform}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                  ))}
                </TableCell>
                <TableCell>
                  <Chip
                    label={post.status}
                    color={
                      post.status === 'scheduled'
                        ? 'primary'
                        : post.status === 'posted'
                        ? 'success'
                        : 'default'
                    }
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ScheduledPosts;