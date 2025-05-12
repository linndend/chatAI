import readline from 'readline';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askQuestion = (question) => {
  return new Promise((resolve) => rl.question(question, resolve));
};

async function chatWithAI(prompt) {
  const apiKey = process.env.NOVITA_API_KEY;
  const response = await fetch('https://api.novita.ai/v3/openai/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'qwen/qwen3-30b-a3b-fp8', // change your novita AI models
      messages: [{ role: 'user', content: prompt }]
    })
  });

  const text = await response.text();
  try {
    const data = JSON.parse(text);
    return data.choices?.[0]?.message?.content || `? No content: ${text}`;
  } catch (err) {
    return ` JSON parse error:\n${text}`;
  }
}



async function main() {
  console.log(' Welcome to CLI Chatbot! Type "exit" to quit.');
  while (true) {
    const input = await askQuestion('Your Chat: ');
    if (input.toLowerCase() === 'exit') break;
    const reply = await chatWithAI(input);
    console.log(`AI answer: ${reply}\n`);
  }
  rl.close();
}

main();