const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      return res.status(401).json({ error: "Token requerido" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("TOKEN RECIBIDO:", token);
    console.log("USUARIO DECODIFICADO:", decoded);

    req.user = decoded;

    next();

  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: "Token inválido" });
  }
};