import { AppError  } from "../utils/index.js";

function validation(schema) {
  return (req, res, next) => {
    const validationError = [];
    for (const key of Object.keys(schema)) {
      const result = schema[key]?.safeParse(req[key]);
      if (result && !result.success) {
        validationError.push(result.error);
      }
    }
    if (validationError.length) {
      throw new AppError(validationError, 400);
    }
    return next();
  };
}

export { validation,
 };
