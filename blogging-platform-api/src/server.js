const express = require('express');
const blogRoutes = require('./routes/blog.routes');

const app = express();
const port = process.env.PORT || 3000;

const path = require('path');

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/api/blogs', blogRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
