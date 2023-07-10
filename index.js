import cors from '@koa/cors';
import dotenv from 'dotenv';
import Koa from "koa";
import bodyParser from "koa-bodyparser";
import KoaRouter from "koa-router";

import errorHandlerMiddleware from './Middleware/errorHandler.middleware.js';
import taskRouter from './routes/v1/task.route.js';
import connectDB from './utils/db.js';

const app = new Koa();
const router = new KoaRouter();
const port = process.env.port || 5000
dotenv.config()






// middlewares
app.use(cors());
app.use(bodyParser());
app.use(errorHandlerMiddleware).use(router.routes()).use(router.allowedMethods());


// connect db
connectDB()

app.use(taskRouter.routes()).use(router.allowedMethods());                                                                                                                                                            



// Global Error Handler
app.on("error", (err, ctx) => {
    const extraPrams = `[${new Date().toLocaleString([], {
      timeZone: "Asia/Dhaka",
    })}] - ${ctx?.request?.method} - ${ctx?.response?.status} - [${
      ctx?.request?.url
    }] ==>`;
    console.log("\x1b[36m%s\x1b[0m", extraPrams, err);
  });
// simple server set up
app.use(async ctx => {
    // console.log(ctx)
    if (ctx.path === '/' && ctx.method === 'GET') {
        ctx.body = {
            success: true,
            message: "Task manager app server is running.."
        }
    }
});


app.listen(port, () => {
    console.log("server is running in- ", port || 5000);
})
