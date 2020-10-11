const axios = require("axios");
const tf = require("@tensorflow/tfjs-node");
const nsfw = require("nsfwjs");

let nsfw_model;
// model loader
const load_model = async () => {
  nsfw_model = await nsfw.load();
  console.log("Succesfully Loaded Image Moderator.");
};
// main function
async function moderate(attachment) {
  const pic = await axios.get(attachment.url, {
    responseType: "arraybuffer",
  });
  const image = await tf.node.decodeImage(pic.data, 3);
  const predictions = await nsfw_model.classify(image);
  image.dispose();
  return get_final_prediction(predictions);
}

function get_final_prediction(predictions) {
  let final_result = "";
  let final_probability = 0;
  predictions.forEach((prediction) => {
    if (prediction.probability >= final_probability) {
      final_probability = prediction.probability;
      final_result = prediction.className;
    }
  });
  return final_result;
}

module.exports = { moderate: moderate, load_model: load_model };
