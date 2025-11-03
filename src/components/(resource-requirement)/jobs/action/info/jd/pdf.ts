

import jsPDF from "jspdf";

/**
 * Generate a well-formatted styled PDF from markdown
 */
export function downloadStyledMarkdownPdf(
  markdown: string,
  tabName: string = "Document",
  filename: string = "document.pdf"
) {
  const pdf = new jsPDF("p", "pt", "a4"); // portrait, points, A4
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 40;
  const lineHeight = 16; // smaller line spacing
  const paragraphSpacing = 8; // extra spacing between paragraphs
  const usableWidth = pageWidth - margin * 2;

  // Add title (tab name) at the top
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(18);
  pdf.text(tabName, pageWidth / 2, margin, { align: "center" });

  let cursorY = margin + 30; // start below title

  // Process markdown line by line
  const lines = markdown
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  lines.forEach((line) => {
    let fontStyle: "normal" | "bold" = "normal";
    let fontSize = 10; // smaller font

    // Detect markdown strong (**bold**)
    const strongMatch = line.match(/\*\*(.*?)\*\*/);
    if (strongMatch) {
      fontStyle = "bold";
      line = line.replace(/\*\*(.*?)\*\*/, strongMatch[1]);
      fontSize = 10;
    }

    // Detect headings (#, ##, ###)
    const headingMatch = line.match(/^(#{1,6})\s+(.*)/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      fontStyle = "bold";
      fontSize = 12 + (6 - level); // bigger font for top-level headings
      line = headingMatch[2];
    }

    // Detect bullet list (- or *) and replace with dot
    if (line.startsWith("- ") || line.startsWith("* ")) {
      line = "• " + line.slice(2);
    }

    pdf.setFont("helvetica", fontStyle);
    pdf.setFontSize(fontSize);

    // Wrap text
    const wrapped = pdf.splitTextToSize(line, usableWidth);
    wrapped.forEach((text: string) => {
      if (cursorY + lineHeight > pageHeight - margin) {
        pdf.addPage();
        cursorY = margin;
      }
      pdf.text(text, margin, cursorY);
      cursorY += lineHeight;
    });

    cursorY += paragraphSpacing; // spacing between lines/paragraphs
  });

  pdf.save(filename);
}
