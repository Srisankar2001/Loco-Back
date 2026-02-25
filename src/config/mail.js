import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerifyMailAdmin = async (to, token) => {
  try {
    await transporter.sendMail({
      from: `"LocoMunch" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Account Verification",
      html: `
        <h2>Activate Your Account</h2>
        <p>Click below to verify:</p>
        <a href="${process.env.FRONTEND_URL_ADMIN}/verify?token=${token}">
          Activate Account
        </a>
      `,
    });
  } catch (error) {
    throw new Error("Verification email failed");
  }
};

export const sendResetMailAdmin = async (to, token) => {
  try {
    await transporter.sendMail({
      from: `"LocoMunch" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Password Reset",
      html: `
        <h2>Reset Your Password</h2>
        <p>Click below to reset:</p>
        <a href="${process.env.FRONTEND_URL_ADMIN}/reset?token=${token}">
          Reset Password
        </a>
      `,
    });
  } catch (error) {
    throw new Error("Reset email failed");
  }
};

export const sendVerifyMailUser = async (to, token) => {
  try {
    await transporter.sendMail({
      from: `"LocoMunch" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Account Verification",
      html: `
        <h2>Activate Your Account</h2>
        <p>Click below to verify:</p>
        <a href="${process.env.FRONTEND_URL_USER}/verify?token=${token}">
          Activate Account
        </a>
      `,
    });
  } catch (error) {
    throw new Error("Verification email failed");
  }
};

export const sendResetMailUser = async (to, token) => {
  try {
    await transporter.sendMail({
      from: `"LocoMunch" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Password Reset",
      html: `
        <h2>Reset Your Password</h2>
        <p>Click below to reset:</p>
        <a href="${process.env.FRONTEND_URL_USER}/reset?token=${token}">
          Reset Password
        </a>
      `,
    });
  } catch (error) {
    throw new Error("Reset email failed");
  }
};

export const sendVerifyMailDeliveryPerson = async (to, token) => {
  try {
    await transporter.sendMail({
      from: `"LocoMunch" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Account Verification",
      html: `
        <h2>Activate Your Account</h2>
        <p>Click below to verify:</p>
        <a href="${process.env.FRONTEND_URL_DELIVERY_PERSON}/verify?token=${token}">
          Activate Account
        </a>
      `,
    });
  } catch (error) {
    throw new Error("Verification email failed");
  }
};

export const sendResetMailDeliveryPerson = async (to, token) => {
  try {
    await transporter.sendMail({
      from: `"LocoMunch" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Password Reset",
      html: `
        <h2>Reset Your Password</h2>
        <p>Click below to reset:</p>
        <a href="${process.env.FRONTEND_URL_DELIVERY_PERSON}/reset?token=${token}">
          Reset Password
        </a>
      `,
    });
  } catch (error) {
    throw new Error("Reset email failed");
  }
};

export const sendVerifyMailPickupPerson = async (to, token) => {
  try {
    await transporter.sendMail({
      from: `"LocoMunch" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Account Verification",
      html: `
        <h2>Activate Your Account</h2>
        <p>Click below to verify:</p>
        <a href="${process.env.FRONTEND_URL_PICKUP_PERSON}/verify?token=${token}">
          Activate Account
        </a>
      `,
    });
  } catch (error) {
    throw new Error("Verification email failed");
  }
};

export const sendResetMailPickupPerson = async (to, token) => {
  try {
    await transporter.sendMail({
      from: `"LocoMunch" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Password Reset",
      html: `
        <h2>Reset Your Password</h2>
        <p>Click below to reset:</p>
        <a href="${process.env.FRONTEND_URL_PICKUP_PERSON}/reset?token=${token}">
          Reset Password
        </a>
      `,
    });
  } catch (error) {
    throw new Error("Reset email failed");
  }
};

export const sendVerifyMailRestaurant = async (to, token) => {
  try {
    await transporter.sendMail({
      from: `"LocoMunch" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Account Verification",
      html: `
        <h2>Activate Your Account</h2>
        <p>Click below to verify:</p>
        <a href="${process.env.FRONTEND_URL_RESTAURANT}/verify?token=${token}">
          Activate Account
        </a>
      `,
    });
  } catch (error) {
    throw new Error("Verification email failed");
  }
};

export const sendResetMailRestaurant = async (to, token) => {
  try {
    await transporter.sendMail({
      from: `"LocoMunch" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Password Reset",
      html: `
        <h2>Reset Your Password</h2>
        <p>Click below to reset:</p>
        <a href="${process.env.FRONTEND_URL_RESTAURANT}/reset?token=${token}">
          Reset Password
        </a>
      `,
    });
  } catch (error) {
    throw new Error("Reset email failed");
  }
};