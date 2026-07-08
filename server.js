const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const OpenAI = require('openai');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// OpenAI Client mit API-Key aus .env
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// System-Prompt für den KI-Assistenten
const SYSTEM_PROMPT = `Du bist ein freundlicher KI-Assistent für Leon Schmidts Portfolio-Website. 
Du antwortest auf Deutsch und gibst Informationen über Leon Schmidt, einen Schüler und Entwickler aus Nürnberg.

Wichtige Fakten über Leon:
- Leon Schmidt ist Schüler in der 10. Klasse an der Johann-Pachelbel-Realschule in Nürnberg.
- Er hat 2 Zertifikate von Skysmart (Web-Entwicklung und Python).
- Seine IT-Skills: HTML5 (60%), CSS3 (60%), JavaScript (50%), React (40%), Python (57%), Git (25%), VS Code (70%).
- Er hat 240+ Übungsstunden in IT, 4 Jahre Studienzeit und 15+ Projekte.
- Er spielt leidenschaftlich Klavier (Klassik, moderne Lieder, Improvisation).
- Lieblingsstücke: Für Elise (Beethoven), Clair de Lune (Debussy), River Flows In You (Yiruma), Canon in D (Pachelbel).
- YouTube-Kanal: @pianoplayer-09
- Kontakt: Schmidtleon970@gmail.com, +49 155 66316521, Nürnberg, Deutschland.
- Lernt aktuell: Node.js, TypeScript, APIs, Datenbanken.

Sei hilfreich, freundlich und antworte prägnant. Bei Fragen, die nichts mit Leon zu tun haben, erkläre höflich, dass du nur über Leon Auskunft geben kannst.`;

// Chat-Endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Nachricht fehlt' });
        }

        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: message }
            ],
            max_tokens: 300,
            temperature: 0.7,
        });

        const reply = completion.choices[0].message.content.trim();
        res.json({ reply });

    } catch (error) {
        console.error('OpenAI Fehler:', error);
        res.status(500).json({ 
            error: 'KI-Dienst vorübergehend nicht verfügbar. Bitte versuche es später erneut.' 
        });
    }
});

app.listen(port, () => {
    console.log(`🚀 Server läuft auf http://localhost:${port}`);
});
