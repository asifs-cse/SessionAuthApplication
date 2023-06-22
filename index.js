const app = require('./app');
const PORT = 3000;

//connect express server
app.listen(PORT, ()=>{
    console.log(`server is running at http://localhost:${PORT}`);
});