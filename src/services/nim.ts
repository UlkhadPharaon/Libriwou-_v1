const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export interface ExtractedTransaction {
  id?: string;
  type: 'INCOME' | 'EXPENSE' | 'PAYROLL';
  syscohadaCode?: string;
  amountExclTax: number;
  vatAmount: number;
  amountInclTax: number;
  date: string;
  description?: string;
  category: string;
  fecValid: boolean;
  vendorName?: string;
  currency?: string;
  originalAmountInclTax?: number;
  originalAmountExclTax?: number;
  exchangeRate?: number;
  fraudSuspected?: boolean;
  fraudReason?: string;
  lineItems?: {
    description: string;
    quantity: number;
    unitPrice: number;
    amountExclTax: number;
  }[];
}

export interface UserContext {
  companyName?: string;
  taxRegime?: string;
  ifu?: string;
  sector?: string;
  revenue: number;
  expenses: number;
  taxes: any;
  recentTransactions?: any[];
}

export async function extractTransactionFromFile(file: File): Promise<ExtractedTransaction> {
  const base64 = await fileToBase64(file);
  
  const response = await fetch(`${API_BASE_URL}/api/vision`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ base64, mimeType: file.type })
  });

  if (!response.ok) {
    throw new Error("Impossible d'analyser le document.");
  }

  const data = await response.json();
  const text = data.text || "";
  
  try {
    // Robust extraction: find the first '{' and last '}'
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    
    if (start !== -1 && end !== -1 && end > start) {
        const jsonPart = text.substring(start, end + 1);
        return JSON.parse(jsonPart) as ExtractedTransaction;
    }
    
    return JSON.parse(text) as ExtractedTransaction;
  } catch (e) {
    console.error("Vision JSON parse failed. Raw text:", text);
    throw new Error("Structure de données invalide reçue de l'analyse visuelle.");
  }
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const tools = [
  {
    type: "function",
    function: {
      name: 'propose_transaction',
      description: 'Propose une transaction (extraite d\'un document ou du texte) pour validation par l\'utilisateur AVANT enregistrement.',
      parameters: {
        type: "object",
        properties: {
          type: { type: "string", description: 'INCOME ou EXPENSE' },
          amountExclTax: { type: "number", description: 'Montant Hors Taxe' },
          vatAmount: { type: "number", description: 'Montant de la TVA' },
          amountInclTax: { type: "number", description: 'Montant TTC' },
          date: { type: "string", description: 'Date YYYY-MM-DD' },
          description: { type: "string", description: 'Description complète de la transaction' },
          category: { type: "string", description: 'Catégorie comptable' },
          fecValid: { type: "boolean", description: 'Présence de QR code ou certification' },
          vendorName: { type: "string", description: 'Nom du tiers' },
          currency: { type: "string", description: 'Devise (ex: XOF, EUR, USD)' },
          syscohadaCode: { type: "string", description: 'Code de Plan Comptable SYSCOHADA approprié' }
        },
        required: ['type', 'amountExclTax', 'vatAmount', 'amountInclTax', 'date', 'category', 'fecValid', 'syscohadaCode']
      }
    }
  },
  {
    type: "function",
    function: {
      name: 'update_company_profile',
      description: "Met à jour le profil de l'entreprise (ex: changement de chiffre d'affaires prévisionnel, secteur).",
      parameters: {
        type: "object",
        properties: {
          estimatedRevenue: { type: "number", description: "Nouveau chiffre d'affaires prévisionnel annuel en FCFA" },
          sector: { type: "string", description: "Nouveau secteur d'activité" }
        }
      }
    }
  },
  {
    type: "function",
    function: {
      name: 'delete_transaction',
      description: "Supprime une transaction existante en utilisant son ID.",
      parameters: {
        type: "object",
        properties: {
          transactionId: { type: "string", description: "L'ID de la transaction à supprimer" }
        },
        required: ['transactionId']
      }
    }
  },
  {
    type: "function",
    function: {
      name: 'generate_invoice',
      description: "Prépare la génération d'une facture. Renvoie les données structurées pour que l'interface affiche l'outil de facturation pré-rempli.",
      parameters: {
        type: "object",
        properties: {
          clientName: { type: "string", description: "Nom du client pour la facture" },
          description: { type: "string", description: "Description complète de la prestation ou du produit" },
          amountExclTax: { type: "number", description: "Montant HT en FCFA" }
        },
        required: ['clientName', 'description', 'amountExclTax']
      }
    }
  },
  {
    type: "function",
    function: {
      name: 'generate_payroll_slip',
      description: "Prépare la génération d'un bulletin de paie et navigue vers l'écran de création du bulletin (ex: pour un salaire donné ou brut/net).",
      parameters: {
        type: "object",
        properties: {
          employeeName: { type: "string", description: "Nom de l'employé" },
          role: { type: "string", description: "Rôle/Poste de l'employé" },
          grossSalary: { type: "number", description: "Salaire brut en FCFA" },
          netSalary: { type: "number", description: "Salaire net en FCFA (si l'utilisateur donne le net, estimez le brut ou utilisez le net)" }
        },
        required: ['employeeName']
      }
    }
  },
  {
    type: "function",
    function: {
      name: 'fetch_all_transactions',
      description: "Récupère l'intégralité des transactions de l'utilisateur pour une analyse approfondie (bilan, grand livre, audit). Utile si le contexte initial ne contient que les transactions récentes.",
      parameters: {
        type: "object",
        properties: {}
      }
    }
  },
  {
    type: "function",
    function: {
      name: 'fetch_all_invoices',
      description: "Récupère toutes les factures émises par l'entreprise.",
      parameters: {
        type: "object",
        properties: {}
      }
    }
  },
  {
    type: "function",
    function: {
      name: 'fetch_inventory_items',
      description: "Récupère la liste des articles en stock et leur quantité.",
      parameters: {
        type: "object",
        properties: {}
      }
    }
  },
  {
    type: "function",
    function: {
      name: 'fetch_employee_list',
      description: "Récupère la liste des employés de l'entreprise.",
      parameters: {
        type: "object",
        properties: {}
      }
    }
  },
  {
    type: "function",
    function: {
      name: 'check_duplicates',
      description: "Recherche des transactions potentiellement en double en comparant les montants, dates et types.",
      parameters: {
        type: "object",
        properties: {
          amount: { type: "number", description: "Le montant à vérifier" },
          date: { type: "string", description: "La date au format YYYY-MM-DD" },
          type: { type: "string", enum: ['INCOME', 'EXPENSE'], description: "Le type de transaction" }
        },
        required: ['amount', 'date', 'type']
      }
    }
  },
  {
    type: "function",
    function: {
      name: 'fetch_fiscal_calendar',
      description: "Récupère les prochaines échéances fiscales et sociales.",
      parameters: {
        type: "object",
        properties: {}
      }
    }
  },
  {
    type: "function",
    function: {
      name: 'simulate_scenario',
      description: "Applique un scénario prédictif 'What-If'. Permet de tester l'impact d'une embauche, d'une augmentation des ventes ou de charges sur la trésorerie et les impôts.",
      parameters: {
        type: "object",
        properties: {
          simRevenue: { type: "number", description: "Le nouveau chiffre d'affaires annuel projeté en FCFA" },
          simExpenses: { type: "number", description: "Les nouvelles charges annuelles projetées en FCFA" },
          simRegime: { type: "string", enum: ['CME', 'RSI', 'RNI'], description: "Le régime fiscal projeté" },
          simSector: { type: "string", enum: ['service', 'commerce'], description: "Le secteur d'activité" },
          explanation: { type: "string", description: "Une explication détaillée du raisonnement pour l'utilisateur" }
        },
        required: ['simRevenue', 'simExpenses', 'simRegime', 'simSector', 'explanation']
      }
    }
  }
];

