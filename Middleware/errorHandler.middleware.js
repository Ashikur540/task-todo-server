 const errorHandlerMiddleware = async (ctx, next) => {
    try {
        await next();
      } catch (err) {
        console.log("something went wrong!!")
        ctx.status = err.status || 500;
        ctx.body = err.message;
        ctx.app.emit('error', err, ctx);
    }
}
export default errorHandlerMiddleware;