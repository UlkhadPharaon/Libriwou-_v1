import OpenAI from 'openai';

interface Env {
  NVIDIA_API_KEY: string;
  TAVILY_API_KEY: string;
  ASSETS: any;
}

export default {
  async fetch(request: Request, env: Env, ctx: any): Promise<Response> {
    const url = new URL(request.url);

    // CORS Headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Handle OPTIONS request for CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // Routing API requests
    if (url.pathname.startsWith("/api/")) {
      try {
        if (url.pathname === "/api/chat" && request.method === "POST") {
          return await handleChat(request, env, corsHeaders);
        }
        if (url.pathname === "/api/vision" && request.method === "POST") {
          return await handleVision(request, env, corsHeaders);
        }
        if (url.pathname === "/api/intelligence" && request.method === "POST") {
          return await handleIntelligence(request, env, corsHeaders);
        }
        if (url.pathname === "/api/license" && request.method === "POST") {
          return await handleLicense(request, env, corsHeaders);
        }

        return new Response(JSON.stringify({ error: "Endpoint not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message || "Internal Server Error" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }

    // Default: fall back to serving static assets
    return env.ASSETS.fetch(request);
  }
};

async function handleChat(request: Request, env: Env, corsHeaders: any): Promise<Response> {
  const apiKey = env.NVIDIA_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "NVIDIA_API_KEY manquante sur Cloudflare Workers" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  const body: any = await request.json();
  const messages = body.messages || [];
  const tools = body.tools;
  const stream = body.stream;
  const enable_thinking = body.enable_thinking;
  const isThinkingEnabled = !!enable_thinking;

  const openai = new OpenAI({
    baseURL: "https://integrate.api.nvidia.com/v1",
    apiKey: apiKey
  });

  const cleanMessages = messages.map((msg: any) => {
    if (Array.isArray(msg.content)) {
      msg.content = msg.content.map((part: any) => {
        if (part.type === 'image_url' && part.image_url && part.image_url.url) {
          return part;
        }
        if (part.type === 'text') return { type: 'text', text: part.text };
        return part;
      });
    }
    return msg;
  });

  let finalMessages = [
    {
      role: 'system',
      content: "Tu es NEO, l'assistant intelligent de gestion d'entreprise de Libriwouô. Tu devez IMPÉRATIVEMENT répondre en FRANÇAIS. Tes réponses doivent être professionnelles, expertes en fiscalité et comptabilité (norme SYSCOHADA), et chaleureuses."
    },
    ...cleanMessages
  ];
  if (isThinkingEnabled) {
    finalMessages.unshift({
      role: 'system',
      content: "MODE RÉFLEXION PROFONDE ACTIVÉ: Décompose ton raisonnement étape par étape avant de donner ta réponse finale. Analyse les implications fiscales et comptables en détail. Tu peux utiliser des balises <reasoning> si tu le souhaites pour structurer ta pensée interne."
    });
  }

  if (stream) {
    const streamOptions: any = {
      model: "meta/llama-3.3-70b-instruct",
      messages: finalMessages,
      tools,
      temperature: 0.60,
      stream: true,
      parallel_tool_calls: false,
    };
    
    const streamResponse = await openai.chat.completions.create(streamOptions);

    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const encoder = new TextEncoder();

    (async () => {
      try {
        for await (const chunk of streamResponse) {
          await writer.write(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`));
        }
        await writer.write(encoder.encode('data: [DONE]\n\n'));
      } catch (e) {
        console.error("Stream writing error:", e);
      } finally {
        await writer.close();
      }
    })();

    return new Response(readable, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      }
    });
  } else {
    const options: any = {
      model: "meta/llama-3.3-70b-instruct",
      messages: finalMessages,
      tools,
      temperature: 0.60,
      parallel_tool_calls: false,
    };
    const response = await openai.chat.completions.create(options);
    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
}

async function handleVision(request: Request, env: Env, corsHeaders: any): Promise<Response> {
  const apiKey = env.NVIDIA_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "NVIDIA_API_KEY manquante sur Cloudflare Workers" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  const openai = new OpenAI({
    baseURL: "https://integrate.api.nvidia.com/v1",
    apiKey: apiKey
  });
  
  const { base64, mimeType } = await request.json() as any;
  const messages = [
    {
      role: "user",
      content: [
        { type: "text", text: `Tu es un expert en vision comptable spécialisé dans le plan comptable SYSCOHADA révisé et la fiscalité du Burkina Faso.
Analyse ce document (facture, reçu, ticket) avec une précision extrême.

EXTRACTION DES DONNÉES:
1. Identifie le Type (INCOME/EXPENSE).
2. Extraits les montants: Montant Hors Taxe (HT), Montant TVA (taux standard 18% au Burkina si non spécifié mais calculable), Montant TTC.
3. Date au format YYYY-MM-DD.
4. Identifie le fournisseur (vendorName) et son IFU si présent.
5. Détecte les anomalies (fraudSuspected : doublons, montants incohérents).

ANALYSE COMPTABLE (SYSCOHADA):
- Détermine la catégorie de dépense.
- Assigne le CODE SYSCOHADA approprié (ex: 601 pour Achats de marchandises, 605 pour Fournitures, 622 pour Locations, 632 pour Transports, etc.).
- Vérifie la conformité DGI (fecValid : présence de mentions obligatoires).

Renvoie UNIQUEMENT un objet JSON strict avec ces champs:
{
  "type": "EXPENSE" | "INCOME",
  "amountExclTax": number,
  "vatAmount": number,
  "amountInclTax": number,
  "date": "YYYY-MM-DD",
  "category": "string",
  "fecValid": boolean,
  "vendorName": "string",
  "currency": "XOF",
  "fraudSuspected": boolean,
  "fraudReason": "string" | null,
  "syscohadaCode": "string",
  "description": "Brève description du contenu",
  "lineItems": [
    {
      "description": "string (Nom de l'article)",
      "quantity": number,
      "unitPrice": number,
      "amountExclTax": number
    }
  ]
}` },
        { type: "image_url", image_url: { url: `data:${mimeType};base64,${base64}` } }
      ]
    }
  ];

  const response = await openai.chat.completions.create({
    model: "meta/llama-3.3-70b-instruct",
    messages: messages as any,
    temperature: 0.1,
  });
  
  return new Response(JSON.stringify({ text: response.choices[0].message.content }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}

async function handleIntelligence(request: Request, env: Env, corsHeaders: any): Promise<Response> {
  const nvidiaKey = env.NVIDIA_API_KEY;
  const tavilyKey = env.TAVILY_API_KEY;
  
  if (!nvidiaKey || !tavilyKey) {
    return new Response(JSON.stringify({ error: "Clés d'API manquantes sur Cloudflare Workers" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  const { sector, date } = await request.json() as any;
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

  const tavilyData: any = await tavilyResponse.json();
  let searchResultsText = "";
  if (tavilyData && tavilyData.results) {
    searchResultsText = tavilyData.results.map((r: any) => `Titre: ${r.title}\nURL: ${r.url}\nExtrait: ${r.snippet || r.content || ''}`).join('\n\n');
  }

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

  let text = dsResponse.choices[0]?.message?.content || "";
  let jsonText = text;
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    jsonText = text.substring(firstBrace, lastBrace + 1);
  }

  const parsedData = JSON.parse(jsonText.trim());
  const generatedNews = parsedData.news || (Array.isArray(parsedData) ? parsedData : []);
  
  return new Response(JSON.stringify({ news: generatedNews }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}

async function handleLicense(request: Request, env: Env, corsHeaders: any): Promise<Response> {
  const { email } = await request.json() as any;
  if (!email) {
    return new Response(JSON.stringify({ error: "Email requis pour la validation." }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  const isExpiredTrigger = email.toLowerCase().includes('expired');
  const expiryDate = new Date();
  if (isExpiredTrigger) {
    expiryDate.setDate(expiryDate.getDate() - 5);
  } else {
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
  }

  const status = {
    active: !isExpiredTrigger && expiryDate > new Date(),
    expiry: expiryDate.toISOString(),
    plan: "Premium UEMOA Corporate",
    email: email,
    lastChecked: new Date().toISOString()
  };

  return new Response(JSON.stringify(status), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}
