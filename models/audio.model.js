const mongoose = require("mongoose");

const audioElementSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  type: { type: String, required: true },
  high_volume: { type: Number, required: true },
  low_volume: { type: Number, required: true },
  video_component_id: { type: Number },
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
