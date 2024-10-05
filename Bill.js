
function getTableData() {
    let tableData = JSON.parse(localStorage.getItem('tableData')) || [];
    console.log("Table Data:", tableData);
    return tableData;
}


function generatePDF() {
    const tableData = getTableData();

    if (!Array.isArray(tableData) || tableData.length === 0) {
        console.error("No valid table data available.");
        return;
    }

    console.log("Generating PDF for the following data:", tableData);

    const firstItem = tableData[0] || {};
    const orderId = String(firstItem.orderID || 'N/A');
    const customerName = firstItem.customerName || 'N/A';
    
    const total = tableData.reduce((sum, item) => {
        const itemTotal = parseFloat(item.total) || 0;
        return sum + itemTotal;
    }, 0);

    const table = tableData.map(item => [
        item.itemCode || 'N/A',
        item.orderQty || '0',
        (item.price !== undefined && item.price !== null ? parseFloat(item.price).toFixed(2) : '0.00'),
        (item.discount !== undefined && item.discount !== null ? parseFloat(item.discount).toFixed(2) : '0.00'),
        (item.total !== undefined && item.total !== null ? parseFloat(item.total).toFixed(2) : '0.00'),
    ]);

    const prop = {
        outputType: jsPDFInvoiceTemplate.OutputType.Save,
        fileName: "Bill_" + orderId + ".pdf",
        business: {
            name: "King Burger",
            address: "No.314/7, Kandy Road, Ja-Ella",
            phone: "(+94) 076 855 6123",
            email: "Kingburger12@gmail.com",
            website: "www.kingBurger.com"
        },
        contact: {
            label:` Bill for:  ${customerName}\nOrder ID: ${orderId}\nNet Total: ${total.toFixed(2)}\n`
        },
        invoice: {
            invDate: new Date().toLocaleDateString(),
            header: [
                { title: "Item Code" },
                { title: "Quantity" },
                { title: "Price" },
                { title: "Discount" },
                { title: "Total" }
            ],
            table: table,
            additionalRows: [
                {
                    col1: 'Total Amount:',
                    col2: total.toFixed(2),
                    col3: 'ALL',
                    style: { fontSize: 14, fontWeight: 'bold' }
                }
            ]
        },
        footer: {
            text: "Thank you for your purchase. The bill is created on a computer and is valid without a signature and stamp."
        },
        pageEnable: true,
        pageLabel: "Page "
    };

    try {
        jsPDFInvoiceTemplate.default(prop);
        console.log("PDF generated successfully!");
    } catch (error) {
        console.error("Error generating PDF:", error);
    }
}
