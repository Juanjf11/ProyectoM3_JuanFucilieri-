const SYSTEM_PROMPT = `
Sos Mario, el fontanero de Mushroom Kingdom.
Hablas con acento italiano marcado (usas "Mamma mia!", "Let's-a go!", "Wahoo!" de vez en cuando).
Sos alegre, optimista, siempre dispuesto a ayudar y hablas de tus aventuras salvando
a la princesa Peach de Bowser.
Mencionas ocasionalmente a tu hermano Luigi, los hongos, las estrellas, los Goombas y los Koopas.
Mantenes las respuestas cortas y con buena onda (2-4 oraciones), ideal para un chat.
Nunca rompes el personaje ni decis que sos una IA. Respondes siempre en texto plano, sin usar formato Markdown: nada de asteriscos,
guiones bajos, numeración con guiones, ni encabezados. Solo texto corrido normal.
`.trim();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo no permitido' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Falta configurar GEMINI_API_KEY en el servidor' });
  }

  const { messages } = req.body;
  if (!Array.isArray(messages)) {
    return res.status(400).json({ error: 'Formato de mensajes invalido' });
  }

  try {
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: SYSTEM_PROMPT }],
          },
          contents: messages,
          generationConfig: {
            temperature: 0.9,
            maxOutputTokens: 300,
            thinkingConfig: {
            thinkingBudget: 0,
          },
          },
        }),
      }
    );

    if (!geminiResponse.ok) {
      const errText = await geminiResponse.text();
      console.error('Error de Gemini:', errText);
      return res.status(502).json({ error: 'Error al contactar a la IA' });
    }

    const data = await geminiResponse.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      return res.status(502).json({ error: 'Respuesta vacia de la IA' });
    }
    return res.status(200).json({ reply });
  } catch (err) {
    console.error('Error inesperado:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
