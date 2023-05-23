const mongoose = require("mongoose");
const { v4: uuid } = require('uuid');
const audioElementSchema = new mongoose.Schema({
  id: { type: String, default: uuid, required: true },
  type: { type: String, required: true },
  high_volume: { type: Number, required: true },
  low_volume: { type: Number, required: true },
  video_component_id: { type: String },
  url: { type: String },
  duration: {
    start_time: { type: Number, required: true },
    end_time: { type: Number, required: true }
  }
});

const AudioElementModel = mongoose.model("AudioElement", audioElementSchema);

module.exports = {
  AudioElementModel
};
