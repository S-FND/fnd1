// import {
//   Document,
//   Paragraph,
//   TextRun,
//   AlignmentType,
//   HeadingLevel,
//   Footer,
//   PageNumber,
//   NumberFormat,
//   ImageRun,
// } from "docx";
// import { saveAs } from "file-saver";
// import { PolicyTemplate } from "@/data/policyTemplates";

// interface TemplateMetadata {
//   companyName: string;
//   preparedBy: string;
//   place: string;
//   officeAddress: string;
//   logoDataUrl?: string;
// }

// export async function generatePolicyDocument(
//   policy: PolicyTemplate,
//   metadata: TemplateMetadata
// ) {
//   const sections = [];

//   // Create header with logo placeholder and company details
//   const headerParagraphs: Paragraph[] = [];

//   if (metadata.logoDataUrl) {
//     try {
//       // Convert data URL to array buffer
//       const base64Data = metadata.logoDataUrl.split(',')[1];
//       const binaryData = atob(base64Data);
//       const bytes = new Uint8Array(binaryData.length);
//       for (let i = 0; i < binaryData.length; i++) {
//         bytes[i] = binaryData.charCodeAt(i);
//       }

//       headerParagraphs.push(
//         new Paragraph({
//           children: [
//             new ImageRun({
//               data: bytes.buffer,
//               transformation: {
//                 width: 100,
//                 height: 100,
//               },
//               type: "png",
//             }),
//           ],
//           alignment: AlignmentType.CENTER,
//           spacing: { after: 200 },
//         })
//       );
//     } catch (error) {
//       console.error("Error processing logo:", error);
//     }
//   } else {
//     headerParagraphs.push(
//       new Paragraph({
//         children: [
//           new TextRun({
//             text: "[COMPANY LOGO]",
//             bold: true,
//             size: 24,
//           }),
//         ],
//         alignment: AlignmentType.CENTER,
//         spacing: { after: 200 },
//       })
//     );
//   }

//   headerParagraphs.push(
//     new Paragraph({
//       children: [
//         new TextRun({
//           text: metadata.companyName || "[COMPANY NAME]",
//           bold: true,
//           size: 32,
//         }),
//       ],
//       alignment: AlignmentType.CENTER,
//       spacing: { after: 100 },
//     }),
//     new Paragraph({
//       children: [
//         new TextRun({
//           text: metadata.officeAddress || "[OFFICE ADDRESS]",
//           size: 20,
//         }),
//       ],
//       alignment: AlignmentType.CENTER,
//       spacing: { after: 400 },
//     }),
//     new Paragraph({
//       children: [
//         new TextRun({
//           text: policy.name,
//           bold: true,
//           size: 36,
//         }),
//       ],
//       heading: HeadingLevel.TITLE,
//       alignment: AlignmentType.CENTER,
//       spacing: { after: 400 },
//     }),
//     new Paragraph({
//       children: [
//         new TextRun({
//           text: "Prepared by: ",
//           bold: true,
//           size: 22,
//         }),
//         new TextRun({
//           text: metadata.preparedBy || "[PREPARED BY]",
//           size: 22,
//         }),
//       ],
//       spacing: { after: 100 },
//     }),
//     new Paragraph({
//       children: [
//         new TextRun({
//           text: "Place: ",
//           bold: true,
//           size: 22,
//         }),
//         new TextRun({
//           text: metadata.place || "[PLACE]",
//           size: 22,
//         }),
//       ],
//       spacing: { after: 100 },
//     }),
//     new Paragraph({
//       children: [
//         new TextRun({
//           text: "Date: ",
//           bold: true,
//           size: 22,
//         }),
//         new TextRun({
//           text: new Date().toLocaleDateString("en-IN", {
//             year: "numeric",
//             month: "long",
//             day: "numeric",
//           }),
//           size: 22,
//         }),
//       ],
//       spacing: { after: 400 },
//     }),
//     new Paragraph({
//       text: "",
//       pageBreakBefore: true,
//     })
//   );

//   // Add section content
//   const contentParagraphs: Paragraph[] = [];

//   policy.sections.forEach((section, index) => {
//     // Section heading
//     contentParagraphs.push(
//       new Paragraph({
//         children: [
//           new TextRun({
//             text: `${index + 1}. ${section}`,
//             bold: true,
//             size: 28,
//           }),
//         ],
//         heading: HeadingLevel.HEADING_1,
//         spacing: { before: 300, after: 200 },
//       })
//     );

//     // Placeholder content
//     contentParagraphs.push(
//       new Paragraph({
//         children: [
//           new TextRun({
//             text: `[Please provide detailed information for ${section}]`,
//             italics: true,
//             size: 22,
//           }),
//         ],
//         spacing: { after: 300 },
//       }),
//       new Paragraph({
//         text: "",
//         spacing: { after: 200 },
//       })
//     );
//   });

