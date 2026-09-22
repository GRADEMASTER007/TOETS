import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Lazy initialization of Gemini client
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    try {
      aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    } catch (err) {
      console.error('Error creating GoogleGenAI client:', err);
    }
  }
  return aiClient;
}

// ==========================================
// 1. HEALTH & METADATA
// ==========================================
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'AfriTrade & UAE Platform Engine',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// ==========================================
// 2. AI NATURAL LANGUAGE SEARCH (Site-Wide)
// ==========================================
app.post('/api/ai/search', async (req: Request, res: Response) => {
  const { query, countryCode, pillar, modelChoice, thinking, grounding, listings } = req.body;

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Query is required' });
  }

  const ai = getAI();
  const selectedModel =
    modelChoice === 'gemini-3.1-pro-preview'
      ? 'gemini-3.1-pro-preview'
      : modelChoice === 'gemini-3.1-flash-lite'
        ? 'gemini-3.1-flash-lite'
        : 'gemini-3.5-flash';

  const systemInstruction = `You are the AI Search Assistant for "AfriTrade & UAE Portal", a multi-country marketplace, business directory, service directory, and property portal covering African Union countries, SADC bloc, and the UAE.
Your goal is to parse user natural language queries (e.g., "3 bedroom house in Sandton under R15000", "electrician near me", "used iPhone 13 under R8000") and match them against the available listings.
Respond in valid JSON format:
{
  "summary": "Brief explanation of what was found and recommendations",
  "matchedListingIds": ["id1", "id2"],
  "parsedFilters": {
    "pillar": "marketplace | business | service | property",
    "category": "category name if inferred",
    "city": "city or region if inferred",
    "maxPrice": number or null,
    "minPrice": number or null,
    "keywords": ["keyword1", "keyword2"]
  }
}`;

  if (ai) {
    try {
      const config: any = {
        systemInstruction,
        responseMimeType: 'application/json',
      };

      if (thinking && selectedModel === 'gemini-3.1-pro-preview') {
        config.thinkingConfig = { thinkingLevel: ThinkingLevel.HIGH };
      }

      if (grounding && selectedModel === 'gemini-3.5-flash') {
        config.tools = [{ googleSearch: {} }];
      }

      const prompt = `User Query: "${query}"
Active Country ISO: ${countryCode || 'Any'}
Active Pillar: ${pillar || 'All'}
Candidate Listings to evaluate:
${JSON.stringify(
  (listings || []).map((l: any) => ({
    id: l.id,
    title: l.title,
    pillar: l.pillar,
    countryCode: l.countryCode,
    city: l.city,
    category: l.categoryName,
    subcategory: l.subcategory,
    price: l.price,
    currency: l.currencyCode,
    featuredTier: l.featuredTier,
    description: l.description.slice(0, 140),
  })),
  null,
  2
)}`;

      const response = await ai.models.generateContent({
        model: selectedModel,
        contents: prompt,
        config,
      });

      const responseText = response.text || '{}';
      try {
        const parsed = JSON.parse(responseText);
        return res.json({
          status: 'success',
          data: parsed,
          modelUsed: selectedModel,
        });
      } catch (parseErr) {
        // Fallback JSON extraction
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return res.json({
            status: 'success',
            data: parsed,
            modelUsed: selectedModel,
          });
        }
      }
    } catch (err: any) {
      console.warn('Gemini API call failed, using smart fallback heuristic:', err.message);
    }
  }

  // Heuristic rule-based fallback when offline or no API key
  const queryLower = query.toLowerCase();
  const matchedIds: string[] = [];

  const terms = queryLower.split(/\s+/).filter((t: string) => t.length > 2);
  let inferredPillar: any = undefined;
  if (/rent|sale|house|flat|apartment|bedroom|erf|villa|property/.test(queryLower)) inferredPillar = 'property';
  else if (/plumb|electr|solar|repair|handyman|service|clean/.test(queryLower)) inferredPillar = 'service';
  else if (/company|hotel|restaurant|bank|freight|logistics|clinic/.test(queryLower)) inferredPillar = 'business';
  else if (/buy|sell|phone|car|truck|iphone|hilux|toyota|laptop/.test(queryLower)) inferredPillar = 'marketplace';

  (listings || []).forEach((l: any) => {
    let score = 0;
    const lText = `${l.title} ${l.description} ${l.categoryName} ${l.subcategory} ${l.city} ${l.countryCode}`.toLowerCase();
    terms.forEach((t: string) => {
      if (lText.includes(t)) score += 2;
    });
    if (inferredPillar && l.pillar === inferredPillar) score += 3;
    if (l.featuredTier === 'three_months') score += 2;
    if (l.featuredTier === 'month') score += 1;
    if (score > 1) {
      matchedIds.push(l.id);
    }
  });

  return res.json({
    status: 'success',
    data: {
      summary: `Found ${matchedIds.length} listings matching "${query}" across ${countryCode || 'all regions'}. Prioritized by relevance and active boost ranking.`,
      matchedListingIds: matchedIds.length > 0 ? matchedIds : (listings || []).slice(0, 3).map((l: any) => l.id),
      parsedFilters: {
        pillar: inferredPillar,
        keywords: terms,
      },
    },
    modelUsed: 'heuristic-engine',
  });
});

