import { AppError, decodeTokenAndFetchUser  } from "../utils/index.js";

function authentication() {
  return async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) throw new AppError("No token found", 401);
    
    const { user, decoded } = await decodeTokenAndFetchUser({ 
      token: authorization, 
      signature: process.env.TOKEN 
    });
    
    req.user = user;
    req.decoded = decoded;
    return next();
  };
}

export { authentication,
 };
