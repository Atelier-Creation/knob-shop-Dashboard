import React, { useEffect, useState, useRef } from "react";
import "./Invoice.css";
// Correct API Import Paths
import { getProductById } from "../../api/productApi";
import { getAddressByUserId } from "../../api/addressApi";
import { getUserById } from "../../api/authAPI";
import { useNavigate } from "react-router-dom";
import { getProfessionalInvoiceSnapshot } from "../../api/professionalInvoiceApi";

// Correct Image Paths (Root-relative)
import logo from "/logo.png";
import sealImage from "/Seal.png";
import signImage from "/Sir Sign.png";



const invoiceData = {
  company: {
    website: "knobsshop.store",
    phone: "+91 70924 66600",
    email: "ecom@knobsshop.store",
  },
  from: {
    name: "Knobsshop",
    address: ["746-747,Mettupalayam Road,X-Cut", "Coimbatore, 641301"],
    phone: "+91 70924 66600",
    fax: "(123) 456-7890",
    gstin: "33ABCDE1234F1Z5",
    state: "Tamil Nadu",
    stateCode: "33",
  },
  invoice: {
    description: "Product & Service Invoice",
  },
};

function Invoice() {
  const [invoiceDatas, setInvoiceData] = useState([]);
  const [invoiceAllDetails, setInvoiceAllDetails] = useState([]);
  const [newDesignLoading, setNewDesignLoading] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  // --- 1. Data Loading Logic ---
  useEffect(() => {
    const storedInvoice = localStorage.getItem("latestInvoiceData");
    if (storedInvoice) {
      try {
        const parsedInvoice = JSON.parse(storedInvoice);
        setInvoiceData(parsedInvoice);
      } catch (error) {
        console.error("❌ Error parsing invoice data:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (invoiceDatas?.cartItems?.length) {
      Promise.all(
        invoiceDatas.cartItems.map((item) => getProductById(item.productId))
      )
        .then((products) => {
          const mergedData = {
            ...invoiceDatas,
            productDetails: products,
          };
          setInvoiceAllDetails(mergedData);
        })
        .catch((err) =>
          console.error("❌ Error fetching product details:", err)
        );
    }
  }, [invoiceDatas]);

  useEffect(() => {
    const fetchRecentAddress = async () => {
      try {
        if (invoiceAllDetails?.userId && !invoiceAllDetails?.shippingAddress) {
          const res = await getAddressByUserId(invoiceAllDetails.userId);
          const addressArray = res?.addresses || [];

          if (addressArray.length > 0) {
            const sorted = [...addressArray].sort(
              (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
            );
            setInvoiceAllDetails((prev) => ({
              ...prev,
              shippingAddress: sorted[0],
            }));
          }
        }
      } catch (error) {
        console.error("❌ Error fetching recent address:", error);
      }
    };
    fetchRecentAddress();
  }, [invoiceAllDetails?.userId]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (invoiceAllDetails?.userId && !invoiceAllDetails?.userDetails) {
          const res = await getUserById(invoiceAllDetails.userId);
          if (res?.user) {
            setInvoiceAllDetails((prev) => ({
              ...prev,
              userDetails: res.user,
            }));
          }
        }
      } catch (error) {
        console.error("❌ Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [invoiceAllDetails?.userId]);

  // --- 2. Calculation Logic (Preserved from user request) ---
  const calc = (data) => {
    let grossTotal = 0;
    const invoiceFlatDiscount = data.discountAmount || 0;

    const state = data?.shippingAddress?.state ? data.shippingAddress.state.trim().toLowerCase() : "";
    const isTamilNadu =
      state === "tamil nadu" ||
      state === "tamilnadu" ||
      state === "taminadu" ||
      state === "tn" ||
      state.includes("tamil");

    // Pass 1: Calculate Gross Total
    data?.cartItems?.forEach((item, i) => {
      const qty = item.quantity || 1;
      // Use item.price from order as primary source of truth
      const selling = item.price || 0;
      grossTotal += selling * qty;
    });

    // Align with PaymentPage: Round subtotal (grossTotal) before discount
    grossTotal = Math.round(grossTotal);

    const effectiveTotal = Math.max(0, grossTotal - invoiceFlatDiscount);
    const ratio = grossTotal > 0 ? effectiveTotal / grossTotal : 1;

    let totalGST = 0;
    let totalTaxable = 0;
    const gstSummary = {};

    // Pass 2: Calculate Tax on Apportioned Amounts
    data?.cartItems?.forEach((item, i) => {
      const qty = item.quantity || 1;
      const product = data.productDetails?.[i] || {};
      const size = product.variant?.find(v => v.value === item.color)?.sizes?.find(s => s.size === item.size)
        || product.variant?.[0]?.sizes?.[0];

      // Use item.price
      const selling = item.price || 0;
      const gstRate = size?.taxPercentage || 18;

      const itemGross = selling * qty;
      const itemNet = itemGross * ratio;

      const taxable = itemNet / (1 + gstRate / 100);
      const gstAmt = itemNet - taxable;

      totalGST += gstAmt;
      totalTaxable += taxable;

      if (!gstSummary[gstRate]) {
        gstSummary[gstRate] = { taxable: 0, cgst: 0, sgst: 0, igst: 0 };
      }

      gstSummary[gstRate].taxable += taxable;

      if (isTamilNadu) {
        gstSummary[gstRate].cgst += gstAmt / 2;
        gstSummary[gstRate].sgst += gstAmt / 2;
      } else {
        gstSummary[gstRate].igst += gstAmt;
      }
    });

    const roundedTotal = Math.round(effectiveTotal);
    const roundOff = (roundedTotal - effectiveTotal).toFixed(2);

    return {
      subtotal: grossTotal,
      totalTaxable,
      totalGST,
      gstSummary,
      roundedTotal,
      roundOff,
      discount: invoiceFlatDiscount,
      isTamilNadu
    };
  };

  const { subtotal, totalTaxable, totalGST, gstSummary, roundedTotal, roundOff, isTamilNadu } = invoiceAllDetails?.cartItems
    ? calc(invoiceAllDetails)
    : { subtotal: 0, totalTaxable: 0, totalGST: 0, gstSummary: {}, roundedTotal: 0, roundOff: 0 };


  // --- 3. Utilities ---
  const toWords = (n) => {
    const a = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    const numberToWords = (num) => {
      if (num < 20) return a[num];
      if (num < 100) return b[Math.floor(num / 10)] + (num % 10 !== 0 ? "-" + a[num % 10] : "");
      if (num < 1000) return a[Math.floor(num / 100)] + " Hundred" + (num % 100 !== 0 ? " and " + numberToWords(num % 100) : "");
      if (num < 100000) return numberToWords(Math.floor(num / 1000)) + " Thousand" + (num % 1000 !== 0 ? " " + numberToWords(num % 1000) : "");
      return "";
    };
    return numberToWords(n) + " Rupees Only";
  };

  const handlePrint = () => {
    window.print();
  };

  const handleOpenNewDesign = async () => {
    const orderId = invoiceAllDetails?.orderId || invoiceDatas?.orderId;
    if (!orderId) return;

    try {
      setNewDesignLoading(true);
      await getProfessionalInvoiceSnapshot(orderId);
      navigate(`/professional-invoice/${orderId}`);
    } catch (error) {
      console.error("Failed to prepare professional invoice:", error);
      alert(error.response?.data?.message || "Failed to prepare new invoice design");
    } finally {
      setNewDesignLoading(false);
    }
  };



  console.log(invoiceAllDetails)
  // --- 4. Render (Hybrid Design) ---
  const { company, from, invoice } = invoiceData;
  const invoiceItems = invoiceAllDetails?.cartItems || [];
  const firstPageItemLimit = 8;
  const middlePageItemLimit = 12;
  const finalPageItemLimit = 7;
  const itemPages = [];

  if (invoiceItems.length <= firstPageItemLimit) {
    itemPages.push(invoiceItems);
  } else {
    itemPages.push(invoiceItems.slice(0, firstPageItemLimit));
    let index = firstPageItemLimit;

    while (invoiceItems.length - index > middlePageItemLimit + finalPageItemLimit) {
      itemPages.push(invoiceItems.slice(index, index + middlePageItemLimit));
      index += middlePageItemLimit;
    }

    const remainingItems = invoiceItems.length - index;
    if (remainingItems > finalPageItemLimit) {
      const preFinalCount = remainingItems - finalPageItemLimit;
      itemPages.push(invoiceItems.slice(index, index + preFinalCount));
      index += preFinalCount;
    }

    if (index < invoiceItems.length) {
      itemPages.push(invoiceItems.slice(index));
    }
  }

  const renderItemRow = (item, itemIndex) => {
    const qty = item.quantity || 1;
    const product = invoiceAllDetails.productDetails?.[itemIndex] || {};
    const unitPrice = Math.round(item.price || 0);
    const sellingTotal = unitPrice * qty;
    const matchingVariant = product.variant?.find(v => v.value === item.color);

    return (
      <tr key={`${item.productId || item.title || itemIndex}-${itemIndex}`}>
        <td className="p-1 text-gray-500">{itemIndex + 1}</td>
        <td className="p-1 font-medium text-invoice-dark">
          {item.productName || item.title || product.name}
          <div className="text-gray-400 mt-1">
            <strong>SKU: </strong>{(item.sku && item.sku !== "N/A") ? item.sku : (product.productId || item.size)}
            {matchingVariant?.title && <span className="ml-2"><strong>Finish: </strong>{matchingVariant.title}</span>}
            {item.size && <span className="ml-2"><strong>Size: </strong>{item.size}</span>}
          </div>
        </td>
        <td className="p-1 text-center text-gray-500">{product.hsncode || "9983"}</td>
        <td className="p-1 text-center text-invoice-dark">{qty}</td>
        <td className="p-1 text-right text-invoice-dark ">
          <i className="bi bi-currency-rupee"></i> {unitPrice}
        </td>
        <td className="p-1 text-right font-bold text-invoice-dark ">
          <i className="bi bi-currency-rupee"></i> {sellingTotal}
        </td>
      </tr>
    );
  };

  const renderInvoiceHeader = (showPrintButton) => (
    <>
      <div className="no-export flex flex-row-reverse justify-between items-center mb-4">
        <div className="no-export flex gap-2">
          {showPrintButton && (
            <>
              <button
                onClick={handleOpenNewDesign}
                disabled={newDesignLoading || (!invoiceAllDetails?.orderId && !invoiceDatas?.orderId)}
                className="bg-invoice-dark border border-invoice-dark text-white px-3 py-1 rounded hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {newDesignLoading ? "Preparing..." : "New Design"}
              </button>
              <button onClick={handlePrint} className="bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-50 flex items-center gap-2">
                <i className="fa fa-print"></i> Print
              </button>
            </>
          )}
        </div>
        <h2 className="font-bold text-invoice-dark">{company.name}</h2>
      </div>

      <div className="bg-invoice-gray py-4 px-4 rounded-sm -mx-4 mb-2 flex justify-between">
        <div className="w-1/3 pr-4">
          <small className="block text-gray-500 uppercase font-semibold mb-1">From</small>
          <address className="not-italic text-invoice-dark">
            <strong>{from.name}</strong><br />
            {from.address.map((line, i) => <div key={i}>{line}</div>)}
            Phone: {from.phone}<br />
            GSTIN: {from.gstin}
          </address>
        </div>

        <div className="w-1/3 px-4 border-l border-gray-300 border-dashed">
          <small className="block text-gray-500 uppercase font-semibold mb-1">To</small>
          {invoiceAllDetails?.shippingAddress ? (
            <address className="not-italic text-invoice-dark">
              {invoiceAllDetails.company?.companyName ? (
                <><strong>{invoiceAllDetails.company.companyName}</strong><br /></>
              ) : (
                <><strong>{invoiceAllDetails.shippingAddress?.name}</strong><br /></>
              )}
              {invoiceAllDetails.shippingAddress?.street}<br />
              {invoiceAllDetails.shippingAddress?.city}, {invoiceAllDetails.shippingAddress?.district}<br />
              {invoiceAllDetails.shippingAddress?.state} - {invoiceAllDetails.shippingAddress?.pincode}<br />
              {invoiceAllDetails.shippingAddress?.phone}
              {invoiceAllDetails.company?.GST && (
                <><br />GSTIN: {invoiceAllDetails.company.GST}</>
              )}
            </address>
          ) : (
            <div className="font-bold text-invoice-dark">PICK UP AT STORE</div>
          )}
        </div>

        <div className="w-1/3 pl-4 text-right">
          <div className="mb-2">
            <small className="text-gray-500 block">Payment Method</small>
            <span className="font-semibold text-invoice-dark">{invoiceAllDetails?.paymentMethod || "N/A"}</span>
          </div>
          <div className="mb-2">
            <small className="text-gray-500 block">Order Date</small>
            <span className="font-semibold text-invoice-dark">{invoiceAllDetails?.invoiceDate || "N/A"}</span>
          </div>
          <div>
            <small className="text-gray-500 block">Order ID</small>
            <span className="font-semibold text-invoice-dark">{invoiceAllDetails?.orderId || "N/A"}</span>
          </div>
        </div>
      </div>
    </>
  );

  const renderTotals = () => (
    <>
      <div className="bg-invoice-gray p-1 flex items-stretch relative overflow-hidden my-4 invoice-totals-section">
        <div className="w-full flex">
          <div className="w-2/3 p-1 flex justify-between gap-3 text-right text-gray-600 font-medium">
            <div>SUBTOTAL <span className="ml-2 mt-3 text-invoice-dark  flex items-center"><i className="bi bi-currency-rupee"></i> {totalTaxable.toFixed(2)}</span></div>
            {isTamilNadu ? (
              <>
                <div className="">
                  <span className="italic text-gray-500">CGST ({totalGST > 0 ? "9" : "0"}%)</span>
                  <span className="mt-3 text-invoice-dark flex items-center"><i className="bi bi-currency-rupee"></i> {(totalGST / 2).toFixed(2)}</span>
                </div>
                <div >
                  <span className="italic text-gray-500">SGST ({totalGST > 0 ? "9" : "0"}%)</span>
                  <span className="mt-3 text-invoice-dark flex items-center"><i className="bi bi-currency-rupee"></i> {(totalGST / 2).toFixed(2)}</span>
                </div>
              </>
            ) : (
              <div >
                <span className="italic text-gray-500">IGST</span>
                <span className="flex mt-3 text-invoice-dark items-center"><i className="bi bi-currency-rupee"></i> {totalGST.toFixed(2)}</span>
              </div>
            )}
            <div>GST TOTAL <span className="ml-2 mt-3 text-invoice-dark  flex items-center"><i className="bi bi-currency-rupee"></i> {totalGST.toFixed(2)}</span></div>
            <div>ROUND OFF <span className="ml-2 mt-3 text-invoice-dark  flex items-center"><i className="bi bi-currency-rupee"></i> {roundOff}</span></div>
          </div>
          <div className="w-1/3 bg-invoice-dark p-1 flex flex-col justify-center text-right text-white">
            <span className="opacity-75 block">TOTAL</span>
            <span className="font-bold !text-2xl "><i className="bi bi-currency-rupee !text-xl"></i> {roundedTotal.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>

      <div className="mb-2 text-sm invoice-gst-section">
        <h5 className="font-bold text-gray-700 mb-1">GST Summary</h5>
        <table className="w-full text-center border-collapse border border-gray-200">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="border border-gray-200 p-1 font-medium">GST %</th>
              <th className="border border-gray-200 p-1 font-medium">Taxable Value</th>
              <th className="border border-gray-200 p-1 font-medium">CGST Amt</th>
              <th className="border border-gray-200 p-1 font-medium">SGST Amt</th>
              <th className="border border-gray-200 p-1 font-medium">Total Tax</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(gstSummary).map(([rate, data], i) => (
              <tr key={i}>
                <td className="border border-gray-200 p-1">{rate}%</td>
                <td className="border border-gray-200 p-1"><i className="bi bi-currency-rupee"></i> {data.taxable.toFixed(2)}</td>
                <td className="border border-gray-200 p-1"><i className="bi bi-currency-rupee"></i> {data.cgst.toFixed(2)}</td>
                <td className="border border-gray-200 p-1"><i className="bi bi-currency-rupee"></i> {data.sgst.toFixed(2)}</td>
                <td className="border border-gray-200 p-1"><i className="bi bi-currency-rupee"></i> {(data.cgst + data.sgst + data.igst).toFixed(2)}</td>
              </tr>
            ))}
            <tr className="bg-gray-50 font-bold">
              <td colSpan={4} className="border border-gray-200 p-1 text-right">Invoice Total</td>
              <td className="border border-gray-200 p-1"><i className="bi bi-currency-rupee"></i> {roundedTotal.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );

  const renderFinalFooter = () => (
    <div className="invoice-final-footer">
      <div className="bg-invoice-gray p-2 flex items-center gap-4 font-semibold text-invoice-dark">
        <span>Amount Chargeable (in words):</span>
        <span className="italic font-normal">{toWords(roundedTotal)}</span>
      </div>

      <div className="mt-2 flex justify-between items-end px-4">
        <div className="text-gray-500 w-1/2">
          <p className="font-bold mb-1 text-gray-700">Declaration:</p>
          <p>We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.</p>
        </div>

        <div className="flex flex-col items-center">
          <p className="font-bold text-gray-700 mb-2">for KNOBS SHOP</p>
          <div className="sign-contain-invoice">
            <img src={signImage} className="seal-image-invoice" alt="seal" />
            <img src={sealImage} className="sign-image-invoice" alt="sign" />
          </div>
          <p className="text-gray-600 mt-2">Authorised Signatory</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full flex flex-col items-center gap-8 bg-gray-100 py-10 print:py-0 print:bg-white print:gap-0" id="invoice-to-download" ref={containerRef}>
      {itemPages.map((pageItems, pageIndex) => {
        const isLastPage = pageIndex === itemPages.length - 1;
        const previousCount = itemPages
          .slice(0, pageIndex)
          .reduce((sum, page) => sum + page.length, 0);

        return (
          <div
            key={pageIndex}
            className="invoice-letterhead invoice-print-page shadow-lg print:shadow-none"
          >
            <div className="invoice-page-content pt-[60mm] px-8 pb-4 h-full flex flex-col">
              <div>
                {renderInvoiceHeader(pageIndex === 0)}

                <div className="my-3 overflow-hidden rounded border border-invoice-gray invoice-items-table">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-invoice-gray text-invoice-dark uppercase tracking-wider border-b border-invoice-gray">
                        <th className="p-1 text-left">SI No.</th>
                        <th className="p-1 text-left w-1/3">Product</th>
                        <th className="p-1 text-center">HSN/SAC</th>
                        <th className="p-1 text-center">Qty</th>
                        <th className="p-1 text-right">Rate</th>
                        <th className="p-1 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {pageItems.map((item, index) => renderItemRow(item, previousCount + index))}

                      {isLastPage && invoiceAllDetails?.discountAmount > 0 && (
                        <tr className="bg-white border-t border-invoice-gray">
                          <td colSpan={5} className="p-1 text-right font-medium text-gray-600">
                            DISCOUNT {invoiceAllDetails.couponCode && <span className="text-blue-600">({invoiceAllDetails.couponCode})</span>}
                          </td>
                          <td className="p-1 text-right font-bold text-green-600 ">
                            - <i className="bi bi-currency-rupee"></i> {invoiceAllDetails.discountAmount.toFixed(2)}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {!isLastPage && (
                  <div className="invoice-continued-note text-right text-gray-500 font-semibold">
                    Continued on next page
                  </div>
                )}

                {isLastPage && renderTotals()}
              </div>

              {isLastPage && renderFinalFooter()}
            </div>
          </div>
        );
      })}
    </div >
  );
}

export default Invoice;