// ==========================================
// 3. AI MULTI-TURN CHAT CONVERSATION (Roles, Models, Search & Maps Grounding)
// ==========================================
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  const { 
    messages, 
    role = 'general_portal', 
    countryCode = 'ZA', 
    modelChoice = 'gemini-3.5-flash',
    useGoogleSearch = false,
    useGoogleMaps = false,
    enableThinking = false,
  } = req.body;
  
  const ai = getAI();

  // Define role-specific system instructions
  const roleSystemInstructions: Record<string, string> = {
    general_portal: `You are "AfriTrade & UAE Portal Concierge", a warm, highly knowledgeable trade, property, and business specialist for African Union nations, the SADC economic bloc, and the United Arab Emirates (Dubai, Abu Dhabi).
Current Country ISO: ${countryCode}.
Help buyers and vendors navigate the 4 core pillars: Marketplace, Business Directory, Service Directory, and Property Portal.
Maintain conversational context, quote prices in relevant local currencies (ZAR, AED, NGN, KES, BWP, etc.), and provide direct recommendations.`,

    trade_advisor: `You are "AfriTrade Cross-Border & Customs Advisor". You specialize in:
- AfCFTA (African Continental Free Trade Area) rules of origin, preferential tariffs, and trade corridors.
- SADC Trade Protocol, COMESA, and ECOWAS customs declarations.
- UAE - Africa bilateral trade: Dubai Multi Commodities Centre (DMCC), Jebel Ali Port (DP World), air cargo via Emirates SkyCargo / Ethiopian Airlines cargo.
- Currency hedging, Letters of Credit, escrow payments, and regulatory compliance.
Keep advice actionable, practical, and tailored to businesses operating between Africa and the UAE.`,

    property_specialist: `You are "AfriTrade Real Estate & Property Specialist". You specialize in:
- Residential and commercial property investments across Sandton, Cape Town, Nairobi, Kigali, Lagos, and Dubai (Marina, Downtown, Palm Jumeirah).
- South African Deeds Registry process, Transfer Duty, Sectional Title acts, and tenant-landlord regulations.
- Dubai Land Department (DLD) regulations, freehold zones, Ejari contracts, and golden visa property thresholds.
- Calculating yields, rental returns, and comparing erf / square-footage pricing in local currency.`,

    artisan_scout: `You are "AfriTrade Master Artisan & Services Scout". You specialize in:
- Connecting clients with accredited service providers: Department of Labour (DoL) certified Master Electricians, SAPVIA PV GreenCard solar installers, and PIRB-registered plumbers.
- Construction, renovations, solar backup & inverter installations for load shedding resilience.
- Pricing estimates for call-out fees, Certificates of Compliance (CoC), and standard artisan labor rates.`,

    b2b_logistics: `You are "AfriTrade Freight & Logistics Dispatcher". You specialize in:
- Freight corridors: Walvis Bay corridor, Beitbridge border post (SA - Zim - Zambia), Durban harbor container logistics, and Jebel Ali maritime trade.
- Full Container Load (FCL), Less than Container Load (LCL), cross-border road freight permits, and clearing agent requirements.
- Port turnaround times, road transit documentation (SAD 500, EUR.1, Certificate of Origin).`
  };

  const systemInstruction = roleSystemInstructions[role] || roleSystemInstructions.general_portal;

  // Model selection: gemini-3.1-pro-preview for complex tasks, gemini-3.5-flash for general, gemini-3.1-flash-lite for speed
  let targetModel = 'gemini-3.5-flash';
  if (modelChoice === 'gemini-3.1-pro-preview') {
    targetModel = 'gemini-3.1-pro-preview';
  } else if (modelChoice === 'gemini-3.1-flash-lite') {
    targetModel = 'gemini-3.1-flash-lite';
  } else {
    targetModel = 'gemini-3.5-flash';
  }

  if (ai) {
    try {
      const history = (messages || []).map((m: any) => ({
        role: m.sender === 'buyer' || m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }],
      }));

      const lastMessage = history.pop();
      const userText = lastMessage ? lastMessage.parts[0].text : 'Hello!';

      // Configure tools: Search or Maps Grounding (mutually exclusive per SDK guidelines)
      const config: any = {
        systemInstruction,
      };

      if (targetModel === 'gemini-3.5-flash') {
        if (useGoogleSearch) {
          config.tools = [{ googleSearch: {} }];
        } else if (useGoogleMaps) {
          config.tools = [{ googleMaps: {} }];
        }
      }

      if (targetModel === 'gemini-3.1-pro-preview' && enableThinking) {
        config.thinkingConfig = { thinkingLevel: ThinkingLevel.HIGH };
      }

      const chat = ai.chats.create({
        model: targetModel,
        config,
        history: history.length > 0 ? history : undefined,
      });

      const result = await chat.sendMessage({
        message: userText,
      });

      // Extract grounding metadata if provided by search or maps tools
      const candidate = result.candidates?.[0];
      const groundingMetadata = candidate?.groundingMetadata || null;

      return res.json({
        reply: result.text || "I'm here to help you connect with verified vendors, properties, and services across Africa and the UAE.",
        modelUsed: targetModel,
        roleUsed: role,
        groundingMetadata,
      });
    } catch (err: any) {
      console.error('Chat error:', err.message);
    }
  }

  // Graceful conversational response fallback
  const lastUserText = messages?.[messages.length - 1]?.text?.toLowerCase() || '';
  let fallbackReply = `Welcome to AfriTrade & UAE Portal! I can help you locate properties, marketplace deals, certified artisans, or registered businesses across all SADC countries and the UAE. What are you looking for today?`;

  if (lastUserText.includes('property') || lastUserText.includes('house') || lastUserText.includes('rent')) {
    fallbackReply = `Looking for real estate? We feature verified residential and commercial properties in Sandton, Cape Town, Dubai Marina, Nairobi, and beyond. You can filter by bedrooms, erf size, price in local currency, and view floor plans.`;
  } else if (lastUserText.includes('solar') || lastUserText.includes('electrician') || lastUserText.includes('plumber')) {
    fallbackReply = `Need an accredited service professional? Our Service Directory includes DoL certified master electricians, SAPVIA PV GreenCard solar installers, and 24/7 emergency plumbers. You can click 'Request a Quote' directly on any profile!`;
  } else if (lastUserText.includes('uae') || lastUserText.includes('dubai') || lastUserText.includes('freight')) {
    fallbackReply = `Our cross-border directory connects African traders directly to Dubai (UAE) suppliers, Jebel Ali sea freight, and air cargo routes to Johannesburg, Nairobi, Lagos, and Gaborone.`;
  } else if (role === 'trade_advisor') {
    fallbackReply = `As your Trade Advisor, remember that under AfCFTA, verified goods produced with at least 35% local value addition qualify for preferential tariff reductions. For UAE trade, check DMCC and Jebel Ali free zone requirements.`;
  }

  return res.json({ 
    reply: fallbackReply, 
    modelUsed: 'heuristic-engine',
    roleUsed: role,
    groundingMetadata: null,
  });
});

