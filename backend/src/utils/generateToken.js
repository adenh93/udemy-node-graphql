import jwt from "jsonwebtoken";

const generateToken = id =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7 days"
  });

export { generateToken as default };
