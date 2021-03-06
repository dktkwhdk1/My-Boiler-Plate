import { dbConnection } from './database/index.js';
import express from 'express';
import mongoose from 'mongoose';

class App {
  constructor(routes) {
    this.app = express();
    this.port = process.env.PORT || 3000;

    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`🚀 App listening on the port ${this.port}`);
    });
  }

  connectToDatabase() {
    const { connect } = mongoose;
    connect(dbConnection.url, dbConnection.options)
      .then(() => {
        console.log('🟢 The database is connected.');
      })
      .catch(error => {
        console.error(`🔴 Unable to connect to the database: ${error}.`);
      });
  }

  initializeMiddlewares() {
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
  }

  initializeRoutes(routes) {
    routes.forEach(route => {
      this.app.use('/', route.router);
    });
  }
}

export default App;