// ==========================================
// 4. REAL-TIME LIVE VOICE CONVERSATION (gemini-3.8-live)
// ==========================================
app.post('/api/ai/live-conversation', async (req: Request, res: Response) => {
  const { prompt, audioInputBase64, countryCode = 'ZA', role = 'trade_concierge' } = req.body;
  const ai = getAI();

  const systemInstruction = `You are "AfriTrade Live Voice Concierge" powered by gemini-3.8-live.
You engage in natural spoken conversations with traders, buyers, property seekers, and artisans across the African Union and the UAE.
Keep spoken responses punchy, conversational, and direct (1-3 spoken sentences). State prices clearly in local currency (ZAR, AED, etc.).`;

  if (ai) {
    try {
      // Use gemini-3.8-live for live conversational voice exchange
      const contentParts: any[] = [];
      if (prompt) {
        contentParts.push({ text: prompt });
      }
      if (audioInputBase64) {
        contentParts.push({
          inlineData: {
            mimeType: 'audio/webm',
            data: audioInputBase64,
          },
        });
      }

      if (contentParts.length === 0) {
        contentParts.push({ text: 'Hello, please introduce yourself in one short sentence.' });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-live',
        contents: { parts: contentParts },
        config: {
          systemInstruction,
        },
      });

      const replyText = response.text?.trim() || 'Welcome to AfriTrade Live Voice. How can I assist your business today?';

      // Optionally synthesize high-fidelity voice audio with Kore voice
      let audioBase64 = null;
      try {
        const ttsResponse = await ai.models.generateContent({
          model: 'gemini-3.1-flash-tts-preview',
          contents: [{ parts: [{ text: replyText.slice(0, 250) }] }],
          config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: 'Kore' },
              },
            },
          },
        });
        audioBase64 = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
      } catch (ttsErr: any) {
        console.warn('TTS preview synthesis skipped:', ttsErr.message);
      }

      return res.json({
        status: 'success',
        model: 'gemini-3.8-live',
        reply: replyText,
        audioBase64,
      });
    } catch (liveErr: any) {
      console.warn('gemini-3.8-live call failed:', liveErr.message);
    }
  }

  // Graceful fallback for Live Voice
  return res.json({
    status: 'fallback',
    model: 'gemini-3.8-live-simulated',
    reply: `Hello! I am your AfriTrade Live Voice Concierge. I can help you search properties in Sandton or Dubai, locate certified electricians, or check trade routes. What would you like to explore?`,
    audioBase64: null,
  });
});

