import getUserId from "../utils/getUserId";

export const User = {
  email({ id, email }, args, { request }, info) {
    const userId = getUserId(request, false);
    return userId === id ? email : null;
  }
};
