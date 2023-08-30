const errorHandler = (err,req,res,next)=>{
    if(err){
        console.log("Logging Error : ",err.message)
        const status = err.statusCode || 400
        res.status(status).json({message : err.message})
    }
    next()
}

const format = (message,httpStatus)=>{
    let error = new Error(message)
    error.statusCode = httpStatus
    return error
}

module.exports={
    errorHandler,
    format
}