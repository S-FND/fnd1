// src/components/esg-cap/lib/pdf-generator.ts
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import type { ExportFilters } from "./export-types";
import {
  ESGCapItem,
  CAPStatus,
  ESGCapPriority,
  ESGCapDealCondition,
} from "@/features/enterprise-admin/types/esgDD";

const COLORS = {
  brand: [86, 145, 86] as [number, number, number],
  red: [205, 65, 55] as [number, number, number],
  amber: [217, 159, 60] as [number, number, number],
  green: [40, 167, 69] as [number, number, number],
  blue: [70, 120, 200] as [number, number, number],
  ink: [34, 40, 49] as [number, number, number],
  sub: [110, 120, 135] as [number, number, number],
  rule: [225, 228, 234] as [number, number, number],
  softGreen: [232, 245, 232] as [number, number, number],
  softRed: [253, 232, 230] as [number, number, number],
  softAmber: [253, 243, 222] as [number, number, number],
  softBlue: [232, 240, 252] as [number, number, number],
};

const getDateStatus = (item: ESGCapItem) => {
  const investorStatus = (item.investorStatus || "").toLowerCase();

  if (investorStatus === "closed") {
    return "closed";
  }

  if ((item.status || "").toLowerCase() === "submitted") {
    return "submitted";
  }

  if (!item.targetDate) {
    return "";
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(item.targetDate);
  target.setHours(0, 0, 0, 0);

  if (
    target.getMonth() === today.getMonth() &&
    target.getFullYear() === today.getFullYear()
  ) {
    return "due in this month";
  }

  if (target < today) {
    return "overdue";
  }

  return "upcoming";
};

function getDisplayStatus(item: ESGCapItem): string {
  const effective = getDateStatus(item);
  switch (effective) {
    case "due in this month":
      return "Due in this Month";
    case "upcoming":
      return "Upcoming";
    case "overdue":
      return "Overdue";
    case "closed":
      return "Closed";
    case "submitted":
      return "Submitted";
    default:
      return effective;
  }
}

function statusColor(status: string): [number, number, number] {
  const s = status.toLowerCase();
  if (s === "closed") return COLORS.brand;
  if (s === "overdue") return COLORS.red;
  if (s === "due in this month") return COLORS.amber;
  if (s === "submitted") return COLORS.blue;
  return COLORS.sub;
}

function prioColor(priority: ESGCapPriority): [number, number, number] {
  if (priority === "high") return COLORS.red;
  if (priority === "medium") return COLORS.amber;
  return COLORS.blue;
}

function applyFilters(items: ESGCapItem[], f: ExportFilters): ESGCapItem[] {
  return items.filter((i) => {
    if (f.categories.length && !f.categories.includes(i.dealCondition))
      return false;
    if (f.priorities.length && !f.priorities.includes(i.priority?.toLowerCase())) return false;
    if (f.statuses.length && !f.statuses.includes("Total")) {
      const effective = getDateStatus(i);
      if (!f.statuses.includes(effective)) return false;
    }
    if (f.dateFrom || f.dateTo) {
      let dateField: string | undefined;
      if (f.dateField === "target") dateField = i.targetDate;
      else if (f.dateField === "created") dateField = i.createdAt;
      else if (f.dateField === "submitted") dateField = i.actualDate;
      if (!dateField) return false;
      const t = new Date(dateField).getTime();
      if (f.dateFrom && t < new Date(f.dateFrom).getTime()) return false;
      if (f.dateTo && t > new Date(f.dateTo).getTime()) return false;
    }
    return true;
  });
}

function calculateSummary(items: ESGCapItem[]) {
  const total = items.length;
  let closed = 0,
    overdue = 0,
    dueSoon = 0,
    upcoming = 0,
    submitted = 0;

  items.forEach((item) => {
    const status = getDateStatus(item);
    if (status === "closed") closed++;
    else if (status === "overdue") overdue++;
    else if (status === "due in this month") dueSoon++;
    else if (status === "upcoming") upcoming++;
    else if (status === "submitted") submitted++;
  });

  return { total, closed, overdue, dueSoon, upcoming, submitted };
}

function header(doc: jsPDF, title: string, companyName?: string) {
  const w = doc.internal.pageSize.getWidth();
  doc.setFillColor(...COLORS.brand);
  doc.rect(0, 0, w, 4, "F");
  doc.setTextColor(...COLORS.ink);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text(companyName || "Fandoro", 14, 14);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.sub);
  doc.setFontSize(9);
  doc.text(title, w - 14, 14, { align: "right" });
  doc.setDrawColor(...COLORS.rule);
  doc.line(14, 18, w - 14, 18);
}

