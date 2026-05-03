exports.paymentSuccessEmail = (name, amount, orderId, paymentId) => {
  return `<!doctype html>
  <html>
    <body style="font-family: Arial, sans-serif; color: #222;">
      <h2>Payment Successful</h2>
      <p>Hi ${name},</p>
      <p>Your payment was received successfully.</p>
      <p><strong>Amount:</strong> Rs. ${amount}</p>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Payment ID:</strong> ${paymentId}</p>
      <p>Thank you for learning with StudyNotion.</p>
    </body>
  </html>`;
};
