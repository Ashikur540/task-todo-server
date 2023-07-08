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

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_USER_PASS}@cluster0.6vknfdj.mongodb.net/?retryWrites=true&w=majority`;
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
// get all tasks based on email of logged user
router.get('/my-tasks', async (ctx, next) => {
    // console.log(ctx)

    const { email } = ctx.query;
    try {
        const result = await tasksCollection.find({ taskAuthor: email }).toArray();
        ctx.body = result;
        // console.log(result)
    } catch (error) {
        console.log(error.message);
        ctx.throw(500, 'Internal Server Error');
    }


});


router.post('/api/v1/tasks', async (ctx) => {
    const { request, response } = ctx;
    try {
        const taskInfo = request.body;
        console.log(taskInfo);

        const result = await tasksCollection.insertOne(taskInfo);
        console.log(result);
        ctx.body = result;
    } catch (error) {
        console.log(error.message);
        ctx.status = 500;
        ctx.body = error.message;
    }
})

router.patch('/my-tasks/:id', async (ctx) => {
    try {
        const { id } = ctx.params;

        console.log('task___________', ctx.request.body);
        const query = { _id: ObjectId(id) };
        const updateInfo = {
            $set: ctx.request.body,
        };

        const result = await tasksCollection.updateOne(query, updateInfo);
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

// search
router.get("/tasks", async (ctx) => {
    try {

        const { name } = ctx.query;
      
        try {
            const result = await tasksCollection.find({ taskTitle: { $regex: name } }).toArray();
            ctx.body = result;
            console.log(result)
        } catch (error) {
            console.log(error.message);
            ctx.throw(500, 'Internal Server Error');
        }
        ctx.body = result
    }
    catch (error) {
        console.log(error.message);
    }
})


// get all tasks
router.get("/api/v1/tasks", async (ctx) => {
    try {
      
        try {
            const result = await tasksCollection.find({}).toArray();
            ctx.body = result;
            // console.log(result)
        } catch (error) {
            console.log(error.message);
            ctx.throw(500, 'Internal Server Error');
        }
        ctx.body = result
    }
    catch (error) {
        console.log(error.message);
    }
})