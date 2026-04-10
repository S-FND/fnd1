import {
  Document,
  Paragraph,
  TextRun,
  AlignmentType,
  HeadingLevel,
  Footer,
  PageNumber,
  NumberFormat,
  ImageRun,
} from "docx";
import { saveAs } from "file-saver";
import { PolicyTemplate } from "@/data/policyTemplates";

interface TemplateMetadata {
  companyName: string;
  preparedBy: string;
  place: string;
  officeAddress: string;
  logoDataUrl?: string;
}

export async function generatePolicyDocument(
  policy: PolicyTemplate,
  metadata: TemplateMetadata
) {
  const sections = [];

  // Create header with logo placeholder and company details
  const headerParagraphs: Paragraph[] = [];

  if (metadata.logoDataUrl) {
    try {
      // Convert data URL to array buffer
      const base64Data = metadata.logoDataUrl.split(',')[1];
      const binaryData = atob(base64Data);
      const bytes = new Uint8Array(binaryData.length);
      for (let i = 0; i < binaryData.length; i++) {
        bytes[i] = binaryData.charCodeAt(i);
      }
      
      headerParagraphs.push(
        new Paragraph({
          children: [
            new ImageRun({
              data: bytes.buffer,
              transformation: {
                width: 100,
                height: 100,
              },
              type: "png",
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
        })
      );
    } catch (error) {
      console.error("Error processing logo:", error);
    }
  } else {
    headerParagraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "[COMPANY LOGO]",
            bold: true,
            size: 24,
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      })
    );
  }

  headerParagraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: metadata.companyName || "[COMPANY NAME]",
          bold: true,
          size: 32,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: metadata.officeAddress || "[OFFICE ADDRESS]",
          size: 20,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: policy.name,
          bold: true,
          size: 36,
        }),
      ],
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: "Prepared by: ",
          bold: true,
          size: 22,
        }),
        new TextRun({
          text: metadata.preparedBy || "[PREPARED BY]",
          size: 22,
        }),
      ],
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: "Place: ",
          bold: true,
          size: 22,
        }),
        new TextRun({
          text: metadata.place || "[PLACE]",
          size: 22,
        }),
      ],
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: "Date: ",
          bold: true,
          size: 22,
        }),
        new TextRun({
          text: new Date().toLocaleDateString("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          size: 22,
        }),
      ],
      spacing: { after: 400 },
    }),
    new Paragraph({
      text: "",
      pageBreakBefore: true,
    })
  );

  // Add section content
  const contentParagraphs: Paragraph[] = [];
  
  policy.sections.forEach((section, index) => {
    // Section heading
    contentParagraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `${index + 1}. ${section}`,
            bold: true,
            size: 28,
          }),
        ],
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 200 },
      })
    );

    // Placeholder content
    contentParagraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `[Please provide detailed information for ${section}]`,
            italics: true,
            size: 22,
          }),
        ],
        spacing: { after: 300 },
      }),
      new Paragraph({
        text: "",
        spacing: { after: 200 },
      })
    );
  });

  // Create footer with page numbers and confidentiality notice
  const footer = new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            children: ["Page ", PageNumber.CURRENT, " of ", PageNumber.TOTAL_PAGES],
            size: 18,
          }),
        ],
        spacing: { before: 100 },
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: `Confidential document. For intended use of "${metadata.companyName || "[COMPANY NAME]"}" only.`,
            size: 18,
            italics: true,
          }),
        ],
        spacing: { before: 50, after: 100 },
      }),
    ],
  });

  // Create the document
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
            pageNumbers: {
              start: 1,
              formatType: NumberFormat.DECIMAL,
            },
          },
        },
        footers: {
          default: footer,
        },
        children: [...headerParagraphs, ...contentParagraphs],
      },
    ],
  });

  return doc;
}

export async function downloadPolicyTemplate(
  policy: PolicyTemplate,
  metadata: TemplateMetadata
) {
  try {
    const doc = await generatePolicyDocument(policy, metadata);
    const blob = await import("docx").then((docx) => docx.Packer.toBlob(doc));
    
    const fileName = `${policy.name.replace(/[^a-z0-9]/gi, "_")}_${metadata.companyName?.replace(/[^a-z0-9]/gi, "_") || "Template"}.docx`;
    saveAs(blob, fileName);
  } catch (error) {
    console.error("Error generating policy document:", error);
    throw error;
  }
}
