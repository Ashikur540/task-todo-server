import {
  Schema,
  model
} from "mongoose";

const taskSchema = new Schema({
  taskTitle: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  completed: Boolean,
});

 const TaskModel = model("Task", taskSchema)

export default TaskModel;