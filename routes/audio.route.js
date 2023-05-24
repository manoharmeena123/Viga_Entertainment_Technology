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
  
  //http://localhost:8000/api/audio-elements/


// //GetById==================================================================================================>
audioRouter.get('/audio-elements/:_id', async(req, res) => {
  try {
    const id = req.params._id;
    const audioElement = await AudioElementModel.findById(id);
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

//http://localhost:8000/api/audio-elements/646d8b11d882ceeb132f7709

//POST==================================================================================================>
audioRouter.post('/audio-elements', async(req, res) => {
  try {

    const payload = req.body;

    const audio = new AudioElementModel({...payload });
    await audio.save();
    res.status(201).json("Successfully Posted...");
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal server error' });
  }
});
//http://localhost:8000/api/audio-elements/

//PUT==================================================================================================>
audioRouter.put('/audio-elements/:id', async(req, res) => {
  const id = req.params.id;
    const payload = req.body;
    const todo = await AudioElementModel.findOne({_id:id})
    try {
     const data = await AudioElementModel.findByIdAndUpdate({_id:id},payload)
     res.status(201).json("Successfully Updated...");
     //console.log(data)
    } catch (error) {
        console.log(Error)
        res.status(500).json({ error: 'Internal server error' });
    }
});

//http://localhost:8000/api/audio-elements/646d8b11d882ceeb132f7709

//DeleteById==================================================================================================>
audioRouter.delete('/audio-elements/:id', async(req, res) => {
  const id = req.params.id;
    const payload = req.body;
    const todo = await AudioElementModel.findOne({_id:id})
    try {
     const data = await AudioElementModel.findByIdAndDelete({_id:id},payload)
     res.status(201).json("Successfully Deleted...");
     //console.log(data)
    } catch (error) {
        console.log(Error)
        res.status(500).json({ error: 'Internal server error' });
    }
});

//http://localhost:8000/api/audio-elements/646d8b11d882ceeb132f7709



//audio-fragments================================================================================================>
audioRouter.get('/audio-fragments', async (req, res) => {
  try {
    const { start_time, end_time } = req.query;
    const audioFragments = [];

    const audioElements = await AudioElementModel.find({
      'duration.start_time': { $lte: end_time },
      'duration.end_time': { $gte: start_time }
    });

    audioElements.forEach((audioElement) => {
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
    });

    res.json(audioFragments);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


//http://localhost:8000/api/audio-fragments?start_time=5&end_time=90


module.exports = {
  audioRouter
};
