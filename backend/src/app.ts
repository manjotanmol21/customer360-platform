import cors from "cors";
import express, {
  type Request,
  type Response,
} from "express";
import customerRoutes from "./routes/customer.routes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    message: "Customer360 API is running",
  });
});

app.use("/api/customers", customerRoutes);

export default app;