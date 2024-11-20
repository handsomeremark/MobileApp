const admin = require("firebase-admin");
const serviceAccount = require("./otpgreencartph-firebase-adminsdk-ucq43-81577bfb38.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
