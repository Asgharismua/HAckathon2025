import express, { type Request, Response } from "express";
import { registerRoutes } from "./routes";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Initialize routes
let initialized = false;

async function initializeApp() {
  if (!initialized) {
    await registerRoutes(app);
    initialized = true;
  }
  return app;
}

// Vercel serverless handler
export default async function handler(req: Request, res: Response) {
  const app = await initializeApp();
  return app(req, res);
}
