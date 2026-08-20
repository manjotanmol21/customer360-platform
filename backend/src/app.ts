import express, {
  type Request,
  type Response,
} from "express";
import customerRoutes from "./routes/customer.routes.js";

const app = express();

app.use(express.json());

app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    message: "Customer360 API is running",
  });
});

app.use("/api/customers", customerRoutes);

export default app;