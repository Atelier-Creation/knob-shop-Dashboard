const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Helper function to convert number to words (rupees)
const toWords = (n) => {
    const a = [
      "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
      "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen",
    ];
    const b = [
      "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety",
    ];
  
    const numberToWords = (num) => {
      if (num < 20) return a[num];
      if (num < 100)
        return b[Math.floor(num / 10)] + (num % 10 !== 0 ? "-" + a[num % 10] : "");
      if (num < 1000)
        return a[Math.floor(num / 100)] + " Hundred" + (num % 100 !== 0 ? " and " + numberToWords(num % 100) : "");
      if (num < 100000)
        return numberToWords(Math.floor(num / 1000)) + " Thousand" + (num % 1000 !== 0 ? " " + numberToWords(num % 1000) : "");
      return "";
    };
  
    return numberToWords(Math.floor(n)) + " Rupees Only";
  };

// Static Company Data (from your frontend code)
const companyData = {
    website: "knobsshop.store",
    phone: "+91 70924 66600",
    email: "ecom@knobsshop.store",
};

const fromData = {
    name: "Knobsshop",
    address: ["746-747,Mettupalayam Road,X-Cut", "Coimbatore, 641301"],
    phone: "+91 70924 66600",
    fax: "(123) 456-7890",
    gstin: "33ABCDE1234F1Z5", // Example GSTIN if needed
};

/**
 * Generates an Invoice PDF
 * @param {Object} invoiceData - The full invoice object (merged with user, address, products)
 * @param {string} outputPath - Path to save the PDF
 */
