
const { generateInvoicePDF } = require('./generateInvoice.cjs');
const path = require('path');

const mockData = {
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
    userDetails: {
        name: "John Doe",
        email: "john@example.com"
    },
    shippingAddress: {
        name: "John's Office",
        street: "123 Tech Park, Electronic City",
        city: "Bangalore",
        district: "Bangalore Urban",
        state: "Karnataka",
        pincode: "560100"
    },
    invoiceDate: "August 3, 2025",
    orderId: "#0000123DSS",
    paymentMethod: "Razorpay",

    cartItems: [
        {
            title: "Website design & development",
            price: 1000,
            quantity: 2,
            product: {
                hsncode: "998315",
                name: "Website design",
                variant: [{ sizes: [{ taxPercentage: 18 }] }]
            }
        },
        {
            title: "Branding Kit",
            price: 800,
            quantity: 5,
            product: {
                hsncode: "998314",
                name: "Branding Kit",
                variant: [{ sizes: [{ taxPercentage: 18 }] }]
            }
        }
    ]
};

const outputPath = path.resolve(__dirname, 'test_invoice.pdf');

console.log("Generating invoice...");
generateInvoicePDF(mockData, outputPath)
    .then(() => console.log("Success! PDF generated at: " + outputPath))
    .catch(err => console.error("Error generating PDF:", err));
