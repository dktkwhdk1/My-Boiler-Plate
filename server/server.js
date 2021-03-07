import IndexRoute from './routes/index.route.js';
import App from './app.js';
import dotenv from 'dotenv';

dotenv.config();

const app = new App([new IndexRoute()]);
app.listen();