function footer(doc: jsPDF, companyName?: string) {
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();
  doc.setDrawColor(...COLORS.rule);
  doc.line(14, h - 14, w - 14, h - 14);
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.sub);
  doc.text(`${companyName || "Company"} • Confidential`, 14, h - 8);
  const pageNum = doc.getCurrentPageInfo().pageNumber;
  doc.text(`Fandoro Technologies Pvt Ltd • Page ${pageNum}`, w - 14, h - 8, {
    align: "right",
  });
}

function decorate(doc: jsPDF, title: string, companyName?: string) {
  const total = doc.getNumberOfPages();
  for (let p = 1; p <= total; p++) {
    doc.setPage(p);
    // Apply footer to all pages, header to all except first page
    if (p === 1) {
      footer(doc, companyName);
    } else {
      header(doc, title, companyName);
      footer(doc, companyName);
    }
  }
}

function kpiCard(
  doc: jsPDF,
  x: number,
  y: number,
  w: number,
  h: number,
  label: string,
  value: string,
  color: [number, number, number],
  soft: [number, number, number]
) {
  doc.setFillColor(...soft);
  doc.roundedRect(x, y, w, h, 3, 3, "F");
  doc.setDrawColor(...color);
  doc.setLineWidth(0.4);
  doc.roundedRect(x, y, w, h, 3, 3, "S");
  doc.setTextColor(...color);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text(value, x + w / 2, y + h / 2 + 1, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.sub);
  doc.text(label, x + w / 2, y + h - 4, { align: "center" });
}

