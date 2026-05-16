const admin = require("../config/firebaseAdmin");

module.exports = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    if (!header.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing or invalid Authorization header" });
    }

    const idToken = header.split(" ")[1];
    const decoded = await admin.auth().verifyIdToken(idToken);

    // decoded includes: uid, email, email_verified, name, picture, etc.
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Firebase auth error:", err);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
