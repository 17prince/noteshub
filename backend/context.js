const { verifyToken } = require("./utils/auth");

exports.context = async (req) => {
  // console.log(req.headers.authorization);
  const user =
    req && req.headers.authorization
      ? await verifyToken(req.headers.authorization)
      : null;
  return {
    userId: user?._id.toString(),
  };
};
