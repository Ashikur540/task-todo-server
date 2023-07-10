import { ObjectId } from "mongodb";
import TaskModel from "../models/task.model.js";






 const getAllTasks = async ctx => {
    try {
        if (ctx.query && ctx.query.name) {
            const name = ctx.query.name;
            // console.log(name);
            const result = await  TaskModel.find({ taskTitle: { $regex: String(name) } }).sort({ createdAt: -1 });
            // console.log(result);
            ctx.body = result;
        } else {
            const result = await TaskModel.find({}).sort({ createdAt: -1 });
            ctx.body = result;
        }
    } catch (error) {
        console.log(error.message);
        ctx.throw(500, 'Internal Server Error');
    }
}




const createTask = async ctx => {

    const { request, response } = ctx;
    try {
        const taskInfo = request.body;
        // console.log(taskInfo);

        const result = await TaskModel.create(taskInfo);
        // console.log(result);
        ctx.body = result;
    } catch (error) {
        console.log(error.message);
        ctx.status = 500;
        ctx.body = error.message;
    }
}



const EditTask = async ctx => {

    try {
        const { id } = ctx.params;

        // console.log('task___________', ctx.request.body);
        const query = { _id: new ObjectId(id) };
        const updateInfo = {
            $set: ctx.request.body,
        };

        const result = await TaskModel.updateOne(query, updateInfo, { upsert: true });
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
}


const completeTask = async ctx => {
    try {
        const { id } = ctx.params;

        const query = { _id: new ObjectId(id) };
        // console.log(query)
        const updateInfo = {
            $set: { completed: true },
        };

        let res = await TaskModel.updateOne(query, updateInfo);
        ctx.body = res;
    } catch (error) {
        ctx.body = {
            success: false,
            error: error.message,
        };
    }
}


const deleteTask = async ctx => {
    try {

        const { id } = ctx.request.params;
        const query = { _id: new ObjectId(id) }
        const result = await TaskModel.deleteOne(query);
        // console.log(result,id)
        result.acknowledged ? ctx.body = result : ctx.body = "Operation failed"
    }
    catch (error) {
        console.log(error.message);
    }
}


export { EditTask, completeTask, createTask, deleteTask, getAllTasks };

