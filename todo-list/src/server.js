const express = require('express');
const helmet = require('helmet');

const todoRoutes = require('./routes/todo.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const port = 8080;

app.use(express.json());
app.use(helmet());

app.use('/todos', todoRoutes);

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});