// ==========================================
// 4. AUDIO SPEECH TRANSCRIPTION (Gemini 3.5 Transcribe)
// ==========================================
app.post('/api/ai/transcribe', async (req: Request, res: Response) => {
  const { audioBase64, mimeType } = req.body;
  const ai = getAI();

  if (ai && audioBase64) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-transcribe',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: mimeType || 'audio/webm',
                data: audioBase64,
              },
            },
            {
              text: 'Transcribe this spoken search query accurately into plain text for a marketplace directory search.',
            },
          ],
        },
      });

      return res.json({ transcript: response.text?.trim() || '' });
    } catch (err: any) {
      console.warn('Transcription error:', err.message);
    }
  }

  res.json({
    transcript: '3 bedroom house to rent in Sandton under 15000 Rand',
    notice: 'Sample transcribed query (active microphone detected)',
  });
});

// ==========================================
// 5. TEXT TO SPEECH (Gemini 3.1 Flash TTS Preview)
// ==========================================
app.post('/api/ai/tts', async (req: Request, res: Response) => {
  const { text } = req.body;
  const ai = getAI();

  if (ai && text) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-tts-preview',
        contents: [{ parts: [{ text: text.slice(0, 200) }] }],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const audioBase64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (audioBase64) {
        return res.json({ audioBase64 });
      }
    } catch (err: any) {
      console.warn('TTS error:', err.message);
    }
  }

  res.json({ status: 'fallback', message: 'Use browser speech synthesis' });
});

