import express from "express";
import deploymentRoutes from "./routes/deployment";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/deployments", deploymentRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
