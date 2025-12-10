import React, { useEffect, useState, useRef } from "react";
import logo from "/logo.png";
import sealImage from "/Seal.png";
import signImage from "/Sir Sign.png";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { getProductById } from "../../api/productApi";
import { getAddressByUserId } from "../../api/addressApi";
import { getUserById } from "../../api/authAPI";

export default function Invoice() {
  const [invoiceDatas, setInvoiceData] = useState(null);
  const [invoiceAllDetails, setInvoiceAllDetails] = useState(null);
  const [loadingPdf, setLoadingPdf] = useState(false);
  const containerRef = useRef(null);

  // load stored invoice payload
  useEffect(() => {
    const stored = localStorage.getItem("latestInvoiceData");
    if (!stored) return;
    try {
      setInvoiceData(JSON.parse(stored));
      console.log(JSON.parse(stored));
    } catch (e) {
      console.error("Invalid latestInvoiceData in localStorage", e);
    }
  }, []);

  // enrich with product details
  useEffect(() => {
    if (!invoiceDatas?.cartItems?.length) return;

    let mounted = true;
    (async () => {
      try {
        const products = await Promise.all(
          invoiceDatas.cartItems.map((it) => getProductById(it.productId))
        );
        if (!mounted) return;
        setInvoiceAllDetails({ ...invoiceDatas, productDetails: products });
      } catch (err) {
        console.error("Failed to fetch product details", err);
        if (mounted) setInvoiceAllDetails({ ...invoiceDatas });
      }
    })();

    return () => (mounted = false);
  }, [invoiceDatas]);

  // fetch recent address if userId exists and shippingAddress missing
  useEffect(() => {
    if (!invoiceAllDetails?.userId || invoiceAllDetails?.shippingAddress)
      return;
    let mounted = true;
    (async () => {
      try {
        const res = await getAddressByUserId(invoiceAllDetails.userId);
        const arr = res?.addresses || [];
        if (!arr.length) return;
        const sorted = arr.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );
        if (mounted)
          setInvoiceAllDetails((p) => ({ ...p, shippingAddress: sorted[0] }));
      } catch (e) {
        console.error("address fetch failed", e);
      }
    })();
    return () => (mounted = false);
  }, [invoiceAllDetails?.userId]);

  // fetch user details if not present
  useEffect(() => {
    if (!invoiceAllDetails?.userId || invoiceAllDetails?.userDetails) return;
    let mounted = true;
    (async () => {
      try {
        const res = await getUserById(invoiceAllDetails.userId);
        if (mounted && res?.user)
          setInvoiceAllDetails((p) => ({ ...p, userDetails: res.user }));
      } catch (e) {
        console.error("user fetch failed", e);
      }
    })();
    return () => (mounted = false);
  }, [invoiceAllDetails?.userId]);

  var isTamilNadu = "";

  // calculations
 const calc = (data) => {
  let subtotal = 0;
  let totalGST = 0;
  const gstSummary = {};

  isTamilNadu =
      data?.shippingAddress?.state?.toLowerCase() === "tamil nadu" ||
      data?.shippingAddress?.state?.toLowerCase() === "tamilnadu" ||
      data?.shippingAddress?.state?.toLowerCase() === "tn";
      
  const invoiceFlatDiscount = data.discountAmount || 0;

  data?.cartItems?.forEach((item, i) => {
    const qty = item.quantity || 1;
    const size =
      data.productDetails?.find(v => v.value === item.color)
        ?.sizes?.find(s => s.size === item.size);

    const selling = size?.sellingPrice || item.price || 0;  // GST inclusive
    const gstRate = size?.taxPercentage || 18;

    const taxable = selling / (1 + gstRate / 100);
    const gstAmt = selling - taxable;

    subtotal += selling * qty;     // ✔ only once including GST
    totalGST += gstAmt * qty;      // ✔ only for GST breakdown (not to add again)

    if (!gstSummary[gstRate]) {
      gstSummary[gstRate] = { taxable: 0, cgst: 0, sgst: 0, igst: 0 };
    }

    gstSummary[gstRate].taxable += taxable * qty;

    if (isTamilNadu) {
      gstSummary[gstRate].cgst += (gstAmt * qty) / 2;
      gstSummary[gstRate].sgst += (gstAmt * qty) / 2;
    } else {
      gstSummary[gstRate].igst += gstAmt * qty;
    }
  });

  // ✔ DO NOT add totalGST again
  const grandBeforeRound = subtotal - invoiceFlatDiscount;

  const roundedTotal = Math.round(grandBeforeRound);
  const roundOff = (roundedTotal - grandBeforeRound).toFixed(2);

  return {
    subtotal,
    totalGST,  // ✔ only for showing GST table
    gstSummary,
    roundedTotal,
    roundOff,
    discount: invoiceFlatDiscount,
  };
};

  const {
    subtotal = 0,
    totalGST = 0,
    gstSummary = {},
    roundedTotal = 0,
    roundOff = 0,
    discount = 0,
  } = invoiceAllDetails ? calc(invoiceAllDetails) : {};

  // Print
  const handlePrint = () => {
    window.print();
  };

  // Download PDF using html2canvas + jsPDF
