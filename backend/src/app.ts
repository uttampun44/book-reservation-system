import express, {type Express, type Request, type Response} from "express";
import chalk from "chalk";

const app: Express = express();

const Port = process.env.PORT || 8080;

app.get("/api/hello", (req: Request, res: Response) => {
  res.json({ message: "Hello from the backend! new CI/CD pipeline!" });
});

app.listen(Port, () => {
  console.log(chalk.green(`Server is running at http://localhost:${Port}`));
});


// This file is the entry point of the backend application. It sets up an Express server that listens on a specified port (defaulting to 8080) and defines a single API endpoint at "/api/hello" that responds with a JSON message. The server logs a message to the console when it starts successfully.