function daysRemaining(targetDate?: string): number {
  if (!targetDate) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(targetDate);
  target.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil(
    (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  return Math.abs(diffDays);
}

function wrapText(text: string, maxLength = 50): string {
  if (!text) return "";
  const decodedText = text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

  const words = decodedText.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    if ((currentLine + " " + word).trim().length > maxLength) {
      if (currentLine) lines.push(currentLine.trim());
      currentLine = word;
    } else {
      currentLine += (currentLine ? " " : "") + word;
    }
  }
  if (currentLine) lines.push(currentLine.trim());

  return lines.join("\n");
}

export function buildPdf(
  filters: ExportFilters,
  items: ESGCapItem[],
  companyName?: string
): jsPDF {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const w = doc.internal.pageSize.getWidth();
  const filteredItems = applyFilters(items, filters);
  const summary = calculateSummary(filteredItems);

  // REMOVED BLANK COVER PAGE - Starting directly with content

  const totalPriorityScore = filteredItems.reduce((sum, item) => {
    const priority = (item.priority || "").toLowerCase();
    if (priority === "high") return sum + 3;
    if (priority === "medium") return sum + 2;
    if (priority === "low") return sum + 1;
    return sum;
  }, 0);

  // EXECUTIVE SUMMARY - Now becomes first page
  if (filters.includeDashboard) {
    // No doc.addPage() here since we're starting fresh
    let y = 30;
    doc.setTextColor(...COLORS.ink);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("ESGCAP Summary", 14, y);
    y += 16;

    const rows: [string, string][] = [
      ["Company", companyName || "Not specified"],
      [
        "Reporting Period",
        filters.dateFrom && filters.dateTo
          ? `${filters.dateFrom} to ${filters.dateTo}`
          : "All time",
      ],
      ["Generated On", format(new Date(), "dd MMM yyyy, HH:mm")],
      ["Total CAP Items", String(filteredItems.length)],
    ];

    doc.setFontSize(9);
    rows.forEach(([k, v]) => {
      doc.setTextColor(...COLORS.sub);
      doc.setFont("helvetica", "normal");
      doc.text(k, 14, y);
      doc.setTextColor(...COLORS.ink);
      doc.setFont("helvetica", "bold");
      doc.text(v, 55, y);
      y += 7;
    });
    y += 4;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.sub);
    doc.text(
      `Snapshot of the ESG CAP across ${summary.total} tracked items.`,
      14,
      y + 6
    );
    y += 10;

    const cards: [
      string,
      string,
      [number, number, number],
      [number, number, number]
    ][] = [
      [
        "Total CAP Items",
        String(summary.total),
        COLORS.brand,
        COLORS.softGreen,
      ],
      ["Closed", String(summary.closed), COLORS.brand, COLORS.softGreen],
      [
        "Due in this Month",
        String(summary.dueSoon),
        COLORS.amber,
        COLORS.softAmber,
      ],
      ["Overdue", String(summary.overdue), COLORS.red, COLORS.softRed],
      ["Submitted", String(summary.submitted), COLORS.blue, COLORS.softBlue],
      ["Upcoming", String(summary.upcoming), COLORS.sub, [240, 242, 245]],
    ];
    const cw = (w - 28 - 10) / 3;
    cards.forEach((c, i) => {
      const cx = 14 + (i % 3) * (cw + 5);
      const cy = y + Math.floor(i / 3) * 35;
      kpiCard(doc, cx, cy, cw, 30, c[0], c[1], c[2], c[3]);
    });
    y += 80;

    const pct = summary.total
      ? Math.round((summary.closed / summary.total) * 100)
      : 0;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...COLORS.ink);
    doc.text(`Overall Completion: ${pct}%`, 14, y);
    doc.setFillColor(...COLORS.rule);
    doc.roundedRect(14, y + 4, w - 28, 6, 2, 2, "F");
    doc.setFillColor(...COLORS.brand);
    doc.roundedRect(14, y + 4, (w - 28) * (pct / 100), 6, 2, 2, "F");

    let by = y + 28;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...COLORS.ink);
    doc.text("Priority Distribution", 14, by);
    by += 8;

    const highCount = filteredItems.filter(
      (i) => (i.priority || "").toLowerCase() === "high"
    ).length;
    const mediumCount = filteredItems.filter(
      (i) => (i.priority || "").toLowerCase() === "medium"
    ).length;
    const lowCount = filteredItems.filter(
      (i) => (i.priority || "").toLowerCase() === "low"
    ).length;
    const totalCount = highCount + mediumCount + lowCount;
    const prioSeries: [string, number, [number, number, number]][] = [
      ["Total", totalCount, COLORS.brand],
      ["High", highCount, COLORS.red],
      ["Medium", mediumCount, COLORS.amber],
      ["Low", lowCount, COLORS.blue],
    ];

    const pmax = Math.max(1, ...prioSeries.map((s) => s[1]));
    prioSeries.forEach(([label, val, color]) => {
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...COLORS.sub);
      doc.text(label, 14, by + 4);
      const barW = (w - 80) * (val / pmax);
      doc.setFillColor(...COLORS.rule);
      doc.roundedRect(50, by, w - 80, 6, 1.5, 1.5, "F");
      doc.setFillColor(...color);
      doc.roundedRect(50, by, barW, 6, 1.5, 1.5, "F");
      doc.setTextColor(...COLORS.ink);
      doc.setFont("helvetica", "bold");
      doc.text(String(val), w - 18, by + 4, { align: "right" });
      by += 12;
    });
  }

  /* CAP DETAILS */
  if (filters.includeItems) {
    doc.addPage();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(...COLORS.ink);
    doc.text("CAP Item Details", 14, 32);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.sub);
    doc.text(
      `${filteredItems.length} items match the selected filters.`,
      14,
      38
    );

    autoTable(doc, {
      startY: 44,
      head: [
        [
          "#",
          "CAP Item",
          "Priority",
          "Target Date",
          "Company Status",
          "Investor Status",
          "Category",
          "Deal Condition",
        ],
      ],
      body: filteredItems.map((item, idx) => [
        String(idx + 1),
        wrapText(item.item, 40),
        item.priority
          ? item.priority.charAt(0).toUpperCase() + item.priority.slice(1)
          : "-",
        item.targetDate
          ? format(new Date(item.targetDate), "dd MMM yyyy")
          : "-",
        getDisplayStatus(item),
        item.investorStatus || "-",
        item.category || "-",
        item.dealCondition || "-",
      ]),
      styles: {
        fontSize: 7.5,
        cellPadding: 2,
        textColor: COLORS.ink,
        lineColor: COLORS.rule,
        lineWidth: 0.1,
        cellWidth: "wrap",
        overflow: "linebreak",
        valign: "middle",
      },
      headStyles: {
        fillColor: COLORS.brand,
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: { fillColor: [250, 251, 252] },
      columnStyles: {
        0: { cellWidth: 8 },
        1: { cellWidth: 50 },
        2: { cellWidth: 14 },
        3: { cellWidth: 20 },
        4: { cellWidth: 22 },
        5: { cellWidth: 22 },
        6: { cellWidth: 25 },
        7: { cellWidth: 15 },
      },
      didParseCell: (data) => {
        if (data.section !== "body") return;
        if (data.column.index === 2) {
          const priority = data.cell.raw as string;
          if (priority && priority !== "-") {
            const [r, g, b] = prioColor(
              priority.toLowerCase() as ESGCapPriority
            );
            data.cell.styles.textColor = [r, g, b];
            data.cell.styles.fontStyle = "bold";
          }
        }
        if (data.column.index === 4) {
          const status = data.cell.raw as string;
          const [r, g, b] = statusColor(status);
          data.cell.styles.textColor = [r, g, b];
          data.cell.styles.fontStyle = "bold";
        }
        // Optional: Style for Category column
        if (data.column.index === 6) {
          const category = data.cell.raw as string;
          if (category && category !== "-") {
            data.cell.styles.textColor = COLORS.blue;
          }
        }
        // Optional: Style for Deal Condition column
        if (data.column.index === 7) {
          const dealCondition = data.cell.raw as string;
          if (dealCondition && dealCondition !== "-") {
            data.cell.styles.textColor = COLORS.sub;
          }
        }
      },
    });

    // OVERDUE section
    const overdueItems = filteredItems.filter(
      (i) => getDateStatus(i) === "overdue"
    );
    if (overdueItems.length) {
      doc.addPage();
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor(...COLORS.red);
      doc.text("Overdue Items", 14, 32);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(...COLORS.sub);
      doc.text(
        "Items past their target date requiring immediate attention.",
        14,
        38
      );
      autoTable(doc, {
        startY: 44,
        head: [
          [
            "CAP Item",
            "Target Date",
            "Days Overdue",
            "Priority",
            "Category",
            "Deal Condition",
          ],
        ],
        body: overdueItems.map((i) => [
          wrapText(i.item, 40),
          i.targetDate ? format(new Date(i.targetDate), "dd MMM yyyy") : "-",
          String(daysRemaining(i.targetDate)),
          (i.priority || "").charAt(0).toUpperCase() +
            (i.priority || "").slice(1),
          i.category || "-",
          i.dealCondition || "-",
        ]),
        styles: {
          fontSize: 8,
          cellPadding: 2.5,
          textColor: COLORS.ink,
          lineColor: COLORS.rule,
          lineWidth: 0.1,
          valign: "middle",
        },
        columnStyles: {
          0: { cellWidth: 55 },
          1: { cellWidth: 28 },
          2: { cellWidth: 22 },
          3: { cellWidth: 18 },
          4: { cellWidth: 28 },
          5: { cellWidth: 28 },
        },
        headStyles: { fillColor: COLORS.red, textColor: 255 },
        alternateRowStyles: { fillColor: COLORS.softRed },
        didParseCell: (data) => {
          if (data.section !== "body") return;
          // Style for Priority column
          if (data.column.index === 3) {
            const priority = data.cell.raw as string;
            if (priority) {
              const [r, g, b] = prioColor(
                priority.toLowerCase() as ESGCapPriority
              );
              data.cell.styles.textColor = [r, g, b];
              data.cell.styles.fontStyle = "bold";
            }
          }
          // Style for Category column
          if (data.column.index === 4) {
            const category = data.cell.raw as string;
            if (category && category !== "-") {
              data.cell.styles.textColor = COLORS.blue;
              data.cell.styles.fontStyle = "italic";
            }
          }
          // Style for Deal Condition column
          if (data.column.index === 5) {
            const dealCondition = data.cell.raw as string;
            if (dealCondition && dealCondition !== "-") {
              data.cell.styles.textColor = COLORS.amber;
            }
          }
        },
      });
    }

    // HIGH PRIORITY section
    const highPriorityItems = filteredItems.filter(
      (i) =>
        i.priority === "high" &&
        getDateStatus(i) !== "submitted" &&
        getDateStatus(i) !== "closed"
    );

    if (highPriorityItems.length) {
      doc.addPage();
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor(...COLORS.red);
      doc.text("High Priority — Open Risks", 14, 32);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(...COLORS.sub);
      doc.text(
        "High priority items requiring immediate management attention.",
        14,
        38
      );
      autoTable(doc, {
        startY: 44,
        head: [["CAP Item", "Deal Condition", "Target Date", "Status"]],
        body: highPriorityItems.map((i) => [
          wrapText(i.item, 45),
          i.dealCondition || "Not specified",
          i.targetDate ? format(new Date(i.targetDate), "dd MMM yyyy") : "-",
          getDisplayStatus(i),
        ]),
        styles: {
          fontSize: 9,
          cellPadding: 3,
          textColor: COLORS.ink,
          lineColor: COLORS.rule,
          lineWidth: 0.1,
          valign: "middle",
        },
        columnStyles: {
          0: { cellWidth: 75 },
          1: { cellWidth: 40 },
          2: { cellWidth: 28 },
          3: { cellWidth: 26 },
        },
        headStyles: { fillColor: COLORS.red, textColor: 255 },
        alternateRowStyles: { fillColor: COLORS.softRed },
      });
    }
  }

  /* APPENDIX - UPLOADED DOCUMENTS */
  if (filters.includeAttachments || filters.includeComments) {
    const currentPageHeight = doc.internal.pageSize.getHeight();
    const currentY = (doc as any).lastAutoTable?.finalY || 200;
    const requiredSpace = 60;

    const showOnNewPage = currentY > currentPageHeight - requiredSpace;

    if (showOnNewPage) {
      doc.addPage();
    }

    let y = showOnNewPage ? 30 : currentY + 15;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(...COLORS.ink);
    doc.text("Uploaded Documents", 14, y);
    y += 6;

    if (filters.includeAttachments && filteredItems.length > 0) {
      // Use a Map to deduplicate attachments
      const attachmentsMap = new Map(); // key -> attachment object

      filteredItems.forEach((item) => {
        // Helper to add attachment with deduplication
        const addAttachment = (
          indicatorLabel: string,
          filename: string,
          status: string,
          rawDate: string | undefined
        ) => {
          if (!filename || filename === "No document") return;

          // Create a unique key
          const key = `${item.item}|${indicatorLabel}|${filename}`;
          let formattedDate = "-";
          if (rawDate) {
            try {
              const date = new Date(rawDate);
              if (!isNaN(date.getTime())) {
                formattedDate = format(date, "dd MMM yyyy");
              }
            } catch (e) {
              /* ignore */
            }
          }

          // If key already exists, only replace if current status is empty and new status is not empty
          const existing = attachmentsMap.get(key);
          if (!existing) {
            attachmentsMap.set(key, {
              itemName: item.item,
              indicatorLabel: indicatorLabel || "General",
              filename: filename,
              status: status || "—",
              uploadedDate: formattedDate,
            });
          } else if (existing.status === "—" && status && status !== "—") {
            // Update with better status
            attachmentsMap.set(key, {
              ...existing,
              status: status,
              uploadedDate:
                existing.uploadedDate !== "-"
                  ? existing.uploadedDate
                  : formattedDate,
            });
          }
        };

        // 1. Process fileUploadedData
        if (item.fileUploadedData && item.fileUploadedData.length > 0) {
          item.fileUploadedData.forEach((attachment) => {
            let rawDate =
              attachment.uploadedAt ||
              attachment.aiSummary?.createdAt ||
              attachment.createdAt;
            addAttachment(
              attachment.indicatorLabel,
              attachment.filename,
              attachment.status,
              rawDate
            );
          });
        }

        // 2. Process completionIndicators (only if not already added via fileUploadedData)
        if (item.completionIndicators && item.completionIndicators.length > 0) {
          item.completionIndicators.forEach((indicator) => {
            if (indicator.fileName) {
              // Check if already exists in map using same key logic
              const key = `${item.item}|${indicator.indicatorLabel}|${indicator.fileName}`;
              if (!attachmentsMap.has(key)) {
                addAttachment(
                  indicator.indicatorLabel,
                  indicator.fileName,
                  indicator.status,
                  indicator.uploadedAt
                );
              }
            }
          });
        }
      });

      const allAttachments = Array.from(attachmentsMap.values());

      if (allAttachments.length > 0) {
        doc.setFontSize(12);
        doc.setTextColor(...COLORS.ink);
        doc.text(
          `Total ${allAttachments.length} Attachment(s) Found`,
          14,
          y + 6
        );

        const tableBody: any[] = [];
        let serialNo = 1;
        allAttachments.forEach((att) => {
          tableBody.push([
            String(serialNo),
            wrapText(att.itemName, 35),
            wrapText(att.indicatorLabel, 40),
            att.filename,
            att.status,
            att.uploadedDate,
          ]);
          serialNo++;
        });

        autoTable(doc, {
          startY: y + 10,
          head: [
            [
              "#",
              "CAP Item",
              "Indicator",
              "Document",
              "Status",
              "Uploaded Date",
            ],
          ],
          body: tableBody,
          styles: {
            fontSize: 7.5,
            cellPadding: 2,
            textColor: COLORS.ink,
            lineColor: COLORS.rule,
            lineWidth: 0.1,
            valign: "middle",
          },
          columnStyles: {
            0: { cellWidth: 8, halign: "center" },
            1: { cellWidth: 40 },
            2: { cellWidth: 40 },
            3: { cellWidth: 50 },
            4: { cellWidth: 18 },
            5: { cellWidth: 22 },
          },
          headStyles: {
            fillColor: COLORS.brand,
            textColor: 255,
            fontStyle: "bold",
          },
          alternateRowStyles: { fillColor: [250, 251, 252] },
          didParseCell: (data) => {
            if (data.section !== "body") return;
            if (data.column.index === 3) {
              const filename = data.cell.raw as string;
              if (filename && filename !== "-") {
                data.cell.styles.textColor = COLORS.blue;
                data.cell.styles.fontStyle = "bold";
              }
            }
            if (data.column.index === 4) {
              const status = (data.cell.raw as string)?.toLowerCase();
              if (status === "approved" || status === "accepted") {
                data.cell.styles.textColor = COLORS.brand;
                data.cell.styles.fontStyle = "bold";
              } else if (status === "pending") {
                data.cell.styles.textColor = COLORS.amber;
              } else if (status === "rejected") {
                data.cell.styles.textColor = COLORS.red;
              }
            }
            if (data.column.index === 1) {
              data.cell.styles.fontStyle = "bold";
              data.cell.styles.textColor = COLORS.ink;
            }
            if (data.column.index === 2) {
              const indicator = data.cell.raw as string;
              if (indicator && indicator !== "-") {
                data.cell.styles.textColor = COLORS.sub;
                data.cell.styles.fontStyle = "italic";
              }
            }
          },
        });
      } else {
        doc.setFontSize(10);
        doc.setTextColor(...COLORS.sub);
        doc.text("No attachments found for the selected items.", 14, y + 10);
      }
    }
  }

  decorate(doc, `ESG CAP Report`, companyName);
  return doc;
}

export function downloadPdf(
  filters: ExportFilters,
  items: ESGCapItem[],
  companyName?: string
) {
  try {
    const doc = buildPdf(filters, items, companyName);
    doc.save(`ESG-CAP-Report-${format(new Date(), "yyyyMMdd-HHmm")}.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error(
      "Failed to generate PDF. Please check your data and try again."
    );
  }
}

export function previewPdfUrl(
  filters: ExportFilters,
  items: ESGCapItem[],
  companyName?: string
): string {
  try {
    const doc = buildPdf(filters, items, companyName);
    return doc.output("bloburl").toString();
  } catch (error) {
    console.error("Error generating PDF preview:", error);
    throw new Error("Failed to generate PDF preview");
  }
}