export async function sendChatMessage(
  history: { role: 'user' | 'model', text: string }[],
  newMessage: string,
  file?: File,
  extractedText?: string,
  context?: UserContext,
  actionHandler?: (name: string, args: any) => Promise<any>,
  enableThinking: boolean = false
): Promise<{ text: string, actions: any[] } | null> {
  try {
    const messages: any[] = [];
      if (context) {
        messages.push({
            role: 'system',
            content: `Tu es Libriwouô, l'expert-comptable virtuel et cerveau analytique souverain de l'application. Tu es spécialisé dans les normes SYSCOHADA révisées et la fiscalité du Burkina Faso (TVA 18%, IFU, RCCM).

PROFIL DE L'ENTREPRISE:
- Nom: ${context.companyName || 'Inconnu'}
- IFU: ${context.ifu || 'Inconnu'}
- Secteur: ${context.sector || 'Inconnu'}
- Statut: Actif

RÈGLES FISCALES (BURKINA FASO):
1. RÉGIMES & SEUILS:
   - CME (Contribution des Micro-Entreprises) : Chiffre d'Affaires (CA) < 15 000 000 FCFA. Taxe = 2% du CA (vente de biens) ou 5% du CA (services). Pas de TVA à collecter/reverser.
   - RSI (Régime Simplifié) : 15M <= CA <= 50 000 000 FCFA. TVA = 18%. IS = 27.5% du bénéfice (ou minimum 300 000 FCFA).
   - RNI (Régime Réel Normal) : CA > 50 000 000 FCFA. TVA = 18%. IS = 27.5% du bénéfice (ou minimum 1 000 000 FCFA).
2. DÉLAIS: Déclarations mensuelles avant le 20 du mois suivant.
3. CNSS: Taux patronal ~16-20%, Taux salarial 5.5%.

CONTEXTE FINANCIER ACTUEL: 
- Chiffre d'Affaires: ${context.revenue} FCFA
- Dépenses: ${context.expenses} FCFA
- Régime Détecté: ${context.taxRegime || 'À déterminer'}
- Bénéfice Brut: ${context.revenue - context.expenses} FCFA
- Taxes Pré-calculées: ${context.taxes ? JSON.stringify(context.taxes) : 'Non disponibles'}

TES MISSIONS:
1. RÉPONSES DIRECTES: Si l'utilisateur demande "Combien je dois aux impôts ?", utilise PRIORITAIREMENT les "Taxes Pré-calculées" ci-dessus pour répondre. Ne sois pas théorique, sois concret.
2. VISION & DOCUMENTS: Tu reçois les documents soit par Vision (images) soit par Texte Extrait (PDF/Word). 
   - Analyse structurelle des factures : cherche Date, Tiers, Montants (HT, TVA, TTC) dans le texte extrait.
3. COMPTABILITÉ & DOCUMENTS: Mapping SYSCOHADA.
4. ACTIONS (CRITIQUE): Tu DOIS utiliser les fonctions (outils) mises à ta disposition pour interagir avec l'application. 
   - **Lorsqu'un reçu ou une facture est soumis en pièce jointe ou via vision, extrais directement les fonds et appelle IMMÉDIATEMENT la fonction \`propose_transaction\` pour la pré-remplir.** Ne demande JAMAIS la permission d'enregistrer.
   - Appelle toujours l'outil approprié au lieu de juste décrire l'action.
   - CONTRAINTES DE FONCTION : N'appelle JAMAIS plus d'un seul outil à la fois dans le même message. Si l'utilisateur dit juste bonjour, salut, merci ou pose une question générale sans soumettre de document, ne déclenche AUCUN outil.

STYLE: Ne sois pas hésitant. Tu as les données. Donne des chiffres. Sois pro-actif. N'attends pas la confirmation de l'utilisateur pour appeler \`propose_transaction\` uniquement lorsque des détails ou des documents réels sont soumis.`
        });
    }

    let conversationMessages = [...messages];
    
    // Restore history mapping
    history.forEach(m => {
      conversationMessages.push({
          role: m.role === 'model' ? 'assistant' : m.role,
          content: m.text
      });
    });
    
    let finalContent: any[] | string = newMessage;
    
    if (file && file.type.startsWith('image/')) {
        try {
            const base64 = await fileToBase64(file);
            finalContent = [
                { type: "text", text: newMessage || "Voici un document." },
                { type: "image_url", image_url: { url: `data:${file.type};base64,${base64}` } }
            ];
        } catch (e) {
            console.error("Impossible de lire l'image :", e);
            finalContent = newMessage;
        }
    } else if (extractedText) {
        finalContent = `${newMessage}\n\nCONTENU DU DOCUMENT EXTRAIT :\n---\n${extractedText}\n---`;
    }

    if (finalContent || (Array.isArray(finalContent) && finalContent.length > 0)) {
        conversationMessages.push({ role: 'user', content: finalContent });
    }

    
    const allActions: any[] = [];
    let assistantMessage: any = null;

    // Reasoning Loop
    for (let i = 0; i < 5; i++) { // Limit iterations to prevent infinite loops
        const response = await fetch(`${API_BASE_URL}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: conversationMessages,
                tools,
                stream: false,
                enable_thinking: enableThinking
            })
        });

        let data;
        try {
            data = await response.json();
        } catch (e) {
            console.error("Error parsing API response. Response probably not JSON:", e);
            throw new Error(`Invalid response from API. Expected JSON. Status: ${response.status}`);
        }
        
        if (!response.ok) {
            console.error("API error:", data);
            return { text: "Désolé, une erreur technique s'est produite lors de la connexion. " + (data?.error || ""), actions: allActions };
        }

        if (!data.choices || data.choices.length === 0) {
            console.error("No choices in response:", data);
            return { text: "Désolé, je n'ai pas pu générer de réponse.", actions: allActions };
        }

        assistantMessage = data.choices[0].message;
        conversationMessages.push(assistantMessage);

        if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
            for (const toolCall of assistantMessage.tool_calls) {
                try {
                    const args = JSON.parse(toolCall.function.arguments);
                    const result = await actionHandler!(toolCall.function.name, args);
                    
                    allActions.push({ name: toolCall.function.name, args, result });
                    
                    // Add tool result to conversation
                    conversationMessages.push({
                        role: 'tool',
                        tool_call_id: toolCall.id,
                        content: typeof result === 'string' ? result : JSON.stringify(result)
                    });
                } catch (toolError) {
                    console.error("Error executing tool:", toolError);
                    conversationMessages.push({
                        role: 'tool',
                        tool_call_id: toolCall.id,
                        content: JSON.stringify({ error: toolError instanceof Error ? toolError.message : String(toolError) })
                    });
                }
            }
            // Continue loop to get final response after tool results
            continue;
        }

        // If no tool calls, we are done
        break;
    }

    return { 
        text: assistantMessage?.content || (allActions.length > 0 ? "J'ai effectué les actions demandées." : "Je n'ai pas pu générer de réponse."), 
        actions: allActions 
    };

  } catch (error) {
    console.error("Error in sendChatMessage:", error);
    return null;
  }
}
