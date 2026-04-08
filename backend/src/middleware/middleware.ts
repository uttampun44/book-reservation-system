import express,{type Express } from 'express';

// Middleware function to set up common middlewares
const middleware = (app: Express): void => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
}

export default middleware;