import axios from "axios";

// Remove non-ASCII characters and trim
const sanitizeASCII = (str) =>
  str ? str.replace(/[^\u0020-\u007E]/g, "").trim() : "";

// Use fallback with trimming
const fallback = (value, fallbackValue) =>
  typeof value === "string" && value.trim() ? value.trim() : fallbackValue;

// Limit to max length
const limit = (str, len) => (str ? str.toString().slice(0, len) : "");

// Clean phone → only digits, trim to 10
const cleanPhone = (phone) =>
  phone ? phone.replace(/\D/g, "").slice(-10) : "0000000000";

// Split long address to DTDC spec
function splitAddress(address) {
  const clean = sanitizeASCII(address).replace(/,/g, "");
  return {
    line1: limit(clean, 30),
    line2: limit(clean.slice(30), 30),
  };
}

// Generate DTDC-safe reference ID
function generateSOINRef() {
  const now = new Date();

  const year = String(now.getFullYear()).slice(2);
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");

  return `SOIN${year}${month}${day}${hh}${mm}${ss}`.slice(0, 15);
}

export const createDTDCConsignment = async (orderData) => {
  try {
    const {
      invoiceNo,
      invoiceDate,
      totalAmount,
      ewayBill,
      shippingAddress,
      cartItems,
      dimensions,
    } = orderData;

    console.log(cartItems)

    const validCity = limit(sanitizeASCII(shippingAddress.city), 30);
    const validState = sanitizeASCII(shippingAddress.state)
      .replace(/\s+/g, "")
      .toUpperCase(); // → TAMILNADU

    const address = splitAddress(shippingAddress.street);

    const formatDTDCDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

    const formattedItems = cartItems.map((item) => ({
      item_name: limit(item.productName || item.name, 30),
      item_quantity: item.quantity,
      item_price: item.price,
      item_sku: item.sku || item.productId || "SKU123",
    }));

    const payload = {
      consignments: [
        {
          customer_code: import.meta.env.VITE_DTDC_CUSTOMER_CODE,
          service_type_id: "B2C PRIORITY",
          load_type: "NON-DOCUMENT",
          description: cartItems
            .map((item) => `${item.productName || "Item"} x${item.quantity}`)
            .join(", "),

          dimension_unit: "cm",
          length: String(dimensions.length > 0 ? dimensions.length : 1),
          width: String(dimensions.width > 0 ? dimensions.width : 1),
          height: String(dimensions.height > 0 ? dimensions.height : 1),
          weight: String(dimensions.weight > 0 ? dimensions.weight : 1),
          weight_unit: "kg",
          declared_value: String(totalAmount),
          num_pieces: String(cartItems.length),
          product_code: "E",
          pieces: [
            {
              product_code: "E",
              items: formattedItems,
            },
          ],
          origin_details: {
            name: "knobsshop",
            phone: cleanPhone("917092466600"),
            alternate_phone: "04222550744",
            address_line_1: limit(
              "746 747, Mettupalayam Rd, R.S. Puram".replace(/,/g, ""),
              30
            ),
            address_line_2: limit("Coimbatore Tamil Nadu", 30),
            pincode: "641012",
            city: "Coimbatore",
            state: "TAMILNADU",
          },
          destination_details: {
            name: limit(fallback(shippingAddress.name, "Receiver"), 30),
            phone: cleanPhone(shippingAddress.phone),
            alternate_phone: cleanPhone(shippingAddress.alternate_phone),
            address_line_1: address.line1,
            address_line_2: address.line2,
            pincode: shippingAddress.pincode.toString().slice(0, 6),
            city: validCity,
            state: validState,
          },
          return_details: {
            address_line_1: "746 747, Mettupalayam Rd, R.S. Puram",
            address_line_2: "Coimbatore, Tamil Nadu",
            city_name: "Coimbatore",
            name: "Knobsshop",
           phone: cleanPhone("917092466600"),
            pincode: "641012",
            state_name: "TAMILNADU",
            email: "ecom@knobsshop.store",
            alternate_phone: "04222550744",
          },
          customer_reference_number: generateSOINRef(),
          cod_collection_mode: "",
          cod_amount: "",
          commodity_id: "99",
          eway_bill: ewayBill,
          is_risk_surcharge_applicable: false,
          invoice_number: invoiceNo,
          invoice_date: formatDTDCDate(invoiceDate),
          reference_number: "",
        },
      ],
    };

    console.log("📦 Final Payload to Send to DTDC:", payload);

    const response = await axios.post(
      "https://dtdcapi.shipsy.io/api/customer/integration/consignment/softdata",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": import.meta.env.VITE_DTDC_API_KEY,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("❌ Error creating DTDC consignment:", error.message);
    throw error;
  }
};
