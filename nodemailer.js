const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const router = require("./routes");

const REDIRECT_URI = `https://developers.google.com/oauthplayground`;
const CLIENT_ID = `934441617159-gvnfft272do0sa243584unpf5ifi78o9.apps.googleusercontent.com`;
const CLIENT_SECRET = `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`;
const REFRESH_TOKEN = `1//04dZjA4RycxoPCgYIARAAGAQSNwF-L9IriTLaWfFnYnYvFtBUMngLSJe_BNbBb1Ao1BylIky8MbFUrR3gwxz6dKeSPenfYpudD9s`;

const authClient = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
authClient.setCredentials({ refresh_token: REFRESH_TOKEN });

async function mailer(userEmail,userId,key) {
  try {
    const ACCESS_TOKEN = await authClient.getAccessToken();
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "piyushkumarktr@gmail.com",
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: ACCESS_TOKEN,
      },
    });

    const details = {
      from: "piyushkumarktr@gmail.com",
      to: userEmail,
      subject: "Flappy Bird(Clone) Recovery",
      text: "message text",
      html: `<h2>Please click here to recover your password</h2><a href='http://localhost:3000/recover/${userId}/${key}'>RESET MY PASSWORD!!</a>`,
    };

    const result = await transport.sendMail(details);
    return result;
  } catch (err) {
    return err;
  }
}

// mailer()
//   .then((res) => {
//     console.log("sent mail !", res);
//   })
//   .catch((error) => {
//     console.error("Error sending mail:", error);
//   });
module.exports = mailer;