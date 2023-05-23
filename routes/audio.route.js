const { v4: uuid } = require('uuid');
const { AudioElementModel } = require('../models/audio.model');
const express = require('express');
const audioRouter = express.Router();


//GetAll==================================================================================================>
audioRouter.get('/audio-elements', async(req, res) => {
    try {
      const audioElements = await AudioElementModel.find(); // Retrieve all audio elements from the model
      res.json(audioElements);
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  


//GetById==================================================================================================>
audioRouter.get('/audio-elements/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const audioElement = await AudioElementModel.findById({id});
    if (audioElement) {
      res.json(audioElement);
    } else {
      res.status(404).json({ error: 'Audio element not found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


//POST==================================================================================================>
audioRouter.post('/audio-elements', async(req, res) => {
  try {
    const id = parseInt(uuid());
    const payload = req.body;

    const audio = new AudioElementModel({ id, ...payload });
    await audio.save();
    res.status(201).json("Successfully Posted...");
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal server error' });
  }
});

//PUT==================================================================================================>
audioRouter.put('/audio-elements/:id', (req, res) => {
  try {
    const id = req.params.id;
    const { type, high_volume, low_volume, video_component_id, url, start_time, end_time } = req.body;
    const audioElement = AudioElementModel.find((element) => element.id === id);
    if (audioElement) {
      audioElement.type = type;
      audioElement.high_volume = high_volume;
      audioElement.low_volume = low_volume;
      audioElement.video_component_id = video_component_id;
      audioElement.url = url;
      audioElement.duration.start_time = start_time;
      audioElement.duration.end_time = end_time;
      res.json(audioElement);
    } else {
      res.status(404).json({ error: 'Audio element not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


//DeleteById==================================================================================================>
audioRouter.delete('/audio-elements/:id', (req, res) => {
  try {
    const id = req.params.id;
    const audioElementIndex = AudioElementModel.findIndex((element) => element.id === id);
    if (audioElementIndex !== -1) {
      AudioElementModel.splice(audioElementIndex, 1);
      res.sendStatus(200);
    } else {
      res.status(404).json({ error: 'Audio element not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});



audioRouter.get('/audio-fragments', (req, res) => {
  try {
    const { start_time, end_time } = req.query;
    const audioFragments = [];

    AudioElementModel.forEach((audioElement) => {
      if (audioElement.duration.start_time <= end_time && audioElement.duration.end_time >= start_time) {
        const fragmentStartTime = Math.max(audioElement.duration.start_time, start_time);
        const fragmentEndTime = Math.min(audioElement.duration.end_time, end_time);
        const volume = audioElement.type === 'video_music' ? 'Low Volume' : 'High Volume';

        const audioFragment = {
          id: audioElement.id,
          url: audioElement.url,
          type: audioElement.type,
          volume,
          duration: {
            start_time: fragmentStartTime,
            end_time: fragmentEndTime
          }
        };

        audioFragments.push(audioFragment);
      }
    });

    res.json(audioFragments);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = {
  audioRouter
};
