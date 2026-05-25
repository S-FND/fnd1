import React, { useEffect,useState } from 'react';
import { Table, TableBody } from "@/components/ui/table";
import { ESGCapItem } from '../../types/esgDD';
import { ESGCapTableHeader } from './ESGCapTableHeader';
import { ESGCapTableRow } from './ESGCapTableRow';
import { ESGCapEmptyState } from './ESGCapEmptyState';
import { ESGCapScoring } from './ESGCapScoring';
import { mapESGItems } from './mapESGItems';
import { httpClient } from '@/lib/httpClient';
import { Button } from "@/components/ui/button";
import { Columns } from "lucide-react";
interface ESGCapTableProps {
  sortedItems: ESGCapItem[];
  sortConfig: { key: keyof ESGCapItem; direction: 'asc' | 'desc' } | null;
  requestSort: (key: keyof ESGCapItem) => void;
  onItemUpdate?: (updatedItem: ESGCapItem) => void;
  buttonEnabled?: boolean;
  setReloadData?: (reload: boolean) => void;
  finalPlan?:boolean
}

export const ESGCapTable: React.FC<ESGCapTableProps> = ({
  sortedItems,
  sortConfig,
  requestSort,
  onItemUpdate,
  buttonEnabled,
  setReloadData,
  finalPlan
}
) => {

  const handleMap = async (sortedItems) => {
    try {
      const result = await mapESGItems({
        items: sortedItems.map((i: ESGCapItem) =>
        ({
          id: i.id,
          "title": i.item,
          "category": i.category,
          "action": i.measures
        })
        ),
        apiKey: process.env.REACT_APP_LOVABLE_API_KEY!
      })

      console.log("Mapped:", result)
    } catch (err) {
      console.error(err)
    }
  };

  useEffect(() => {

  }, [sortedItems])

  type ClassificationInput = {
    id: string;
    item: string;
    action: string;
    category: string;
  };

  const buildHFClassificationPromptBatch = (
    inputs: ClassificationInput[]
  ): string => {
    const enrichedInputs = inputs.map((item, index) => ({
      ...item,
      _index: index,
    }));
    const formattedItems = JSON.stringify(enrichedInputs);
    //   inputs
    //     .map(
    //       (i) => `
    // id: ${i.id}
    // item: ${i.item}
    // action: ${i.action}
    // category: ${i.category}
    // `
    //     )
    //     .join('\n');
    console.log('formattedItems', formattedItems)
    //     return `<s>[INST]
    //   You are an ESG compliance and corporate governance expert.

    //   Your task is to analyze multiple ESG Corrective Action Plan (CAP) items and determine the most appropriate policy or document required for each.

    //   Instructions:

    //   1. For EACH item, identify the MOST RELEVANT real-world corporate document or policy.
    //   2. Do NOT rely on predefined examples. Use your own reasoning based on ESG standards and corporate governance practices.
    //   3. The document must be realistic and professionally named.
    //   4. Classify each document as:
    //      - INTERNAL → internal processes, employee policies, training, operations
    //      - EXTERNAL → regulatory filings, disclosures, external reporting
    //   5. Avoid vague names like "General Policy".
    //   6. Maintain consistency across similar items.
    //   7. Do NOT hallucinate unrealistic or niche document names.

    //   Return STRICTLY a JSON array (no extra text):

    //   [
    //     {
    //       "id": string,
    //       "documentType": string,
    //       "sourceType": "internal" | "external",
    //       "reasoning": string,
    //       "confidence": number
    //     }
    //   ]


    //   CRITICAL RULE:
    // - You MUST return the EXACT same "id" from input
    // - Do NOT modify, rename, or generate new ids
    // - Do NOT skip any id
    // - Output count MUST match input count
    // - Each output object must map 1:1 with input item

    //   Confidence must be between 0 and 1.

    //   Items:
    //   ${formattedItems}

    //   [/INST]`;
    return `<s>[INST]
You are an ESG compliance and corporate governance expert.

Your task is to analyze ESG CAP items and assign the most relevant corporate document.

Rules:
- Use realistic corporate policy names
- INTERNAL = internal operations/policies
- EXTERNAL = disclosures/reporting
- Avoid vague names
- Maintain consistency

CRITICAL:
- You MUST return BOTH "id" and "_index" exactly as provided
- Do NOT modify them

Return STRICT JSON array:
[
  {
    "id": string,
    "_index": number,
    "documentType": string,
    "sourceType": "internal" | "external",
    "reasoning": string,
    "confidence": number
  }
]

CRITICAL RULES:
- Return EXACT same "id"
- Do NOT modify ids
- Do NOT skip any item
- Output count MUST equal input count
- NEVER return empty array
- ALWAYS return at least one object per input
- If unsure, still generate the BEST possible answer for each item.

Items (JSON):
${formattedItems}

[/INST]`;
  };

  // const validateLovableApi = async () => {
  //   debugger;
  //   try {
  //     const res = await fetch(
  //       "https://eujdxsmmblgfdfskzgpg.supabase.co/functions/v1/refine-policy",
  //       {
  //         method: "POST", // ❗ REQUIRED
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
  //         },
  //         body: JSON.stringify({
  //           policyContent: `Disclosure Policy

  // 1. Purpose
  // [This section will contain details about purpose]

  // 2. Scope
  // [This section will contain details about scope]

  // 3. Laws and Regulations
  // [This section will contain details about laws and regulations]

  // 4. Roles and Responsibility
  // [This section will contain details about roles and responsibility]

  // 5. Types of Disclosures
  // [This section will contain details about types of disclosures]

  // 6. Timing and Frequency
  // [This section will contain details about timing and frequency]

  // 7. Confidentiality and Data Protection
  // [This section will contain details about confidentiality and data protection]

  // 8. External Communications
  // [This section will contain details about external communications]

  // 9. Internal Communications
  // [This section will contain details about internal communications]

  // 10. Training
  // [This section will contain details about training]

  // 11. Enforcement and Consequences
  // [This section will contain details about enforcement and consequences]

  // 12. Policy Review
  // [This section will contain details about policy review]

  // 13. Disciplinary Actions
  // [This section will contain details about disciplinary actions]`,
  //           companyData: {
  //             companyName: "Bhardwaj",
  //             preparedBy: "Abhishek Raj",
  //             place: "Delhi",
  //             officeAddress:
  //               "At+post-Dumari,Dist-Vaishali,Bihar",
  //           },
  //           documentType: "Policy",
  //         }),
  //       }
  //     );

  //     const data = await res.json();

  //     console.log("Response =>", data);
  //     return data;
  //   } catch (error) {
  //     console.error("Error =>", error);
  //     throw error;
  //   }
  // };
  const sanitizeESGItems = (items: ESGCapItem[]) => {
    return items.map((item, index) => ({
      id: String(item.id ?? index),
      item: cleanText(item.item),
      action: cleanText(item.measures),
      category: cleanText(item.category),
    }));
  };

  const cleanText = (text?: string) => {
    return (text || "")
      .replace(/\s+/g, " ")   // remove extra spaces
      .trim()
      .slice(0, 300);         // prevent very long inputs
  };

  const generate = async () => {
    let res = await httpClient.post('ai/generate',
      {
        provider: 'huggingface',
        model: "mistralai/Mistral-7B-Instruct-v0.2",
        prompt: buildHFClassificationPromptBatch(sanitizeESGItems(sortedItems)),
        items: sortedItems
      }
    );
    console.log("res", res)
  }
  useEffect(() => {
    // validateLovableApi()
    // generate()
  }, [sortedItems])

  const [showFullColumns, setShowFullColumns] = useState(false);

  return (
    <div className="space-y-6">
      {/* Toggle Button */}
      {/* <div className="flex items-center gap-2 my-1 ml-2">
          <Button
            variant={showFullColumns ? "default" : "outline"}
            size="sm"
            onClick={() => setShowFullColumns(!showFullColumns)}
          >
            <Columns className="h-4 w-4 mr-2" />
            {showFullColumns ? "Show Compact View" : "Show All Columns"}
          </Button>
        </div> */}
      <div className="rounded-md border overflow-hidden">
        <Table>
          <ESGCapTableHeader
            sortConfig={sortConfig}
            requestSort={requestSort}
            compact={!showFullColumns}
          />
          <TableBody>
            {sortedItems.map((item, index) => (
              <ESGCapTableRow
                key={item.id ?? `row-${index}`}
                item={item}
                index={index}
                onUpdate={onItemUpdate}
                buttonEnabled={buttonEnabled}
                setReloadData={setReloadData}
                compact={!showFullColumns}
                finalPlan={finalPlan}
              />
            ))}

            {sortedItems.length === 0 && <ESGCapEmptyState />}
          </TableBody>
        </Table>
      </div>

      {/* {sortedItems.length > 0 && <ESGCapScoring items={sortedItems} />} */}
    </div>
  );
};