import Together from "together-ai";
import { buildSystemPrompt } from "../helpers/promptBuilder.js";
const together = new Together({ apiKey: process.env.TOGETHER_API_KEY });

export const chatbot = async (req, res) => {
  try {
    const { messages } = req.body;
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Build system prompt dinamis
    let systemPrompt =
      "Jawablah semua pertanyaan HANYA dalam bahasa Indonesia yang sopan dan ramah, layaknya asisten desa. Jangan pernah menjawab dalam bahasa Inggris.";
    try {
      systemPrompt = await buildSystemPrompt();
    } catch {}
    const fullMessages = [
      { role: "system", content: systemPrompt },
      ...messages,
    ];

    const response = await together.chat.completions.create({
      messages: fullMessages,
      model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
      stream: true,
    });

    for await (const token of response) {
      const content = token.choices[0]?.delta?.content;
      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }
    res.end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
