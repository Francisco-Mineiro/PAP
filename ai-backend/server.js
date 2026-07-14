require('dotenv').config();
const express = require("express");
const OpenAI = require("openai");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());


const gemini = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY?.trim(),
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

//Resposata AI
app.post("/ai", async (req, res) => {
  const userMessage = req.body.message?.trim();

  if (!userMessage) {
    return res.status(400).json({ reply: "Por favor, escreve uma mensagem." });
  }

  if (userMessage.length > 1000) {
    return res.status(400).json({ reply: "Mensagem demasiado longa." });
  }

  try {

    
    const response = await gemini.chat.completions.create({
  model: "gemini-2.5-flash",
   messages: [
        {
          role: "system",
          content: "É um assistente financeiro amigável e útil. Ajuda o utilizador com  dicas de poupança, investimentos básicos e hábitos financeiros saudáveis. Responde sempre em português de Portugal, de forma clara , fácil de entender e respostas curtas."
        },
        {
          role: "user",
          content: userMessage
        }
      ],temperature: 0.75,
          max_tokens: 4096,
         extra_body: {
          google: {
      thinking_config: {
        thinking_budget: 0
      }
    }
  }
});
//Resposta AI(Fim)

    const aiReply = response.choices[0]?.message?.content?.trim() || "Desculpa, não consegui processar a resposta.";

    res.json({ reply: aiReply });

  } catch (error) {
    console.error("Erro Gemini:", error?.response?.data || error.message);
    res.status(500).json({ 
      reply: "Estou com dificuldade em responder agora. Pode tentar novamente?" 
    });
  }
});

app.get("/", (req, res) => {
  res.json({ status: "Assistente virtual está a funcionar" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor a correr na porta ${PORT}`);
});
