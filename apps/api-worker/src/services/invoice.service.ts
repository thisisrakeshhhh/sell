export interface InvoiceData {
  orderNumber: string;
  storeName: string;
  gstNumber: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  productName: string;
  customName?: string;
  customNumber?: string;
  size: string;
  amount: number;
}

export class InvoiceService {
  generateInvoiceHtml(data: InvoiceData): string {
    const gstAmount = Math.round(data.amount * 0.12);
    const baseAmount = data.amount - gstAmount;

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Invoice ${data.orderNumber}</title>
  <style>
    body { font-family: sans-serif; padding: 40px; background: #fff; color: #111; }
    .header { display: flex; justify-content: space-between; border-bottom: 2px solid #111; padding-bottom: 20px; }
    .table { width: 100%; border-collapse: collapse; margin-top: 30px; }
    .table th, .table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
    .table th { background: #f4f4f4; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h2>${data.storeName}</h2>
      <p>GSTIN: ${data.gstNumber}</p>
    </div>
    <div>
      <h3>TAX INVOICE</h3>
      <p>Invoice #: ${data.orderNumber}</p>
      <p>Date: ${new Date().toLocaleDateString()}</p>
    </div>
  </div>

  <div style="margin-top: 20px;">
    <strong>Billed To:</strong> ${data.customerName} (${data.customerPhone})<br />
    <strong>Shipping Address:</strong> ${data.shippingAddress}
  </div>

  <table class="table">
    <thead>
      <tr>
        <th>Item Description</th>
        <th>Size</th>
        <th>Custom Print</th>
        <th>Base Price</th>
        <th>GST (12%)</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>${data.productName}</td>
        <td>${data.size}</td>
        <td>${data.customName || "None"} #${data.customNumber || "N/A"}</td>
        <td>₹${baseAmount}</td>
        <td>₹${gstAmount}</td>
        <td><strong>₹${data.amount}</strong></td>
      </tr>
    </tbody>
  </table>
</body>
</html>
    `;
  }
}
