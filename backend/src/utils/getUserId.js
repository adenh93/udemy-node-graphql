import jwt from "jsonwebtoken";

const getUserId = ({ request, connection }, requireAuth = true) => {
  const header = request
    ? request.headers.authorization
    : connection.context.Authorization;

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
