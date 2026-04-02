import "dotenv/config";
import express, {type Express} from "express";
import chalk from "chalk";
import Routes from "@routes/Routes";
import { corsOptions } from "@config/cors";
import Cors from "cors";
import connectDB from "@config/database";

const app: Express = express();

const Port = process.env.PORT || 8080;

app.use(Cors(corsOptions));

await connectDB();
app.use(express.json());         
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/", Routes)

app.listen(Port, () => {
  console.log(chalk.green(`Server is running at http://localhost:${Port}`));
});
