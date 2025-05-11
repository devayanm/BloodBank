// utils/emailTemplates.js

function getVerificationEmailHtml(name, url) {
  return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 24px;">
        <h2 style="color: #d32f2f;">Welcome to Blood Bank!</h2>
        <p>Hi <strong>${name}</strong>,</p>
        <p>Thank you for registering. Please verify your account by clicking the button below:</p>
        <a href="${url}" style="display: inline-block; margin: 16px 0; padding: 12px 24px; background: #d32f2f; color: #fff; text-decoration: none; border-radius: 4px;">Verify Account</a>
        <p>If you did not register, please ignore this email.</p>
        <hr>
        <p style="font-size: 12px; color: #888;">Blood Bank Team</p>
      </div>
    `;
}

module.exports = { getVerificationEmailHtml };
