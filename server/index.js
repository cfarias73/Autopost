import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';  // Add this import

import mongoose from 'mongoose';
import { OpenAI } from 'openai';
import { IgApiClient } from 'instagram-private-api';
import { FacebookAdsApi } from 'facebook-nodejs-business-sdk';
import Settings from './models/Settings.js';

dotenv.config();

const app = express();
app.use(cors());  // Add this line
app.use(express.json());

// Temporary in-memory storage for settings
let inMemorySettings = null;

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Initialize Instagram API client
const ig = new IgApiClient();

// Initialize Facebook API
FacebookAdsApi.init(process.env.FACEBOOK_ACCESS_TOKEN);

// Routes
app.post('/api/auth/instagram', async (req, res) => {
  try {
    const { username, password } = req.body;
    ig.state.generateDevice(username);
    await ig.account.login(username, password);
    res.json({ success: true, message: 'Instagram login successful' });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.post('/api/generate-content', async (req, res) => {
  try {
    const { topic, tone } = req.body;
    
    // Generate text content using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{
        role: "system",
        content: `Crea una publicación para redes sociales en español sobre ${topic} con un tono ${tone}. La publicación debe ser atractiva y relevante para una audiencia hispanohablante.`
      }]
    });

    // Generate image using DALL-E
    const image = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Crea una imagen hiper realista y fotográfica sobre ${topic}, que sea relevante para una audiencia hispanohablante. La imagen debe tener un estilo profesional y de alta calidad, con detalles nítidos y texturas realistas. Asegúrate de dejar espacio en la esquina superior derecha para un logo corporativo.`,
      size: "1024x1024",
      quality: "hd",
      style: "natural",
      n: 1,
    });

    res.json({
      success: true,
      content: completion.choices[0].message.content,
      imageUrl: image.data[0].url
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/posts/schedule', async (req, res) => {
  try {
    const { content, imageUrl, scheduledTime, platforms } = req.body;
    // Save post to database with scheduled time
    // Implementation for scheduling system
    res.json({ success: true, message: 'Post scheduled successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Settings endpoints
app.get('/api/settings', async (req, res) => {
  try {
    res.json(inMemorySettings || {});
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/settings', async (req, res) => {
  try {
    const { openaiApiKey, facebookAccessToken, instagramUsername, instagramPassword } = req.body;
    
    if (!openaiApiKey) {
      return res.status(400).json({ success: false, error: 'OpenAI API key is required' });
    }

    // Validate OpenAI API key
    try {
      const testOpenAI = new OpenAI({ apiKey: openaiApiKey });
      const testResponse = await testOpenAI.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "system", content: "Test" }],
        max_tokens: 5
      });
      
      if (!testResponse || !testResponse.choices) {
        throw new Error('Invalid API response');
      }
    } catch (apiError) {
      console.error('OpenAI API key validation error:', apiError);
      return res.status(400).json({
        success: false,
        error: 'Invalid OpenAI API key. Please check your API key and try again.'
      });
    }

    // Update in-memory settings
    inMemorySettings = {
      openaiApiKey,
      facebookAccessToken: facebookAccessToken || '',
      instagramUsername: instagramUsername || '',
      instagramPassword: instagramPassword || '',
      updatedAt: new Date()
    };

    // Update the OpenAI instance with new API key
    openai.apiKey = openaiApiKey;

    res.json({
      success: true,
      message: 'Settings updated successfully',
      settings: {
        ...inMemorySettings,
        openaiApiKey: '****',
        instagramPassword: '****'
      }
    });

  } catch (error) {
    console.error('Settings update error:', error);
    res.status(500).json({
      success: false,
      error: 'An unexpected error occurred while updating settings'
    });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});