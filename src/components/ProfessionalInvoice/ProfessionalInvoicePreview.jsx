import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  downloadProfessionalInvoicePdf,
  emailProfessionalInvoice,
  getProfessionalInvoiceSnapshot,
} from "../../api/professionalInvoiceApi";
import "./ProfessionalInvoice.css";

const money = (value = 0) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(Number(value || 0));

const moneyFromPaise = (value = 0) => money(Number(value || 0) / 100);

const date = (value) =>
  value
    ? new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(value))
    : "N/A";

function FinishValue({ value }) {
  return <>{value || "N/A"}</>;
}

function CompactAddress({ address = {}, name, gstin }) {
  return (
    <address className="preview-compact-address">
      <strong>{name || address.name || "Customer"}</strong>
      <div>{address.street}</div>
      <div>{[address.city, address.district].filter(Boolean).join(", ")}</div>
      <div>{[address.state, address.pincode].filter(Boolean).join(" - ")}</div>
      {address.phone && <div>Phone: {address.phone}</div>}
      {gstin && <div>GSTIN: {gstin}</div>}
    </address>
  );
}

export default function ProfessionalInvoicePreview() {
  const { orderId } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadInvoice = async () => {
      try {
        setLoading(true);
        const data = await getProfessionalInvoiceSnapshot(orderId);
        if (!cancelled) setInvoice(data.invoice);
      } catch (error) {
        if (!cancelled) setMessage(error.response?.data?.message || "Failed to load invoice");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    if (orderId) loadInvoice();

    return () => {
      cancelled = true;
    };
  }, [orderId]);

  const refreshSnapshot = async () => {
    const data = await getProfessionalInvoiceSnapshot(orderId, true);
    setInvoice(data.invoice);
  };

  const sendEmail = async () => {
    if (!email) return;
    const data = await emailProfessionalInvoice(orderId, email);
    setMessage(data.message || "Invoice email sent");
  };

  const downloadPdf = async () => {
    try {
      setDownloading(true);
      await downloadProfessionalInvoicePdf(orderId);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to download invoice PDF");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return <div className="professional-invoice-page">Loading invoice...</div>;
  }

  if (!invoice) {
    return <div className="professional-invoice-page">{message || "Invoice not found"}</div>;
  }

  return (
    <div className="professional-invoice-page">
      <div className="professional-invoice-toolbar">
        <div>
          <h1>Professional Invoice</h1>
          {message && <div className="muted-text">{message}</div>}
        </div>
        <div className="professional-invoice-actions">
          <button type="button" className="secondary" onClick={refreshSnapshot}>
            Refresh Snapshot
          </button>
          <button type="button" onClick={downloadPdf} disabled={downloading}>
            {downloading ? "Downloading..." : "Download PDF"}
          </button>
          <input
            type="email"
            placeholder="customer@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <button type="button" onClick={sendEmail}>
            Email PDF
          </button>
        </div>
      </div>

      <article className="professional-invoice-preview">
        <img className="preview-watermark" src="/Knobsshop_watermark.png" alt="" />
        <div className="preview-content">
          <header className="preview-header">
            <div>
              <img className="preview-logo" src="/logo.svg" alt={invoice.company.displayName} />
              {/* <div className="preview-brand">{invoice.company.displayName}</div> */}
            </div>
            <div className="preview-company-grid">
              <div>
                <div className="preview-label">Head Office</div>
                {invoice.company.headOffice.map((line) => (
                  <div key={line}>{line}</div>
                ))}
                <div>Ph: {invoice.company.phone}</div>
                <div>E: {invoice.company.email}</div>
              </div>
              <div>
                <div className="preview-label">Branch</div>
                {invoice.company.branch.map((line) => (
                  <div key={line}>{line}</div>
                ))}
                <div>W: {invoice.company.website}</div>
                <div>GSTIN: {invoice.company.gstin}</div>
              </div>
            </div>
          </header>

          <div className="preview-title-row">
            <div className="preview-title">Tax Invoice</div>
            <div className="preview-meta">
              <div><strong>Invoice:</strong> {invoice.invoiceNumber}</div>
              <div><strong>Order:</strong> {invoice.orderId}</div>
              <div><strong>Date:</strong> {date(invoice.invoiceDate)}</div>
            </div>
          </div>

          <div className="preview-info-band">
            <section>
              <div className="preview-label">From</div>
              <CompactAddress
                address={{
                  name: invoice.company.displayName,
                  street: invoice.company.headOffice[0],
                  city: invoice.company.headOffice[1],
                  phone: invoice.company.phone,
                }}
                name={invoice.company.displayName}
                gstin={invoice.company.gstin}
              />
            </section>
            <section className="preview-to-cell">
              <div className="preview-label">To</div>
              <CompactAddress
                address={invoice.shippingAddress}
                name={invoice.billingAddress.name || invoice.shippingAddress.name}
                gstin={invoice.billingAddress.gstin}
              />
            </section>
            <section className="preview-payment-cell">
              <span>Payment Method</span>
              <strong>{invoice.payment.method}</strong>
              <span>Order Date</span>
              <strong>{date(invoice.invoiceDate)}</strong>
              <span>Order ID</span>
              <strong>{invoice.orderId}</strong>
            </section>
          </div>

          <table className="preview-items">
            <thead>
              <tr>
                <th>SI</th>
                <th>Product</th>
                <th>HSN/SAC</th>
                <th>Qty</th>
                <th className="money">Rate</th>
                <th className="money">Taxable</th>
                <th className="money">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.lineItems.map((item) => (
                <tr key={`${item.serialNo}-${item.productId}`}>
                  <td>{item.serialNo}</td>
                  <td>
                    <div className="wrap-name">{item.name}</div>
                    <div className="muted-text">
                      SKU: {item.sku} | Finish: <FinishValue value={item.variantTitle || item.finish} /> | Size: {item.size || "N/A"}
                    </div>
                  </td>
                  <td>{item.hsnSac}</td>
                  <td>{item.quantity}</td>
                  <td className="money">{moneyFromPaise(item.unitPricePaise)}</td>
                  <td className="money">{moneyFromPaise(item.taxablePaise)}</td>
                  <td className="money">{moneyFromPaise(item.grossPaise)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <section className="preview-totals-grid">
            <div>
              <div className="preview-label">GST Summary</div>
              <table className="preview-tax">
                <thead>
                  <tr>
                    <th>GST %</th>
                    <th className="money">Taxable</th>
                    <th className="money">CGST</th>
                    <th className="money">SGST</th>
                    <th className="money">IGST</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.taxGroups.map((group) => (
                    <tr key={group.rate}>
                      <td>{group.rate}%</td>
                      <td className="money">{moneyFromPaise(group.taxablePaise)}</td>
                      <td className="money">{moneyFromPaise(group.cgstPaise)}</td>
                      <td className="money">{moneyFromPaise(group.sgstPaise)}</td>
                      <td className="money">{moneyFromPaise(group.igstPaise)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div>
              <div className="preview-total-row"><span>Subtotal</span><strong>{money(invoice.totals.subtotal)}</strong></div>
              <div className="preview-total-row"><span>Discount</span><strong>{money(-invoice.totals.discount)}</strong></div>
              <div className="preview-total-row"><span>CGST</span><strong>{money(invoice.totals.cgst)}</strong></div>
              <div className="preview-total-row"><span>SGST</span><strong>{money(invoice.totals.sgst)}</strong></div>
              <div className="preview-total-row"><span>IGST</span><strong>{money(invoice.totals.igst)}</strong></div>
              <div className="preview-total-row"><span>Round Off</span><strong>{money(invoice.totals.roundOff)}</strong></div>
              <div className="preview-total-row grand"><span>Grand Total</span><strong>{money(invoice.totals.grandTotal)}</strong></div>
            </div>
          </section>

          <div className="preview-words">
            Amount Chargeable (in words): {invoice.totals.amountInWords}
          </div>
          <footer className="preview-footer-grid">
            <div className="muted-text">
              <strong>Declaration:</strong> We declare that this invoice shows the actual price of the goods
              described and that all particulars are true and correct.
            </div>
            <div className="preview-signature-box">
              <div>for KNOBS SHOP</div>
              <div className="preview-signature-art">
                <img className="preview-sign" src="/Sir Sign.png" alt="Signature" />
                <img className="preview-seal" src="/Seal.png" alt="Company seal" />
              </div>
              <div>Authorised Signatory</div>
            </div>
          </footer>
        </div>
      </article>
    </div>
  );
}
