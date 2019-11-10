import jwt from "jsonwebtoken";

const getUserId = ({ request }, requireAuth = true) => {
  const header = request.headers.authorization;

  if (header) {
    const token = header.replace("Bearer ", "");
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    return id;
  }

  if (requireAuth) {
    throw new Error("Authentication required");
  }

  return null;
};

export { getUserId as default };
