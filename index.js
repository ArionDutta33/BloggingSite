const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');



app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({
    extended: true
}));
// app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))

// app.use((req, res, next) => {
//     // console.log(req)
//     next()
// })



app.get('/', (req, res) => {
    res.render('blogs/index')
});

app.listen(3000, () => {
    console.log("SERVER RUNNING")
})