const handleDownloadPDF = async () => {
  const node = containerRef.current;

  if (!node) {
    console.error("Ref not found");
    alert("Invoice not ready!");
    return;
  }

  setLoadingPdf(true);

  try {
    const buttons = document.querySelectorAll(".no-print");
    buttons.forEach((b) => (b.style.display = "none"));
    document.getElementById("head").style.display = "none";

    await new Promise((r) => setTimeout(r, 300));

    const canvas = await html2canvas(node, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff"
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = pdf.internal.pageSize.width;
    const imgHeight = (canvas.height * pageWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pageWidth, imgHeight);
    pdf.save(`Invoice_${invoiceAllDetails?.orderId || "invoice"}.pdf`);

    buttons.forEach((b) => (b.style.display = "inline-block"));
    document.getElementById("head").style.display = "flex";
  } catch (err) {
    console.error(err);
    alert("Failed to generate PDF");
  } finally {
    setLoadingPdf(false);
  }
};


  // small helper for safe access
  const getProductName = (item, idx) => {
    return (
      item.product?.productName ||
      item.productName ||
      item.title ||
      `Item ${idx + 1}`
    );
  };

  // words (small utility)
  const toWords = (n) => {
    if (!n && n !== 0) return "Zero Rupees Only";
    const a = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const b = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];
    const numberToWords = (num) => {
      if (num < 20) return a[num];
      if (num < 100)
        return b[Math.floor(num / 10)] + (num % 10 ? "-" + a[num % 10] : "");
      if (num < 1000)
        return (
          a[Math.floor(num / 100)] +
          " Hundred" +
          (num % 100 ? " and " + numberToWords(num % 100) : "")
        );
      if (num < 100000)
        return (
          numberToWords(Math.floor(num / 1000)) +
          " Thousand" +
          (num % 1000 ? " " + numberToWords(num % 1000) : "")
        );
      return "";
    };
    return numberToWords(n) + " Rupees Only";
  };

  console.log(invoiceAllDetails);
  return (
    <div
      style={{ minHeight: "100vh", backgroundColor: "rgb(249 250 251)" }}
      className="p-6 print:bg-white print:p-0"
    >
      {/* Print-only helpers */}
      <style>
        {`@media print{ body * {visibility: hidden !important;} #filler {visibility : hidden !important;} #invoice-to-download,#invoice-to-download * {visibility: visible !important; } #invoice-to-download { position: absolute; left: 0; top: 0; width: 100%; } .no-print{display:none} .page-break{page-break-inside:avoid}} @page{size:A4;margin:0mm}`}
      </style>

      <div
        style={{
          maxWidth: "768px",
          margin: "0 auto",
          backgroundColor: "white",
          boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        }}
        
      >
        {/* Top bar actions */}
        <div
          style={{ borderBottom: "1px solid rgb(156 163 175)" }}
          className="flex items-center justify-between p-4 print:hidden"
          id="head"
        >
          <div className="flex items-center gap-3">
            <img src={logo} alt="logo" className="w-28 object-contain" />
            <div style={{ fontSize: "0.875rem" }}>
              <div className="font-semibold">Knobsshop</div>
              <div style={{ fontSize: "0.75rem", color: "rgb(75 85 99)" }}>
                746-747, Mettupalayam Road, X-Cut, Coimbatore
              </div>
              <div style={{ fontSize: "0.75rem", color: "rgb(75 85 99)" }}>
                GSTIN: 33ABCDE1234F1Z5
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              style={{
                backgroundColor: "white",
                border: "1px solid rgb(156 163 175)",
                padding: "4px 12px",
                borderRadius: "4px",
                fontSize: "0.875rem",
              }}
              className="no-print"
            >
              Print
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={loadingPdf}
              style={{
                backgroundColor: "rgb(79 70 229)", // Replaced bg-indigo-600
                color: "white",
                padding: "4px 12px",
                borderRadius: "4px",
                fontSize: "0.875rem",
              }}
              className="no-print"
            >
              {loadingPdf ? "Generating..." : "Download PDF"}
            </button>
          </div>
        </div>

        {/* Header details */}
        <div className="p-6" ref={containerRef} id="invoice-to-download" >
          <div className="grid grid-cols-12 gap-4 items-start">
            <div className="col-span-7">
              <h1 className="text-2xl font-bold">Tax Invoice</h1>
              <p
                style={{
                  marginTop: "0.5rem",
                  fontSize: "0.875rem",
                  color: "rgb(55 65 81)",
                }}
              >
                Supply of goods/services as per details below.
              </p>

              <div className="mt-6 print:mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div style={{ fontWeight: "500", color: "rgb(31 41 55)" }}>
                    From
                  </div>
                  <div style={{ marginTop: "0.25rem", color: "rgb(55 65 81)" }}>
                    Knobsshop
                  </div>
                  <div style={{ color: "rgb(75 85 99)" }}>
                    746-747, Mettupalayam Road, X-Cut
                  </div>
                  <div style={{ color: "rgb(75 85 99)" }}>
                    Coimbatore, 641301
                  </div>
                  <div style={{ color: "rgb(75 85 99)" }}>
                    Ph: +91 70924 66600
                  </div>
                </div>

                <div>
                  <div style={{ fontWeight: "500", color: "rgb(31 41 55)" }}>
                    To
                  </div>
                  {invoiceAllDetails?.shippingAddress ? (
                    <>
                      <div style={{ marginTop: "0.25rem", fontWeight: "600" }}>
                        {invoiceAllDetails.userDetails?.name ||
                          invoiceAllDetails.shippingAddress?.name}
                      </div>
                      <div style={{ color: "rgb(75 85 99)" }}>
                        {invoiceAllDetails.shippingAddress?.street}
                      </div>
                      <div style={{ color: "rgb(75 85 99)" }}>
                        {invoiceAllDetails.shippingAddress?.city},{" "}
                        {invoiceAllDetails.shippingAddress?.district}
                      </div>
                      <div style={{ color: "rgb(75 85 99)" }}>
                        {invoiceAllDetails.shippingAddress?.state} -{" "}
                        {invoiceAllDetails.shippingAddress?.pincode}
                      </div>
                      <div style={{ color: "rgb(75 85 99)" }}>
                        Ph:{" "}
                        {invoiceAllDetails.shippingAddress?.phone ||
                          invoiceAllDetails.userDetails?.phone}
                      </div>
                    </>
                  ) : (
                    <div style={{ marginTop: "0.25rem", fontWeight: "600" }}>
                      PICKUP AT STORE
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div
              className="col-span-5 pl-6"
              style={{ borderLeft: "1px solid rgb(156 163 175)" }}
            >
              <div style={{ fontSize: "0.875rem" }}>
                <div className="flex justify-between">
                  <span style={{ color: "rgb(75 85 99)" }}>Invoice No</span>
                  <span className="font-semibold">
                    {invoiceAllDetails?.orderId || invoiceDatas?.orderId || "-"}
                  </span>
                </div>
                <div className="flex justify-between mt-2">
                  <span style={{ color: "rgb(75 85 99)" }}>Invoice Date</span>
                  <span className="font-semibold">
                    {invoiceAllDetails?.invoiceDate ||
                      invoiceDatas?.invoiceDate ||
                      new Date().toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between mt-2">
                  <span style={{ color: "rgb(75 85 99)" }}>Payment</span>
                  <span className="font-semibold">
                    {invoiceAllDetails?.paymentMethod ||
                      invoiceDatas?.paymentMethod ||
                      "-"}
                  </span>
                </div>
                <div className="flex justify-between mt-2">
                  <span style={{ color: "rgb(75 85 99)" }}>Order Total</span>
                  <span className="font-semibold">
                    ₹
                    {(
                      invoiceAllDetails?.totalAmount ||
                      invoiceDatas?.totalAmount ||
                      0
                    ).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Items table */}
          <div className="mt-6 print:mt-4">
            <div className="overflow-x-auto">
              <table
                style={{
                  borderCollapse: "collapse",
                  border: "1px solid rgb(229 231 235)",
                }}
                className="w-full text-sm table-auto"
              >
                <thead style={{ backgroundColor: "rgb(243 244 246)" }}>
                  <tr>
                    <th
                      className="p-3 text-left"
                      style={{
                        border: "1px solid rgb(209 213 219)",
                        backgroundColor: "rgb(254 243 199)",
                      }} // Replaced bg-amber-100
                    >
                      SI NO.
                    </th>
                    <th
                      className="p-3 text-left"
                      style={{
                        border: "1px solid rgb(209 213 219)",
                        backgroundColor: "rgb(254 243 199)",
                      }} // Replaced bg-amber-100
                    >
                      Product
                    </th>
                    <th
                      className="p-3 text-center"
                      style={{
                        border: "1px solid rgb(209 213 219)",
                        backgroundColor: "rgb(254 243 199)",
                      }} // Replaced bg-amber-100
                    >
                      HSN/SAC
                    </th>
                    <th
                      className="p-3 text-center"
                      style={{
                        border: "1px solid rgb(209 213 219)",
                        backgroundColor: "rgb(254 243 199)",
                      }} // Replaced bg-amber-100
                    >
                      QTY
                    </th>
                    <th
                      className="p-3 text-right"
                      style={{
                        border: "1px solid rgb(209 213 219)",
                        backgroundColor: "rgb(254 243 199)",
                      }} // Replaced bg-amber-100
                    >
                      RATE
                    </th>
                    <th
                      className="p-3 text-right"
                      style={{
                        border: "1px solid rgb(209 213 219)",
                        backgroundColor: "rgb(254 243 199)",
                      }} // Replaced bg-amber-100
                    >
                      Tax AMT
                    </th>
                    <th
                      className="p-3 text-right"
                      style={{
                        border: "1px solid rgb(209 213 219)",
                        backgroundColor: "rgb(254 243 199)",
                      }} // Replaced bg-amber-100
                    >
                      TOTAL
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceAllDetails?.cartItems?.map((item, i) => {
                    const qty = item.quantity || 1;

                    const size =
                      invoiceAllDetails.productDetails[i]?.variant?.[0]
                        ?.sizes?.[0];
                    // const mrp = size?.mrp || 0;
                    const selling = size?.sellingPrice || item.price || 0; // final price including GST
                    const gstRate = size?.taxPercentage || 18;

                    const taxable = selling / (1 + gstRate / 100); // before GST
                    const gstAmt = selling - taxable;

                    const rowTotal = selling * qty; // final amount inc GST * qty

                    return (
                      <tr
                        key={i}
                        style={{ borderBottom: "1px solid rgb(209 213 219)" }} // Replaced border-gray-300
                      >
                        <td className="p-3">{i + 1}</td>

                        <td className="p-3">
                          <div className="font-medium flex items-center gap-1">
                            {getProductName(item, i)}
                            {item.size}
                            <div
                              style={{
                                height: "0.75rem",
                                width: "0.75rem",
                                borderRadius: "9999px",
                                border: "1px solid rgb(156 163 175)", // Replaced border-gray-400
                                backgroundColor: item.color,
                              }}
                            />
                          </div>
                          <div
                            style={{
                              fontSize: "0.75rem",
                              color: "rgb(107 114 128)",
                            }} // Replaced text-xs text-gray-500
                          >
                            {item.sku}
                          </div>
                        </td>

                        <td className="p-3 text-center">
                          {invoiceAllDetails.productDetails[i]?.hsncode || "-"}
                        </td>

                        <td className="p-3 text-center">{qty}</td>

                        <td className="p-3 text-right">
                          ₹{taxable.toFixed(2)} {/* RATE before GST */}
                        </td>

                        <td className="p-3 text-right">
                          { `₹${(gstAmt).toFixed(2)}`}
                        </td>

                        <td className="p-3 text-right">
                          ₹{rowTotal.toFixed(2)} {/* includes GST */}
                        </td>
                      </tr>
                    );
                  })}

                  {/* Empty filler rows to make table look consistent on short item lists */}
                  {Array.from({
                    length: Math.max(
                      0,
                      6 - (invoiceAllDetails?.cartItems?.length || 0)
                    ),
                  }).map((_, idx) => (
                    <tr id="filler" key={`filler-${idx}`} className="h-5">
                      <td className="p-2">&nbsp;</td>
                      <td className="p-2">&nbsp;</td>
                      <td className="p-2">&nbsp;</td>
                      <td className="p-2">&nbsp;</td>
                      <td className="p-2">&nbsp;</td>
                      <td className="p-2">&nbsp;</td>
                      <td className="p-2">&nbsp;</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* GST summary & totals (PRINT-SAFE, NO GRID) */}
            <div className="mt-6 print:mt-4">
              {/* Left: GST Summary */}
              <div
                style={{
                  display: "inline-block",
                  width: "70%",
                  marginBottom: "1rem",
                }}
                className="md:mb-0"
              >
                <div
                  style={{
                    backgroundColor: "rgb(249 250 251)", // Replaced bg-gray-50
                    padding: "1.5rem",
                    borderRadius: "0.25rem",
                    border: "1px solid rgb(209 213 219)", // Replaced border-gray-300
                  }}
                >
                  <div className="font-semibold mb-3">GST Summary</div>
                  <table className="w-full text-sm">
                    <thead>
                      <tr
                        style={{
                          fontSize: "0.75rem",
                          color: "rgb(75 85 99)",
                          textAlign: "left",
                        }} // Replaced text-xs text-gray-600
                      >
                        <th style={{paddingBottom:"10px"}}>GST%</th>
                        <th style={{ textAlign: "right", paddingBottom:"10px" }}>Taxable Value</th>
                        {isTamilNadu ? (
                          <>
                            <th style={{ textAlign: "right", paddingBottom:"10px" }}>CGST</th>
                            <th style={{ textAlign: "right", paddingBottom:"10px" }}>SGST</th>
                            <th style={{ textAlign: "right", paddingBottom:"10px" }}>Total Tax</th>
                          </>
                        ) : (
                          <>
                            <th style={{ textAlign: "right", paddingBottom:"10px" }}>IGST</th>
                            <th style={{ textAlign: "right", paddingBottom:"10px" }}>Total Tax</th>
                          </>
                        )}
                      </tr>
                    </thead>

                    <tbody>
                      {Object.entries(gstSummary).map(([rate, data], i) => (
                        <tr
                          key={i}
                          style={{ borderTop: "1px solid rgb(209 213 219)" }} // Replaced border-gray-300
                        >
                          <td className="py-2">{rate}%</td>
                          <td className="py-2 text-right">
                            ₹{data.taxable.toFixed(2)}
                          </td>

                          {isTamilNadu ? (
                            <>
                              <td className="py-2 text-right">
                                ₹{data.cgst.toFixed(2)}
                              </td>
                              <td className="py-2 text-right">
                                ₹{data.sgst.toFixed(2)}
                              </td>
                              <td className="py-2 text-right">
                                ₹{(data.cgst + data.sgst).toFixed(2)}
                              </td>
                            </>
                          ) : (
                            <>
                              <td className="py-2 text-right">
                                ₹{data.igst.toFixed(2)}
                              </td>
                              <td className="py-2 text-right">
                                ₹{data.igst.toFixed(2)}
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right: Totals Box */}
              <div
                style={{
                  display: "inline-block",
                  width: "28%",
                  float: "right",
                }}
              >
                <div
                  style={{
                    padding: "1rem",
                    border: "1px solid rgb(156 163 175)", // Replaced border-gray-400
                    borderRadius: "0.25rem",
                    backgroundColor: "rgb(249 250 251)", // Replaced bg-gray-50
                  }}
                >
                  <div className="flex justify-between text-sm mb-2">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-sm mb-2">
                    <span>GST Total</span>
                    <span>₹{totalGST.toFixed(2)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-sm mb-2">
                      <span>Discount</span>
                      <span>- ₹{discount}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm mb-2">
                    <span>Round Off</span>
                    <span>₹{roundOff}</span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "1.125rem",
                      fontWeight: "bold",
                      borderTop: "1px solid rgb(156 163 175)", // Replaced border-gray-400
                      paddingTop: "0.5rem",
                    }}
                  >
                    <span>Total</span>
                    <span>₹{roundedTotal.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Amount in words & notes (PRINT-SAFE, NO GRID) */}
            <div className="mt-6 print:mt-4 ">
              {/* Left */}
              <div style={{ display: "inline-block", width: "70%" }}>
                <div className="font-medium mb-2">
                  Amount Chargeable (in words)
                </div>
                <div className="italic">{toWords(roundedTotal)}</div>

                <div
                  style={{
                    marginTop: "1rem",
                    fontSize: "0.875rem",
                    color: "rgb(55 65 81)",
                  }} // Replaced text-sm text-gray-700
                >
                  <div className="font-semibold mb-1">Notes</div>
                  <ul style={{ listStyleType: "disc", marginLeft: "1rem" }}>
                    <li>Make all cheques payable to Knobsshop</li>
                    <li>Payment is due within 30 days</li>
                    <li>For queries: ecom@knobsshop.store | +91 70924 66600</li>
                  </ul>
                </div>
              </div>

              {/* Right */}
              <div
                style={{
                  display: "inline-block",
                  width: "28%",
                  textAlign: "right",
                  marginTop: "1.5rem",
                }}
                className="md:mt-0"
              >
                <div className="mb-6">
                  <img
                    src={signImage}
                    alt="sign"
                    className="inline-block h-18 w-[49%] object-contain"
                  />
                  <img
                    src={sealImage}
                    alt="seal"
                    style={{ opacity: 0.8 }} // Replaced opacity-80
                    className="inline-block h-28 ml-2 w-[47%] object-contain"
                  />
                </div>
                <div className="font-semibold">Authorised Signatory</div>
                <div style={{ fontSize: "0.75rem", color: "rgb(75 85 99)" }}>
                  For Knobsshop
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: "2rem",
                textAlign: "center",
                fontSize: "0.75rem",
                color: "rgb(107 114 128)",
              }} // Replaced text-xs text-gray-500
            >
              SUBJECT TO COIMBATORE JURISDICTION • This is a Computer Generated
              Invoice
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
