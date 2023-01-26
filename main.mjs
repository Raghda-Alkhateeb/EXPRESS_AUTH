import express from 'express';
import jwt from 'jsonwebtoken'

const users = [
    {
        username: 'test',
        password: 'P@ss1234'
    }
];

const books = [
    { id: 1, title: 'Book 1', page: 100 },
    { id: 2, title: 'Book 2', page: 321 },
    { id: 3, title: 'Book 3', page: 124 },
    { id: 4, title: 'Book 4', page: 781 },
    { id: 5, title: 'Book 5', page: 1130 },
    { id: 6, title: 'Book 6', page: 871 },
];

const app = express();
app.use(express.json());


app.post('/login', (req, res) => {
    const { username, password} = req.body;
    if (!username || !password) {
        res.status(400).json({
            error:"Invalied request not correct "
        });
        return;
    }
    const user = users.find(u => (u.username == username && u.password == password));
    if (!user) {
        res.status(400).json({
            error:"User Name or Password not Correct"
        });
        return;
    }
    const token =jwt.sign({ username},"Token-secret")
    res.json({token})
});


app.get('/books',authorize, (req, res) => {
    res.json(books);
});

function authorize(req,res,next){
    const authHeader = req.headers['authorization'];
    const token =!authHeader? null : authHeader.split(' ')[1]
    if(!token){
        return res.status(401).json()
    }
    jwt.verify(token ,"Token-secret",(err,user)=>{
        if(err){
            console.log(err)
            return res.status(403).json();
        }
        console.log(user);
        req.user=user;
        next();
    })
}

app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});