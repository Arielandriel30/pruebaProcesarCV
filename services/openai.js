const { OpenAI } = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function getQuestions(cvText) {
  const prompt = `Basándote en el siguiente CV, generá 5 preguntas técnicas relevantes para una entrevista en ESPAÑOL:\n\n${cvText}\n\nPreguntas:`;

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 500,
  });

  return [response.choices[0].message.content];
}

module.exports = {
  name: 'openai',
  getQuestions,
};
