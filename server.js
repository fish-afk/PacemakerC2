require("dotenv").config();
const express = require("express");
const rateLimit = require("express-rate-limit");

const app = express();

app.use(express.json());

const limiter = rateLimit({
	windowMs: 3 * 60 * 1000, // 3 minutes
	max: 150, // Limit each IP to 150 requests
	message: { message: "Too many requests, please try again later" },
	standardHeaders: true,
	legacyHeaders: false, // Disable the RateLimit headers
});

const port = process.env.PORT || 3000;

const coreRouter = require("./routers/coreRouter_");
const fileServerRouter = require("./routers/fileServerRouter_");
const adminRouter = require("./routers/adminRouter_");

app.set("trust proxy", 1); // to trust loadbalancers like nginx so that, that ip doesn`t get limited.

app.use("/core", limiter, coreRouter);
app.use("/files", limiter, fileServerRouter);
app.use("/admin", limiter, adminRouter);

app.get("*", (req, res) => {
	res.status(404).send({ status: false, message: "404 not found" });
});

app.listen(port, () => {
	console.log("App is listening on " + port);
});
