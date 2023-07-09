const Koa = require("koa");
const app = new Koa();
const bodyParser = require("koa-bodyparser");
const KoaRouter = require("koa-router");
const router = new KoaRouter();
const cors = require('@koa/cors');
const port = process.env.port || 5000
require('dotenv').config();
const { MongoClient, ObjectId, ServerApiVersion } = require('mongodb');


// middlewares
app.use(cors());
app.use(bodyParser());
app.use(router.routes()).use(router.allowedMethods());

// db setup

const uri = `mongodb://localhost:27017`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// console.log(uri);
const DBConnect = async () => {
    try {
        await client.connect();
        console.log("success connection to db");
    } catch (error) {
        console.log(error.message);
    }
}

DBConnect();
const tasksCollection = client.db('TaskManager').collection('tasks');



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
    console.log("server is running in ", port || 5000);
})



// apis 

// router.get('/my-tasks', async (ctx, next) => {
//     // console.log(ctx)

//     const { email } = ctx.query;
//     try {
//         const result = await tasksCollection.find({ taskAuthor: email }).toArray();
//         ctx.body = result;
//         // console.log(result)
//     } catch (error) {
//         console.log(error.message);
//         ctx.throw(500, 'Internal Server Error');
//     }


// });

// create task
router.post('/api/v1/tasks', async (ctx) => {
    const { request, response } = ctx;
    try {
        const taskInfo = request.body;
        console.log(taskInfo);

        const result = await tasksCollection.insertOne(taskInfo);
        // console.log(result);
        ctx.body = result;
    } catch (error) {
        console.log(error.message);
        ctx.status = 500;
        ctx.body = error.message;
    }
})

// edit task
router.put('/api/v1/tasks/:id', async (ctx) => {
    try {
        const { id } = ctx.params;

        console.log('task___________', ctx.request.body);
        const query = { _id: new ObjectId(id) };
        const updateInfo = {
            $set: ctx.request.body,
        };

        const result = await tasksCollection.updateOne(query, updateInfo, { upsert: true });
        if (result.matchedCount) {
            ctx.body = {
                success: true,
                message: 'Successfully updated',
            };
        } else {
            ctx.body = {
                success: false,
                error: 'Could not update',
            };
        }
    } catch (error) {
        ctx.body = {
            success: false,
            error: error.message,
        };
    }
});

// delete task
router.del("/api/v1/tasks/:id", async (ctx) => {
    try {

        const { id } = ctx.request.params;
        const query = { _id: new ObjectId(id) }
        const result = await tasksCollection.deleteOne(query);
        // console.log(result,id)
        result.acknowledged ? ctx.body = result : ctx.body = "Operation failed"
    }
    catch (error) {
        console.log(error.message);
    }
})



// get all tasks
router.get("/api/v1/tasks", async (ctx) => {
    try {
        if (ctx.query && ctx.query.name) {
            const name = ctx.query.name;
            console.log(name);
            const result = await tasksCollection.find({ taskTitle: { $regex: String(name) } }).toArray();
            console.log(result);
            ctx.body = result;
        } else {
            const result = await tasksCollection.find({}).toArray();
            ctx.body = result;
        }
    } catch (error) {
        console.log(error.message);
        ctx.throw(500, 'Internal Server Error');
    }
});


// complete task
router.patch('/api/v1/tasks/:id', async (ctx) => {
    try {
        const { id } = ctx.params;

        const query = { _id: new ObjectId(id) };
        console.log(query)
        const updateInfo = {
            $set: { completed: true },
        };

        let res = await tasksCollection.updateOne(query, updateInfo);
        ctx.body = res;
    } catch (error) {
        ctx.body = {
            success: false,
            error: error.message,
        };
    }
});