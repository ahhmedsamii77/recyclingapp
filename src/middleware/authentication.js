import { AppError, decodeTokenAndFetchUser, getSignature } from "../utils/index.js";

function authentication() {
  return async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) throw new AppError("No token found", 401);
    const [prefix, token] = authorization.split(" ");
    const signature = await getSignature({ prefix });
    if(!signature) throw new AppError("Invalid prefix", 401);
    const { user, decoded } = await decodeTokenAndFetchUser({
      token,
      signature,
    });

    req.user = user;
    req.decoded = decoded;
    return next();
  };
}

export { authentication };
