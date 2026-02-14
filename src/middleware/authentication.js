import { AppError, decodeTokenAndFetchUser } from "../utils/index.js";

function authentication() {
  return async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) throw new AppError("No token found", 401);
    const [prefix, token] = authorization.split(" ");
    const { user, decoded } = await decodeTokenAndFetchUser({
      token,
      signature: prefix === process.env.PREFIX ? process.env.TOKEN_SIGNATURE : null,
    });

    req.user = user;
    req.decoded = decoded;
    return next();
  };
}

export { authentication };
