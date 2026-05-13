const fs = require('fs');
const path = require('path');
const exportDir = path.join(__dirname, '..', '..', 'exports');
function invoicePdf(invoice) {
  const file = path.join(exportDir, `invoice-${invoice.invoice_no}.pdf`);
  const body = `CampusCompany ERP Invoice\nInvoice: ${invoice.invoice_no}\nTotal: ${invoice.total}\nPaid: ${invoice.paid}\nDue: ${invoice.due}\n`;
  fs.writeFileSync(file, body);
  return file;
}
module.exports = { invoicePdf };
