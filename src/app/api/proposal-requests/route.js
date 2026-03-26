import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import ProposalRequest from '../../../../lib/models/ProposalRequest';
import Property from '../../../../lib/models/Property';

export async function POST(request) {
    try {
        const data = await request.json();

        const { propertyId, name, email, phone } = data;

        if (!propertyId || !name || !email || !phone) {
            return NextResponse.json(
                { success: false, message: 'Missing required fields' },
                { status: 400 },
            );
        }

        await connectDB();

        let propertyTitle = '';
        let agentEmail = '';
        let agentName = '';
        let proposalPdfUrl = '';
        let fetchedProperty = null;

        try {
            const property = await Property.findById(propertyId)
                .select('title agentEmail agentName agentId proposalPdf description price area address city state features RentalPeriod NoOFCheck images')
                .populate('agentId', 'name email');

            propertyTitle = property?.title || '';
            agentEmail = property?.agentId?.email || property?.agentEmail || '';
            agentName = property?.agentId?.name || property?.agentName || '';
            proposalPdfUrl = property?.proposalPdf || '';
            fetchedProperty = property;
        } catch {
            // ignore property lookup errors; still store request
        }

        const doc = await ProposalRequest.create({
            propertyId,
            propertyTitle,
            agentName,
            agentEmail,
            name,
            email,
            phone,
            status: 'new',
        });

        // Send Email Notifications
        try {
            const { sendMail, getProposalEmailTemplate, getAdminNotificationTemplate, getAdminEmails } = await import('../../../../lib/mail');

            // 1. Send to Client
            const clientMail = getProposalEmailTemplate(name, propertyTitle);

            const mailOptions = {
                to: email,
                ...clientMail
            };

            if (proposalPdfUrl) {
                const fs = await import('fs/promises');
                const path = await import('path');
                try {
                    const relativePath = proposalPdfUrl.startsWith('/') ? proposalPdfUrl.substring(1) : proposalPdfUrl;
                    const pdfPath = path.join(process.cwd(), 'public', relativePath);
                    const fileBuffer = await fs.readFile(pdfPath);
                    const base64Content = fileBuffer.toString('base64');

                    mailOptions.attachment = {
                        filename: `Proposal-${propertyTitle.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`,
                        content: base64Content
                    };
                } catch (pdfError) {
                    console.error('Error reading PDF for attachment:', pdfError);
                }
            } else if (fetchedProperty) {
                try {
                    const { jsPDF } = await import("jspdf");

                    const doc = new jsPDF();
                    // Header
                    doc.setFillColor(31, 41, 55); // Dark blue-gray
                    doc.rect(0, 0, pageWidth, 40, 'F');

                    doc.setTextColor(255, 255, 255);
                    doc.setFontSize(22);
                    doc.text('THREE DIAMONDS REAL ESTATE', 15, 20);
                    doc.setFontSize(10);
                    doc.text('PROPERTY PROPOSAL', 15, 30);

                    doc.setFontSize(22);
                    doc.setTextColor(40, 40, 40);
                    doc.text(fetchedProperty.title || 'Property Proposal', 20, 20);

                    doc.setFontSize(12);
                    doc.setTextColor(80, 80, 80);
                    let y = 35;

                    if (fetchedProperty.price) { doc.text(`Price: $${fetchedProperty.price.toLocaleString()}`, 20, y); y += 10; }
                    if (fetchedProperty.area) { doc.text(`Area: ${fetchedProperty.area} sqft`, 20, y); y += 10; }
                    if (fetchedProperty.address || fetchedProperty.city) { doc.text(`Location: ${fetchedProperty.address || ''} ${fetchedProperty.city || ''}`, 20, y); y += 10; }
                    if (fetchedProperty.RentalPeriod) { doc.text(`Rental Period: ${fetchedProperty.RentalPeriod}`, 20, y); y += 10; }

                    if (fetchedProperty.description) {
                        y += 5;
                        doc.setFontSize(14);
                        doc.setTextColor(40, 40, 40);
                        doc.text("Description:", 20, y); y += 8;
                        doc.setFontSize(11);
                        doc.setTextColor(100, 100, 100);
                        // Clean html tags if any before printing
                        const cleanDesc = fetchedProperty.description.replace(/<[^>]*>?/gm, '');
                        const splitDesc = doc.splitTextToSize(cleanDesc, 170);
                        doc.text(splitDesc, 20, y);
                        y += splitDesc.length * 6;
                    }

                    if (fetchedProperty.features && fetchedProperty.features.length > 0) {
                        y += 10;
                        if (y > 270) { doc.addPage(); y = 20; }
                        doc.setFontSize(14);
                        doc.setTextColor(40, 40, 40);
                        doc.text("Features:", 20, y); y += 8;

                        doc.setFontSize(11);
                        doc.setTextColor(80, 80, 80);
                        fetchedProperty.features.forEach(f => {
                            if (y > 280) { doc.addPage(); y = 20; }
                            doc.text(`• ${f.name}`, 25, y);
                            y += 7;
                        });
                    }

                    const arrBuf = doc.output('arraybuffer');
                    const base64Content = Buffer.from(arrBuf).toString('base64');

                    mailOptions.attachment = {
                        filename: `Proposal-${propertyTitle.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`,
                        content: base64Content
                    };
                } catch (generateError) {
                    console.error('Error generating dynamic PDF for attachment:', generateError);
                }
            }

            await sendMail(mailOptions);

            // 2. Send to Admin
            const adminMail = getAdminNotificationTemplate('Property Proposal Request', {
                name,
                email,
                phone,
                property: propertyTitle,
                id: propertyId
            });

            const adminTo = await getAdminEmails();
            if (adminTo) {
                await sendMail({
                    to: adminTo,
                    ...adminMail
                });
            }

            // 3. Send to Agent
            if (agentEmail) {
                const agentMail = getAdminNotificationTemplate('Direct Property Inquiry (Proposal)', {
                    agent: agentName,
                    customer: name,
                    email,
                    phone,
                    property: propertyTitle,
                    id: propertyId
                });
                await sendMail({
                    to: agentEmail,
                    ...agentMail
                });
            }
        } catch (mailError) {
            console.error('Email notification failed but request was saved:', mailError);
        }

        return NextResponse.json({
            success: true,
            id: doc._id.toString(),
        });
    } catch (error) {
        console.error('Error creating proposal request:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 },
        );
    }
}

export async function GET() {
    try {
        await connectDB();
        const requests = await ProposalRequest.find({}).sort({ createdAt: -1 }).lean();
        return NextResponse.json(requests);
    } catch (error) {
        console.error('Error fetching proposal requests:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 },
        );
    }
}
