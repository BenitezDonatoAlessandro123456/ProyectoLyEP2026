export const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    
    if (err.name === 'ValidationError' || err.code === 11000) {
        err.statusCode = 400;
    }

    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        error: err.message || 'Error interno del servidor'
    });
};