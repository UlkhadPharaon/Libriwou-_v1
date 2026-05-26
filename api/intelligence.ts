import OpenAI from 'openai';


export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const nvidiaKey = process.env.NVIDIA_API_KEY;
  const tavilyKey = process.env.TAVILY_API_KEY;
  
  if (!nvidiaKey) {
    return res.status(500).json({ error: 'NVIDIA_API_KEY manquante' });
  }
  if (!tavilyKey) {
    return res.status(500).json({ error: 'TAVILY_API_KEY manquante' });
  }

  const { sector, date } = req.body;
  
  try {
      // 1. Tavily Search
      const searchQuery = `Actualité fiscale, opportunités économiques, appels d'offres et innovations au Burkina Faso et UEMOA ${sector !== 'Général' ? `pour le secteur ${sector}` : ''} ${date}`;
      
      const tavilyResponse = await fetch('https://api.tavily.com/search', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${tavilyKey}`
          },
          body: JSON.stringify({
              query: searchQuery,
              search_depth: "basic",
              include_answer: false,
              include_raw_content: false,
              max_results: 10
          })
      });

      if (!tavilyResponse.ok) {
           throw new Error('Erreur Tavily API');
      }

      const tavilyData = await tavilyResponse.json();
      let searchResultsText = "";
      if (tavilyData && tavilyData.results) {
         searchResultsText = tavilyData.results.map(r => `Titre: ${r.title}\nURL: ${r.url}\nExtrait: ${r.snippet || r.content || ''}`).join('\n\n');
      }

      // 2. NVIDIA NIM DeepSeek V3.2
      const openai = new OpenAI({
          baseURL: "https://integrate.api.nvidia.com/v1",
          apiKey: nvidiaKey
      });

      const prompt = `### CONSIGNES DE SÉCURITÉ ET DE LANGUE ###
- Tu dois IMPÉRATIVEMENT répondre en FRANÇAIS.
- Absolument TOUT le contenu textuel (titres, résumés/excerpts) doit être traduit ou rédigé en français.
- Même si les sources (résultats de recherche) sont en anglais, ton analyse doit être en français.

### Tâche ###
Voici des résultats de recherche web récents pour le Burkina Faso et l'UEMOA (date cible : ${date}):

${searchResultsText}

Génère EXACTEMENT 5 informations clés en te basant de préférence sur ces résultats.
Mélange les catégories suivantes :
1. GLOBAL : Grandes réformes fiscales, décisions douanières de la DGI ou lois de finances.
2. SPÉCIFIQUE AU SECTEUR "${sector}" : Appels d'offres (BOAD, Marchés publics), subventions, ou innovations spécifiques.

CONSIGNES DE SÉCURITÉ ABSOLUES :
- Zéro hallucination. Le champ "url" ne doit contenir QUE des liens cliquables provenant des résultats fournis, ou laisser vide "".
- Choisis tes sources parmi les journaux locaux ou économiques africains si possible.

Renvoie UNIQUEMENT un objet JSON contenant une propriété "news" qui est un tableau d'exactement 5 objets avec ces propriétés exactes :
- "title": (Le titre de la news, concis)
- "excerpt": (Un résumé TRÈS BREF et actionnable d'UNE SEULE PHRASE)
- "category": ("FISCAL", "OPPORTUNITY", "MARKET", ou "TECH")
- "date": ("${date}")
- "url": (Lien vérifié ou "")
- "targetSectors": (doit être un tableau de textes : ["GLOBAL"] ou ["${sector}"])

NE RENVOIE AUCUN TEXTE en dehors du bloc JSON. Assure-toi de la validité stricte de la syntaxe JSON. Exemple: {"news": [{"title": "...", "excerpt": "..."}]}`;

      const dsResponse = await openai.chat.completions.create({
          model: "meta/llama-3.3-70b-instruct",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 4096,
          temperature: 0.1,
      });

      console.log(JSON.stringify(dsResponse.choices[0], null, 2));

      let text = dsResponse.choices[0]?.message?.content || "";
      if (!text) {
          throw new Error("L'IA n'a renvoyé aucune réponse.");
      }
      console.log("AI original text sample:", text.substring(0, 100) + "...");
      
      // Robust JSON extraction: find the first '{' and last '}'
      let jsonText = text;
      const firstBrace = text.indexOf('{');
      const lastBrace = text.lastIndexOf('}');
      
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
          jsonText = text.substring(firstBrace, lastBrace + 1);
      }

      let parsedData;
      try {
         parsedData = JSON.parse(jsonText.trim());
      } catch (e) {
         console.error("AI JSON parse failed. Full text received:", text);
         throw new Error("L'IA a renvoyé une structure JSON invalide. Essayez de rafraîchir.");
      }
      
      const generatedNews = parsedData.news || (Array.isArray(parsedData) ? parsedData : []);
      
      res.json({ news: generatedNews });

  } catch (error) {
      console.error("Erreur gérée dans /api/intelligence :", error);
      res.status(500).json({ error: 'Erreur génération intelligence', details: error.message });
  }
}
