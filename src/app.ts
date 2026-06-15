import express, { Application } from 'express';
import { postRoutes } from './modules/post/post.routes';
import { toNodeHandler } from 'better-auth/node';
import cors from 'cors';
import { auth } from './lib/auth';
const app: Application = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.APP_URL || 'http://localhost:4000', // client side url
    credentials: true,
  })
);
app.all('/api/auth/*splat', toNodeHandler(auth));

app.use('/post', postRoutes);
app.get('/', (req, res) => {
  res.send('Blog App!');
});
export default app;
