import { GoogleGenerativeAI } from '@google/generative-ai';

export interface GeminiReceiptResult {
  date: string | null;
  business: string | null;
  amount: number | null;
  vat: number | null;
  payment_method: string | null;
}

const PROMPT = `Du bist ein OCR-Assistent für Belege einer Schweizer Schreinerei.
Analysiere das Bild und extrahiere die folgenden Felder als JSON.
Antworte NUR mit validem JSON, ohne Markdown-Codeblöcke, ohne Erklärungen.

Felder:
- date: Datum des Belegs im Format DD-MM-YYYY (null wenn nicht erkennbar)
- business: Name des Geschäfts oder Lieferanten (null wenn nicht erkennbar)
- amount: Gesamtbetrag in CHF als Dezimalzahl ohne Währungssymbol (null wenn nicht erkennbar)
- vat: MwSt-Satz als Dezimalzahl in Prozent, z.B. 8.1 für 8.1% oder 2.6 für 2.6% (null wenn nicht erkennbar)
- payment_method: Zahlungsart als einer dieser Werte: "Bar", "Karte", "Twint", "Bank" (null wenn nicht erkennbar)

Beispielantwort:
{"date":"15-03-2026","business":"Holzhandel Mayer GmbH","amount":142.80,"vat":8.1,"payment_method":"karte"}`;

export async function callGeminiOCR(
  base64: string,
  mimeType: string
): Promise<GeminiReceiptResult> {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Gemini API key is not configured.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
    },
  });

  const result = await model.generateContent([
    PROMPT,
    {
      inlineData: {
        data: base64,
        mimeType,
      },
    },
  ]);

  const text = result.response.text();
  const parsed = JSON.parse(text) as GeminiReceiptResult;
  return parsed;
}
