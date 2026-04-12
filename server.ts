import express from "express";
import cors from "cors";
import path from "path";
import { initDb } from "./server/database/db";
import authRoutes from "./server/routes/authRoutes";
import patientRoutes from "./server/routes/patientRoutes";
import doctorRoutes from "./server/routes/doctorRoutes";
import appointmentRoutes from "./server/routes/appointmentRoutes";
import prescriptionRoutes from "./server/routes/prescriptionRoutes";
import adminRoutes from "./server/routes/adminRoutes";
import billingRoutes from "./server/routes/billingRoutes";

const app = express();

app.use(cors());
app.use(express.json());

// Initialize Database
initDb().then(() => {
  console.log("Database initialized successfully");
}).catch((error) => {
  console.error("Failed to initialize database:", error);
  console.error("The server will continue running, but API requests may fail.");
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/billing", billingRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

async function startServer() {
  const PORT = 3000;

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  startServer();
}

export default app;
