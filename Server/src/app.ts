import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import uploadRoutes from "./routes/uploadRoute";
import listRoutes from "./routes/listRoute";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/upload", uploadRoutes);
app.use("/list", listRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

const PORT = process.env.PORT ?? 3001;

app.listen(PORT, () => {
  console.log(`O Servidor está sendo executado na porta: ${PORT}`);
});

export default app;
