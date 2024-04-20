const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const OpenAI = require('openai');
const { getApiKey } = require('./configManager'); // Assuming you have a function to get API keys

// Initialize OpenAI with the API key
const openai = new OpenAI({
  apiKey: getApiKey(),
});

/**
 * Transcribes user audio recording to text using OpenAI's Whisper model.
 * @param {string} mp3FilePath Path to the MP3 file containing the user's audio recording.
 * @returns {Promise<string>} The transcribed text.
 */
async function transcribeUserRecording(mp3FilePath) {
  try {
    const form = new FormData();
    form.append('file', fs.createReadStream(mp3FilePath));
    form.append('model', 'whisper-1');
    form.append('response_format', 'text');

    const response = await axios.post(
      'https://api.openai.com/v1/audio/transcriptions',
      form,
      {
        headers: {
          ...form.getHeaders(),
          Authorization: `Bearer ${getApiKey()}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error calling OpenAI for transcription:', error);
    return null; // Consider returning null or an appropriate error message
  }
}

/**
 * Calls the Vision API with a screenshot and transcription of the user's question.
 * @param {string} inputScreenshot Path to the screenshot file.
 * @param {string} audioInput Transcribed text from the user's audio input.
 * @returns {Promise<string>} The response from the Vision API.
 */
async function callVisionAPI(inputScreenshot, audioInput) {
  const base64Image = fs.readFileSync(inputScreenshot).toString('base64');
  const dataUrl = `data:image/png;base64,${base64Image}`;

  try {
    const response = await openai.createCompletion({
      model: 'gpt-4-turbo', // Update this model as per your requirement
      prompt: `Analyze this screenshot and question: ${audioInput}`, // Customize your prompt
      temperature: 0.5,
      max_tokens: 500,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      stop: ["\n"],
    });

    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error('Error calling OpenAI Vision API:', error);
    return null; // Consider returning null or an appropriate error message
  }
}

/**
 * Plays back the response from the Vision API using text-to-speech.
 * @param {string} inputText The text to convert to speech.
 */
async function playVisionApiResponse(inputText) {
  // Assuming you have a function to play audio. This is a placeholder.
  console.log('Playing response:', inputText);
  // Implement the TTS API call or use a local TTS library to play the response
}

module.exports = {
  transcribeUserRecording,
  callVisionAPI,
  playVisionApiResponse,
};