
const KoaRouter = require("koa-router");
const router = new KoaRouter({prefix:"/api/v1/tasks"});
const taskController= require("../../controllers/task.controller")

// get all tasks
router.get("/", taskController.getAllTasks);
router.post("/", taskController.createTask);
router.put("/:id", taskController.EditTask);
router.patch("/:id", taskController.completeTask);
router.delete("/:id", taskController.deleteTask);

module.exports=router