import express from 'express';
import path from "path";
import session from "cookie-session";

const users = [
    {
        username: 'test',
        password: 'test1234'
    }
];

const app = express();
app.use(express.static('./public/'));
app.use(session({
    resave: true,
    saveUninitialized: false,
    secret: 'MyTopSecret!!'
}));
app.use(express.urlencoded({
    extended: true
}));
app.set('view engine', 'hbs');
app.set('views', path.resolve('./views/'));

app.get('/login', (req, res) => {
    res.render('login');
});
app.post('/login', (req, res) => {
    const { username, password} = req.body;
    if (!(username || password)) {
        res.status(400).render('login');
        return;
    }
    const user = users.find(u => (u.username == username && u.password == password));
    if (!user) {
        res.status(400).render('login');
        return;
    }
    req.session.user = username;
    res.redirect('secure-page');
});
app.get('/secure-page', verifyUser , (req, res) => {
    res.render('secure-page');
});
app.get('/logout' , (req, res) => {
    req.session=null;
    res.redirect('secure-page');
});

function verifyUser(req, res, next) {
    if (req.session.user) {
        next();
        return; 
    }

    res.redirect('login');
};

app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});