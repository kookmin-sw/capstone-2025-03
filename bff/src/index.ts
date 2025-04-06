import express from "express";
import cors from "cors";
import packageRouter from "./routes/packages.routes";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/packages", packageRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`BFF server listening on port ${PORT}`);
});
