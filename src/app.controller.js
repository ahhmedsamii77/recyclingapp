import cors from "cors";
import helmet from "helmet";
import { rateLimit  } from "express-rate-limit";
import express from "express";
import dotenv from "dotenv";
import { AppError  } from "./utils/index.js";
import { connectionDB  } from "./DB/connectionDB.js";
import { userRouter  } from "./modules/users/user.controller.js";
import { globalErrorHandler  } from "./middleware/index.js";
import { machineRouter  } from "./modules/machine/machine.controller.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  limit: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: "Too many requests, please try again later",
  statusCode: 429,
  skipSuccessfulRequests: true
});

async function bootstrap() {
  // db connection
  await connectionDB();

  // cors
  app.use(cors());

  // security
  app.use(helmet());

  // rate limit
  app.use(limiter);

  // parse data
  app.use(express.json());

  // main route
  app.get("/", (req, res) => {
    return res.status(200).json({ message: "Welcome................." });
  });

  // user routes
  app.use("/users", userRouter);

  // machine routes
  app.use("/machine", machineRouter);


  // unhandled routes
  app.use((req, res, next) => {
    throw new AppError(`404 Not Found Url ${req.originalUrl}`, 404);
  });

  // global error handler
  app.use(globalErrorHandler);

  // run server
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

export default bootstrap;