//   // Create footer with page numbers and confidentiality notice
//   const footer = new Footer({
//     children: [
//       new Paragraph({
//         alignment: AlignmentType.CENTER,
//         children: [
//           new TextRun({
//             children: ["Page ", PageNumber.CURRENT, " of ", PageNumber.TOTAL_PAGES],
//             size: 18,
//           }),
//         ],
//         spacing: { before: 100 },
//       }),
//       new Paragraph({
//         alignment: AlignmentType.CENTER,
//         children: [
//           new TextRun({
//             text: `Confidential document. For intended use of "${metadata.companyName || "[COMPANY NAME]"}" only.`,
//             size: 18,
//             italics: true,
//           }),
//         ],
//         spacing: { before: 50, after: 100 },
//       }),
//     ],
//   });

//   // Create the document
//   const doc = new Document({
//     sections: [
//       {
//         properties: {
//           page: {
//             margin: {
//               top: 1440, // 1 inch
//               right: 1440,
//               bottom: 1440,
//               left: 1440,
//             },
//             pageNumbers: {
//               start: 1,
//               formatType: NumberFormat.DECIMAL,
//             },
//           },
//         },
//         footers: {
//           default: footer,
//         },
//         children: [...headerParagraphs, ...contentParagraphs],
//       },
//     ],
//   });

//   return doc;
// }

// export async function downloadPolicyTemplate(
//   policy: PolicyTemplate,
//   metadata: TemplateMetadata
// ) {
//   try {
//     const doc = await generatePolicyDocument(policy, metadata);
//     const blob = await import("docx").then((docx) => docx.Packer.toBlob(doc));

//     const fileName = `${policy.name.replace(/[^a-z0-9]/gi, "_")}_${metadata.companyName?.replace(/[^a-z0-9]/gi, "_") || "Template"}.docx`;
//     saveAs(blob, fileName);
//   } catch (error) {
//     console.error("Error generating policy document:", error);
//     throw error;
//   }
// }

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
  Packer,
} from "docx";
import { saveAs } from "file-saver";

interface TemplateMetadata {
  companyName: string;
  preparedBy: string;
  place: string;
  officeAddress: string;
  logoDataUrl?: string;
}

interface Section {
  title: string;
  content: string;
}

