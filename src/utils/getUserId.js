import jwt from "jsonwebtoken";

const getUserId = ({ request }) => {
  const header = request.headers.authorization;

  if (!header) {
    throw new Error("Authentication required");
  }

  const token = header.replace("Bearer ", "");
  const { id } = jwt.verify(token, process.env.JWT_SECRET);

  return id;
};

export { getUserId as default };
