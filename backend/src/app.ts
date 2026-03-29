import express, {type Express, type Request, type Response} from "express";
import chalk from "chalk";

const app: Express = express();

const Port = process.env.PORT || 8080;

app.get("/api/hello", (req: Request, res: Response) => {
  res.json({ message: "Hello from the backend!" });
});

app.listen(Port, () => {
  console.log(chalk.green(`Server is running at http://localhost:${Port}`));
});

export default app;