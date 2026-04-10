type CapItem = {
  id: number | string
  title: string
  category: string
  action: string
}

type ESGMappingResult = {
  id: number | string
  documentType: string
  sourceType: "INTERNAL" | "EXTERNAL"
  reasoning: string
  confidence: number
}

export async function mapESGItems({
  items,
  apiKey
}: {
  items: CapItem[]
  apiKey: string
}): Promise<ESGMappingResult[]> {

  const systemPrompt = `
  You are an ESG compliance expert.
  
  Your task is to map ESG Corrective Action Plan (CAP) items to the most relevant policy or document.
  
  Guidelines:
  1. Use real-world ESG standards (India/global)
  2. Prefer known documents like:
     - POSH Policy
     - Occupational Health and Safety (OHS) Policy
     - Environmental Policy
     - GHG Emissions Report
     - BRSR Report
     - Code of Conduct
     - Waste Management Policy
     - Energy Management Policy
  
  3. Classify:
     - INTERNAL → company-created
     - EXTERNAL → regulatory/reporting
  
  4. Ensure consistency across similar items
  5. Do not hallucinate uncommon names
  
  Return strictly JSON:
  {
    "results": [
      {
        "id": string | number,
        "documentType": string,
        "sourceType": "INTERNAL" | "EXTERNAL",
        "reasoning": string,
        "confidence": number
      }
    ]
  }
  `

  const userPrompt = JSON.stringify({ items })

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" }
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`AI Error ${response.status}: ${errorText}`)
  }

  const data = await response.json()

  let parsed
  try {
    parsed = JSON.parse(data.choices[0].message.content)
  } catch (e) {
    throw new Error("Invalid JSON from AI")
  }

  return parsed.results || []
}