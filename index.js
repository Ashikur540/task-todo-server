const Koa = require("koa");
const app = new Koa();
const bodyParser = require("koa-bodyparser");
const KoaRouter = require("koa-router");
const router = new KoaRouter();
const cors = require('@koa/cors');
const port = process.env.port || 5000
require('dotenv').config();
const connectDB = require("./utils/db");
const taskRouter=require("./routes/v1/task.route")

// middlewares
app.use(cors());
app.use(bodyParser());
app.use(router.routes()).use(router.allowedMethods());


// connect db
connectDB()

app.use(taskRouter.routes()).use(router.allowedMethods());                                                                                                                                                            

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
