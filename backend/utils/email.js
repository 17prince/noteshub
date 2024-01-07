const nodemailer = require("nodemailer");
const htmlToText = require("html-to-text");
const fs = require("node:fs");

class Email {
  constructor(user) {
    this.to = user.email;
    this.name = user.name;
    this.from = `Noteszi,  <${process.env.EMAIL_FROM}`;
  }

  newTransport() {
    return nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });
  }

  async send(subject) {
    //   1. Read html template
    const html = fs
      .readFileSync(`${__dirname}/welcome.html`, "utf8")
      .replace("[Username]", this.name);

    // 2. Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.convert(html),
    };

    //   3. Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send("Welcome to Noteszi");
  }
}

module.exports = Email;
