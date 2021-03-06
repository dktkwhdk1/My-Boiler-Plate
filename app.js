import { dbConnection } from './database/index.js';
import express from 'express';
import mongoose from 'mongoose';

class App {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;

    this.connectToDatabase();
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
}

export default App;
