/**
 * buildProposalPDF.js
 * Shared helper — builds a clean property proposal PDF.
 *
 * @param {Object} jsPDFInstance  - An already-constructed jsPDF instance
 * @param {Object} property       - Property data
 * @param {Object} client         - { name, email, phone }
 * @param {string} [logoBase64]   - Base64 PNG string for watermark (optional)
 * @returns {Object}              - The jsPDF doc instance (mutated)
 */
export function buildProposalPDF(jsPDFInstance, property, client = {}, logoBase64 = null) {
    const doc = jsPDFInstance;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;

    // ── Watermark stamp (called after every addPage too) ──────────────────────
    const stampWatermark = () => {
        if (!logoBase64) return;
        try {
            const wSize = 110; // mm
            const wx = (pageWidth - wSize) / 2;
            const wy = (pageHeight - wSize) / 2;
            doc.saveGraphicsState();
            doc.setGState(doc.GState({ opacity: 0.07 }));
            doc.addImage(logoBase64, 'PNG', wx, wy, wSize, wSize);
            doc.restoreGraphicsState();
        } catch (e) {
            // watermark is cosmetic — silently ignore errors
        }
    };

    // Patch addPage to auto-stamp on new pages
    const origAddPage = doc.addPage.bind(doc);
    doc.addPage = (...args) => {
        origAddPage(...args);
        stampWatermark();
        return doc;
    };

    // Stamp page 1 immediately
    stampWatermark();

    // ── Helpers ────────────────────────────────────────────────────────────────
    const addPageIfNeeded = (y, needed = 20) => {
        if (y + needed > pageHeight - margin - 10) {
            doc.addPage();          // triggers stampWatermark via patch
            return margin;
        }
        return y;
    };

    const sectionTitle = (text, y) => {
        y = addPageIfNeeded(y, 16);
        doc.setFontSize(9);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(120, 120, 120);
        doc.text(text.toUpperCase(), margin, y);
        doc.setDrawColor(220, 220, 220);
        doc.line(margin, y + 2, pageWidth - margin, y + 2);
        return y + 10;
    };

    const labelValue = (label, value, y) => {
        if (value === null || value === undefined || value === '') return y;
        y = addPageIfNeeded(y, 9);
        doc.setFont(undefined, 'bold');
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text(String(label), margin, y);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(25, 25, 25);
        const lines = doc.splitTextToSize(String(value), contentWidth - 50);
        doc.text(lines, margin + 50, y);
        return y + Math.max(lines.length * 5.5, 8);
    };

    // ── HEADER BAR ─────────────────────────────────────────────────────────────
    doc.setFillColor(18, 18, 18);
    doc.rect(0, 0, pageWidth, 32, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(13);
    doc.setFont(undefined, 'bold');
    doc.text('THREE DIAMONDS REAL ESTATE', margin, 14);

    doc.setFontSize(8);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(170, 170, 170);
    doc.text('P R O P E R T Y   P R O P O S A L', margin, 23);

    // date — top right
    const dateStr = new Date().toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric'
    });
    doc.setFontSize(8);
    doc.setTextColor(160, 160, 160);
    doc.text(dateStr, pageWidth - margin, 23, { align: 'right' });

    let y = 44;

    // ── PREPARED FOR ──────────────────────────────────────────────────────────
    if (client.name || client.email || client.phone) {
        doc.setFontSize(8);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(130, 130, 130);
        doc.text('PREPARED FOR', margin, y);
        y += 6;

        doc.setFont(undefined, 'normal');
        doc.setFontSize(10);
        doc.setTextColor(20, 20, 20);
        if (client.name) { doc.text(client.name, margin, y); y += 6; }

        doc.setFontSize(9);
        doc.setTextColor(80, 80, 80);
        if (client.email) { doc.text(client.email, margin, y); y += 5; }
        if (client.phone) { doc.text(client.phone, margin, y); y += 5; }

        y += 4;
        doc.setDrawColor(230, 230, 230);
        doc.line(margin, y, pageWidth - margin, y);
        y += 10;
    }

    // ── PROPERTY TITLE ────────────────────────────────────────────────────────
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(18, 18, 18);
    const titleLines = doc.splitTextToSize(property.title || 'Property Proposal', contentWidth);
    doc.text(titleLines, margin, y);
    y += titleLines.length * 8 + 2;

    // location sub-line
    const locParts = [property.address, property.city, property.state].filter(Boolean);
    if (locParts.length) {
        doc.setFontSize(9);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(110, 110, 110);
        doc.text(locParts.join(', '), margin, y);
        y += 7;
    }
    y += 6;

    // ── PROPERTY DETAILS ──────────────────────────────────────────────────────
    y = sectionTitle('Property Details', y);

    if (property.price) {
        const formatted = new Intl.NumberFormat('en-AE', {
            style: 'currency', currency: 'AED', minimumFractionDigits: 0
        }).format(property.price);
        y = labelValue('Price', formatted, y);
    }
    if (property.area) y = labelValue('Area', `${property.area} sq ft`, y);
    if (property.NoOFCheck) y = labelValue('No. of Cheques', property.NoOFCheck, y);
    if (property.RentalPeriod) y = labelValue('Rental Period', property.RentalPeriod, y);

    const propType = property.propertyType?.name || property.propertyTypeName || null;
    if (propType) y = labelValue('Type', propType, y);

    y += 6;

    // ── DESCRIPTION ──────────────────────────────────────────────────────────
    if (property.description) {
        const cleanDesc = property.description.replace(/<[^>]*>?/gm, '').trim();
        if (cleanDesc) {
            y = sectionTitle('Description', y);
            doc.setFontSize(9);
            doc.setFont(undefined, 'normal');
            doc.setTextColor(55, 55, 55);
            const descLines = doc.splitTextToSize(cleanDesc, contentWidth);
            descLines.forEach(line => {
                y = addPageIfNeeded(y, 6);
                doc.text(line, margin, y);
                y += 5.5;
            });
            y += 6;
        }
    }

    // ── FEATURES ─────────────────────────────────────────────────────────────
    if (property.features && property.features.length > 0) {
        y = sectionTitle('Features & Amenities', y);
        doc.setFontSize(9);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(50, 50, 50);

        const cols = 2;
        const colW = contentWidth / cols;
        let col = 0;
        let rowStartY = y;

        property.features.forEach((f) => {
            const name = typeof f === 'string' ? f : f.name;
            if (col === 0) rowStartY = addPageIfNeeded(y, 7);
            doc.text(`• ${name}`, margin + col * colW, rowStartY);
            col++;
            if (col >= cols) { col = 0; y = rowStartY + 7; }
        });
        if (col !== 0) y = rowStartY + 7; // flush last partial row
        y += 6;
    }

    // ── AGENT FOOTER BLOCK ────────────────────────────────────────────────────
    const agentName = property.agentId?.name || property.agentName || 'Three Diamonds Representative';
    const agentEmail = property.agentId?.email || property.agentEmail || 'info@threediamonds.ae';
    const agentPhone = property.agentId?.phone || property.agentPhone || '';

    y = addPageIfNeeded(y, 32);
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    doc.setFontSize(8);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(130, 130, 130);
    doc.text('YOUR DEDICATED AGENT', margin, y);
    y += 7;

    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(18, 18, 18);
    doc.text(agentName, margin, y);
    y += 6;

    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(80, 80, 80);
    if (agentEmail) { doc.text(`Email: ${agentEmail}`, margin, y); y += 5; }
    if (agentPhone) { doc.text(`Phone: ${agentPhone}`, margin, y); }

    // ── PAGE FOOTER on every page ─────────────────────────────────────────────
    const totalPages = doc.internal.pages.length - 1;
    for (let p = 1; p <= totalPages; p++) {
        doc.setPage(p);
        doc.setFontSize(7.5);
        doc.setTextColor(170, 170, 170);
        doc.text(
            '© Three Diamonds Real Estate | threediamonds.ae | Dubai, UAE',
            margin,
            pageHeight - 8
        );
        doc.text(
            `Page ${p} of ${totalPages}`,
            pageWidth - margin,
            pageHeight - 8,
            { align: 'right' }
        );
    }

    return doc;
}