function formatLabel(str: string) {
  return str
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function generatePolicyDocumentFromArray(
  documentName: string,
  sections: Section[],
  metadata: TemplateMetadata
) {
  const headerParagraphs: Paragraph[] = [];

  // ✅ ROBUST LOGO HANDLING
  // if (metadata.logoDataUrl) {
  //   try {
  //     const base64 = metadata.logoDataUrl.split(",")[1];
  //     const binary = atob(base64);
  //     const buffer = new Uint8Array(binary.length);

  //     for (let i = 0; i < binary.length; i++) {
  //       buffer[i] = binary.charCodeAt(i);
  //     }

  //     // headerParagraphs.push(
  //     //   new Paragraph({
  //     //     children: [
  //     //       new ImageRun({
  //     //         data: buffer,
  //     //         transformation: {
  //     //           width: 120, // slightly bigger & cleaner
  //     //           height: 120,
  //     //         },
  //     //       }),
  //     //     ],
  //     //     alignment: AlignmentType.CENTER,
  //     //     spacing: { after: 200 },
  //     //   })
  //     // );

  //     headerParagraphs.push(
  //       new Paragraph({
  //         children: [
  //           new ImageRun({
  //             data: buffer,
  //             transformation: {
  //               width: 120,
  //               height: 120,
  //             },
  //             type: "png", // 🔥 important
  //           }),
  //         ],
  //         alignment: AlignmentType.CENTER,
  //         spacing: { after: 200 },
  //       })
  //     );
  //   } catch (err) {
  //     console.error("Logo parsing failed:", err);
  //   }
  // }

  // ✅ HEADER CONTENT
  // headerParagraphs.push(
  //   new Paragraph({
  //     text: metadata.companyName,
  //     alignment: AlignmentType.CENTER,
  //     spacing: { after: 100 },
  //     children: [new TextRun({ text: metadata.companyName, bold: true, size: 32 })],
  //   }),

  //   new Paragraph({
  //     text: metadata.officeAddress,
  //     alignment: AlignmentType.CENTER,
  //     spacing: { after: 300 },
  //   }),

  //   new Paragraph({
  //     text: documentName,
  //     heading: HeadingLevel.TITLE,
  //     alignment: AlignmentType.CENTER,
  //     spacing: { after: 400 },
  //   }),

  //   new Paragraph({
  //     children: [
  //       new TextRun({ text: "Prepared By: ", bold: true }),
  //       new TextRun(metadata.preparedBy),
  //     ],
  //   }),

  //   new Paragraph({
  //     children: [
  //       new TextRun({ text: "Place: ", bold: true }),
  //       new TextRun(metadata.place),
  //     ],
  //   }),

  //   new Paragraph({
  //     children: [
  //       new TextRun({ text: "Date: ", bold: true }),
  //       new TextRun(new Date().toLocaleDateString()),
  //     ],
  //     spacing: { after: 400 },
  //   }),

  //   new Paragraph({ text: "", pageBreakBefore: true })
  // );

  // const headerParagraphs: Paragraph[] = [];

  // ✅ LOGO (centered, no overlap)
  // if (metadata.logoDataUrl) {
  //   try {
  //     const base64 = metadata.logoDataUrl.split(",")[1];
  //     const binary = atob(base64);
  //     const buffer = new Uint8Array(binary.length);

  //     for (let i = 0; i < binary.length; i++) {
  //       buffer[i] = binary.charCodeAt(i);
  //     }

  //     headerParagraphs.push(
  //       new Paragraph({
  //         children: [
  //           new ImageRun({
  //             data: buffer,
  //             transformation: { width: 120, height: 120 },
  //             type: "png",
  //           }),
  //         ],
  //         alignment: AlignmentType.CENTER,
  //         spacing: { after: 300 },
  //       })
  //     );
  //   } catch (e) {
  //     console.error("Logo error:", e);
  //   }
  // }

  // // ✅ COMPANY NAME (ONLY ONCE, clean)
  // headerParagraphs.push(
  //   new Paragraph({
  //     text: metadata.companyName,
  //     alignment: AlignmentType.CENTER,
  //     children: [
  //       new TextRun({
  //         text: metadata.companyName,
  //         bold: true,
  //         size: 36,
  //       }),
  //     ],
  //     spacing: { after: 100 },
  //   })
  // );

  // // ✅ ADDRESS
  // headerParagraphs.push(
  //   new Paragraph({
  //     text: metadata.officeAddress,
  //     alignment: AlignmentType.CENTER,
  //     spacing: { after: 400 },
  //   })
  // );

  // // ✅ DOCUMENT TITLE (BIG + CLEAN)
  // headerParagraphs.push(
  //   new Paragraph({
  //     text: documentName,
  //     alignment: AlignmentType.CENTER,
  //     children: [
  //       new TextRun({
  //         text: documentName,
  //         bold: true,
  //         size: 48, // 🔥 bigger
  //       }),
  //     ],
  //     spacing: { after: 500 },
  //   })
  // );

  // // ✅ META INFO (LEFT ALIGNED)
  // headerParagraphs.push(
  //   new Paragraph({
  //     children: [
  //       new TextRun({ text: "Prepared By: ", bold: true }),
  //       new TextRun(metadata.preparedBy),
  //     ],
  //     spacing: { after: 100 },
  //   }),

  //   new Paragraph({
  //     children: [
  //       new TextRun({ text: "Place: ", bold: true }),
  //       new TextRun(metadata.place),
  //     ],
  //     spacing: { after: 100 },
  //   }),

  //   new Paragraph({
  //     children: [
  //       new TextRun({ text: "Date: ", bold: true }),
  //       new TextRun(new Date().toLocaleDateString()),
  //     ],
  //     spacing: { after: 400 },
  //   })
  // );

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
          text: documentName,
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


  // ✅ PAGE BREAK AFTER COVER
  // headerParagraphs.push(
  //   new Paragraph({
  //     text: "",
  //     pageBreakBefore: true,
  //   })
  // );

  // ✅ CONTENT
  const contentParagraphs: Paragraph[] = [];

  sections.forEach((section, index) => {
    // Heading
    contentParagraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `${index + 1}. ${section.title}`,
            bold: true,
            size: 28,
          }),
        ],
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 200 },
      })
    );

    const lines = section.content.split("\n").filter(Boolean);

    lines.forEach((line) => {
      let cleanLine = line.trim();

      // ✅ Bold handling (**text**)
      const parts = cleanLine.split(/(\*\*.*?\*\*)/g).filter(Boolean);

      const textRuns = parts.map((part) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return new TextRun({
            text: part.replace(/\*\*/g, ""),
            bold: true,
          });
        }
        return new TextRun(part);
      });

      // ✅ Bullet detection
      const isBullet = /^-\s+/.test(cleanLine);

      contentParagraphs.push(
        new Paragraph({
          children: textRuns,
          bullet: isBullet ? { level: 0 } : undefined,
          spacing: { after: 100 },
        })
      );
    });
  });

  // ✅ FOOTER (UNCHANGED BUT CLEANED)
  const footer = new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            children: ["Page ", PageNumber.CURRENT, " of ", PageNumber.TOTAL_PAGES],
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: `Confidential - ${metadata.companyName}`,
            italics: true,
          }),
        ],
      }),
    ],
  });

  return new Document({
    sections: [
      {
        footers: { default: footer },
        children: [...headerParagraphs, ...contentParagraphs],
      },
    ],
  });
}

export async function downloadPolicyDocument(
  documentName: string,
  sections: Section[],
  metadata: TemplateMetadata
) {
  try {
    const doc = await generatePolicyDocumentFromArray(
      documentName,
      sections,
      metadata
    );

    const blob = await Packer.toBlob(doc);

    const fileName = `${documentName.replace(/[^a-z0-9]/gi, "_")}_${metadata.companyName.replace(/[^a-z0-9]/gi, "_")}.docx`;

    saveAs(blob, fileName);
  } catch (err) {
    console.error("Download failed:", err);
  }
}
