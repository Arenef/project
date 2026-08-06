const express = require('express');
const blogRoutes = require('./routes/blog.routes');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/blogs', blogRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