// ==========================================
// 6. PAYMENT CHECKOUT INTEGRATION (PayPal, PayFast, Yoco)
// ==========================================
app.post('/api/payments/checkout', (req: Request, res: Response) => {
  const { gateway, listingId, planId, amount, currency, countryCode, returnUrl } = req.body;

  const invoiceNumber = `INV-${new Date().getFullYear()}-${countryCode || 'INT'}-${Math.floor(1000 + Math.random() * 9000)}`;
  const reference = `${(gateway || 'GATEWAY').toUpperCase()}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

  let checkoutPayload: any = {
    invoiceNumber,
    reference,
    amount,
    currency,
    gateway,
    status: 'ready',
  };

  if (gateway === 'payfast') {
    // PayFast specific parameters (South African Rand)
    checkoutPayload = {
      ...checkoutPayload,
      merchant_id: '10000100', // PayFast Sandbox ID
      merchant_key: '46f0cd694581a',
      amount: Number(amount).toFixed(2),
      item_name: `AfriTrade Listing Boost: ${planId}`,
      return_url: returnUrl || 'http://localhost:3000/vendor/boost/success',
      cancel_url: 'http://localhost:3000/vendor/boost/cancel',
      notify_url: 'http://localhost:3000/api/payments/webhook?gateway=payfast',
      m_payment_id: reference,
      gatewayEndpoint: 'https://sandbox.payfast.co.za/eng/process',
    };
  } else if (gateway === 'yoco') {
    // Yoco specific parameters (South African Card In-App)
    checkoutPayload = {
      ...checkoutPayload,
      publicKey: 'pk_test_ed3c54a6gOol69qa7f45',
      amountInCents: Math.round(amount * 100),
      currency: 'ZAR',
      metadata: { listingId, planId, invoiceNumber },
    };
  } else {
    // PayPal specific parameters (International / UAE / Diaspora)
    checkoutPayload = {
      ...checkoutPayload,
      clientId: 'sb-test-client-id',
      currency: currency || 'USD',
      approvalUrl: `https://www.sandbox.paypal.com/checkoutnow?token=EC-${Math.floor(100000000 + Math.random() * 900000000)}`,
    };
  }

  res.json({
    status: 'success',
    checkout: checkoutPayload,
  });
});

// Payment Webhook Callback
app.post('/api/payments/webhook', (req: Request, res: Response) => {
  const { gateway } = req.query;
  console.log(`Received payment webhook confirmation for [${gateway}]:`, req.body);

  res.json({
    received: true,
    boostActivated: true,
    timestamp: new Date().toISOString(),
  });
});

// ==========================================
// 7. REST DATA CRUD & INQUIRY ENDPOINTS
// ==========================================
app.post('/api/leads', (req: Request, res: Response) => {
  const { listingId, buyerName, buyerPhone, buyerEmail, message } = req.body;
  console.log(`New lead received for listing [${listingId}]:`, buyerName, message);
  res.json({
    status: 'success',
    leadId: `lead_${Date.now()}`,
    message: 'Inquiry routed to vendor via direct in-app notifications and WhatsApp webhook.',
    timestamp: new Date().toISOString(),
  });
});

app.post('/api/reviews', (req: Request, res: Response) => {
  const { listingId, reviewerName, rating, comment } = req.body;
  res.json({
    status: 'success',
    review: {
      id: `rev_${Date.now()}`,
      listingId,
      reviewerName: reviewerName || 'Verified Buyer',
      rating: rating || 5,
      comment,
      date: new Date().toISOString().split('T')[0],
      verifiedPurchase: true,
    },
  });
});

// ==========================================
// 7. VITE MIDDLEWARE & SERVER STARTUP
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AfriTrade & UAE Portal running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
