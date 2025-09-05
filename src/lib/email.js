import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

export const sendEmail = async ({ to, subject, html, text }) => {
    const msg = {
        from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
        to,
        subject,
        html,
        text
    };

    try {
        await transport.sendMail(msg);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Email could not be sent');
    }
};

export const sendBookingConfirmationEmail = async (user, order) => {
    const subject = `Booking Confirmation - Order #${order._id}`;
    const text = `Hi ${user.name},\n\nYour booking with order ID ${order._id} has been confirmed.\n\nTotal Amount: INR ${order.totalAmount}\n\nThank you for booking with us!`;
    const html = `
        <h1>Booking Confirmed!</h1>
        <p>Hi ${user.name},</p>
        <p>Your booking with order ID <strong>${order._id}</strong> has been confirmed.</p>
        <p>Total Amount: <strong>INR ${order.totalAmount}</strong></p>
        <p>Thank you for booking with us!</p>
    `;
    await sendEmail({ to: user.email, subject, html, text });
};

export const sendPaymentReceiptEmail = async (user, payment) => {
    const subject = `Payment Receipt - Order #${payment.order}`;
    const text = `Hi ${user.name},\n\nWe have received your payment of INR ${payment.amount} for order ${payment.order}.\n\nPayment ID: ${payment.razorpayPaymentId}\n\nThank you!`;
    const html = `
        <h1>Payment Received!</h1>
        <p>Hi ${user.name},</p>
        <p>We have received your payment of <strong>INR ${payment.amount}</strong> for order <strong>${payment.order}</strong>.</p>
        <p>Payment ID: ${payment.razorpayPaymentId}</p>
        <p>Thank you!</p>
    `;
    await sendEmail({ to: user.email, subject, html, text });
}

export const sendCancellationEmail = async (user, order, refundAmount) => {
    const subject = `Order Cancellation - Order #${order._id}`;
    const text = `Hi ${user.name},\n\nYour order ${order._id} has been cancelled.\n\nA refund of INR ${refundAmount} has been initiated. It may take 5-7 business days to reflect in your account.\n\nWe are sorry to see you go.`;
    const html = `
        <h1>Order Cancelled</h1>
        <p>Hi ${user.name},</p>
        <p>Your order <strong>${order._id}</strong> has been cancelled.</p>
        <p>A refund of <strong>INR ${refundAmount}</strong> has been initiated. It may take 5-7 business days to reflect in your account.</p>
        <p>We are sorry to see you go.</p>
    `;
    await sendEmail({ to: user.email, subject, html, text });
};