async function generateInvoicePDF(invoiceData, outputPath) {
    // 1. Calculate Totals
    let subtotal = 0;
    let totalGST = 0;
    const gstSummary = {};

    const itemsHtml = (invoiceData.cartItems || []).map((item, i) => {
        const qty = item.quantity || 1;
        const mrpTotal = (item.mrpPrice || item.price) * qty;
        const sellingTotal = item.price * qty;
        
        // Product Details
        const title = item.product?.name || item.title || "Product";
        const hsncode = item.product?.hsncode || "9983";
        // GST Calculation
        // Assuming structure matches frontend: item.product.variant[0].sizes[0].taxPercentage
        let gstRate = 18;
        try {
            gstRate = item.product?.variant?.[0]?.sizes?.[0]?.taxPercentage ?? 18;
        } catch (e) { gstRate = 18; }

        const taxable = sellingTotal;
        const gstAmt = (taxable * gstRate) / 100;
        
        // Update Running Totals
        subtotal += taxable;
        totalGST += gstAmt;

        // GST Summary
        if (!gstSummary[gstRate]) {
            gstSummary[gstRate] = { taxable: 0, cgst: 0, sgst: 0 };
        }
        gstSummary[gstRate].taxable += taxable;
        gstSummary[gstRate].cgst += gstAmt / 2;
        gstSummary[gstRate].sgst += gstAmt / 2;

        const discountPercent = mrpTotal > 0 ? ((mrpTotal - sellingTotal) / mrpTotal) * 100 : 0;

        return `
        <tr>
            <td>${i + 1}</td>
            <td class="table-title">
                ${title}
                <br />
            </td>
            <td class="table-data">${hsncode}</td>
            <td class="table-data">${qty}</td>
            <td class="table-data">
                <span class="currency-symbol">₹</span>${item.price}
            </td>
            <td class="table-data">${discountPercent.toFixed(2)}%</td>
            <td class="table-data">
                <span class="currency-symbol">₹</span>${(taxable + gstAmt).toFixed(2)}
            </td>
        </tr>
        `;
    }).join('');

    // Fill empty rows if needed (to match frontend look)
    const emptyRowsCount = Math.max(0, 3 - (invoiceData.cartItems?.length || 0));
    const emptyRowsHtml = Array(emptyRowsCount).fill(0).map(() => `
        <tr class="empty-row">
            <td>&nbsp;</td>
            <td><br/><small>&nbsp;</small></td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
        </tr>
    `).join('');

    const grandTotal = subtotal + totalGST;
    const roundedTotal = Math.round(grandTotal);
    const roundOff = (roundedTotal - grandTotal).toFixed(2);
    const amountInWords = toWords(roundedTotal);

    // GST Breakdown (Output CGST/SGST or IGST)
    const isTamilNadu = invoiceData.shippingAddress?.state === "Tamil Nadu";
    let gstBreakdownHtml = '';
    
    if (isTamilNadu) {
        gstBreakdownHtml = `
            <div class="gst-line">
                <span class="gst-label"><em>Output CGST</em></span>
                <span class="gst-value">₹${(totalGST / 2).toFixed(2)}</span>
            </div>
            <div class="gst-line">
                <span class="gst-label"><em>Output SGST</em></span>
                <span class="gst-value">₹${(totalGST / 2).toFixed(2)}</span>
            </div>
        `;
    } else {
        gstBreakdownHtml = `
            <div class="gst-line">
                <span class="gst-label"><em>Output IGST</em></span>
                <span class="gst-value">₹${totalGST.toFixed(2)}</span>
            </div>
        `;
    }

    // GST Summary Table Rows
    const gstSummaryRows = Object.entries(gstSummary).map(([rate, data]) => {
        const totalTax = data.cgst + data.sgst;
        return `
            <tr>
                <td>${rate}%</td>
                <td>₹${data.taxable.toFixed(2)}</td>
                <td>₹${data.cgst.toFixed(2)}</td>
                <td>₹${data.sgst.toFixed(2)}</td>
                <td>₹${totalTax.toFixed(2)}</td>
            </tr>
        `;
    }).join('');

    // HTML Template
    // Note: Replaced images with placeholders or generic URLs. 
    // In production, use Base64 strings or absolute URLs to public assets.
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            /* Copied and adapted from Invoice.css */
            @import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css");
            
            body { font-family: 'Helvetica', 'Arial', sans-serif; -webkit-print-color-adjust: exact; }
            .invoice-letterhead {
                position: relative;
                width: 210mm;
                min-height: 297mm;
                margin: auto;
                /* Background Image - Check path */
                /* background-image: url("http://localhost:5000/Knobsshop_letterhead.jpg"); */
                background-repeat: no-repeat;
                background-size: contain;
                background-position: top center;
            }
            .invoice { padding: 27% 40px 0px 40px; background: transparent; }
            .invoice-company { font-size: 20px; text-align: right; margin-bottom: 20px;}
            .invoice-header { background: #f0f3f4; padding: 20px; display: flex; justify-content: space-between; gap: 20px;}
            
            .invoice-from, .invoice-to { width: 48%; }
            .invoice-date { width: 100%; margin-top: 20px; text-align: right; }
            
            strong { font-weight: 600; }
            address { font-style: normal; line-height: 1.5; }
            
            .table-responsive { margin-top: 20px; }
            .table-invoice { width: 100%; border-collapse: collapse; }
            .table-invoice th { text-align: left; padding: 8px; border-bottom: 2px solid #ddd; font-size: 14px; }
            .table-invoice td { padding: 8px; border-bottom: 1px solid #ddd; font-size: 14px; }
            .table-data { text-align: center; }
            .table-title { width: 40%; }
            
            .empty-row td { border: none !important; padding: 10px 0 !important; }

            .gst-breakdown-section { margin-top: 20px; display: flex; flex-direction: column; align-items: flex-end; }
            .gst-line { width: 300px; display: flex; justify-content: space-between; font-weight: 600; margin-bottom: 5px; }

            .invoice-price { background: #f0f3f4; padding: 20px; margin-top: 20px; display: flex; justify-content: space-between; align-items: center; }
            .sub-total-price-content { text-align: right; }
            .sub-price { margin-bottom: 5px; font-weight: 600; }
            .total-price { font-size: 24px; font-weight: bold; color: #2d353c; }

            .invoice-summary { margin-top: 30px; }
            .table-bordered { width: 100%; border-collapse: collapse; border: 1px solid #ddd; }
            .table-bordered th, .table-bordered td { border: 1px solid #ddd; padding: 8px; text-align: center; }
            .table-secondary { background-color: #e2e3e5; }
            
            .declare-content-and-sign { display: flex; justify-content: space-between; margin-top: 40px; align-items: center; }
            .seal-image-invoice { height: 100px; opacity: 0.3; }
            .sign-image-invoice { height: 60px; margin-top: -40px; }
            
            .bi-currency-rupee::before { content: "₹"; }
        </style>
    </head>
    <body>
        <div class="invoice-letterhead">
            <div class="invoice">
                <div class="invoice-company">
                    ${companyData.website}
                </div>
                
                <div class="invoice-header">
                    <div class="invoice-from">
                        <small>from</small>
                        <address>
                            <strong>${fromData.name}</strong><br>
                            ${fromData.address.join('<br>')}<br>
                            Phone: ${fromData.phone}<br>
                        </address>
                    </div>
                    <div class="invoice-to">
                        <small>To</small>
                        <address>
                            <strong>${invoiceData.userDetails?.name || 'Customer'}</strong>
                            <strong>${invoiceData.shippingAddress?.name || ''}</strong><br>
                            ${invoiceData.shippingAddress?.street || ''}<br>
                            ${invoiceData.shippingAddress?.city || ''}, ${invoiceData.shippingAddress?.district || ''}<br>
                            ${invoiceData.shippingAddress?.state || ''} - ${invoiceData.shippingAddress?.pincode || ''}
                        </address>
                    </div>
                </div>
                
                <div class="invoice-date">
                     <div>Payment Method: ${invoiceData.paymentMethod || 'N/A'}</div>
                     <div>Ordered Date: ${invoiceData.invoiceDate || new Date().toLocaleDateString()}</div>
                     <div>Order Id: ${invoiceData.orderId || 'N/A'}</div>
                </div>

                <div class="table-responsive">
                    <table class="table table-invoice">
                        <thead>
                            <tr>
                                <th>SI NO.</th>
                                <th>PRODUCT</th>
                                <th class="table-data">HSN/SAC</th>
                                <th class="table-data">QTY</th>
                                <th class="table-data">RATE</th>
                                <th class="table-data">DISC%</th>
                                <th class="table-data">TOTAL</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemsHtml}
                            ${emptyRowsHtml}
                        </tbody>
                    </table>
                </div>

                <div class="gst-breakdown-section">
                    ${gstBreakdownHtml}
                </div>

                <div class="invoice-price">
                    <div class="sub-total-price-content" style="width: 100%;">
                        <div class="sub-price">SUBTOTAL: ₹${subtotal.toFixed(2)}</div>
                        <div class="sub-price">GST TOTAL: ₹${totalGST.toFixed(2)}</div>
                        <div class="sub-price">ROUND OFF: ₹${roundOff}</div>
                        <div class="total-price" style="margin-top: 10px;">TOTAL: ₹${roundedTotal.toLocaleString("en-in")}</div>
                    </div>
                </div>

                <div class="invoice-summary">
                    <h5>GST Summary</h5>
                    <table class="table-bordered">
                        <thead class="table-secondary">
                            <tr>
                                <th>GST %</th>
                                <th>Taxable Value</th>
                                <th>CGST Amount</th>
                                <th>SGST Amount</th>
                                <th>Total Tax</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${gstSummaryRows}
                             <tr>
                                <td colspan="4" style="text-align: right;"><strong>Total</strong></td>
                                <td><strong>₹${roundedTotal.toFixed(2)}</strong></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div style="margin-top: 20px;">
                    <p><strong>Amount Chargeable (in words):</strong> <em>${amountInWords}</em></p>
                </div>

                <div class="declare-content-and-sign">
                    <div style="width: 60%;">
                        <p><strong>Declaration</strong></p>
                        <p>We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.</p>
                    </div>
                    <div style="text-align: center;">
                        <p><strong>for KNOBS SHOP</strong></p>
                        <div style="position: relative; height: 100px; width: 150px; margin: 0 auto;">
                            <!-- Placeholder Images - Replace with Base64 or URL -->
                            <img src="" alt="Sign" class="sign-image-invoice" /> 
                        </div>
                        <p>Authorised Signatory</p>
                    </div>
                </div>

            </div>
        </div>
    </body>
    </html>
    `;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Set content and wait for network/styles
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    await page.pdf({
        path: outputPath,
        format: 'A4',
        printBackground: true,
        margin: {
            top: '0px',
            bottom: '0px',
            left: '0px',
            right: '0px'
        }
    });

    await browser.close();
    console.log(`Invoice saved to ${outputPath}`);
}

// EXAMPLE USAGE:
// const mockData = { ... }; 
// generateInvoicePDF(mockData, 'invoice_output.pdf');

module.exports = { generateInvoicePDF };
