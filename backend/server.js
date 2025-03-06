import express from "express";
import router from "./src/routes/index.js";

const app = express();
const port = 3000;

app.use(express.json());
app.use("/", router);

app.listen(port, () => console.log(`Server berjalan di port ${port}`))

app.get('/test', (req, res) => {
    res.send("Route bekerja!");
});
