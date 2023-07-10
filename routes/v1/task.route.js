
import KoaRouter from "koa-router";
import { EditTask, completeTask, createTask, deleteTask, getAllTasks } from "../../controllers/task.controller.js";
const taskRouter = new KoaRouter({prefix:"/api/v1/tasks"});


// get all tasks
taskRouter.get("/", getAllTasks);
taskRouter.post("/", createTask);
taskRouter.put("/:id", EditTask);
taskRouter.patch("/:id", completeTask);
taskRouter.delete("/:id", deleteTask);
 
export default taskRouter