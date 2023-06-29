const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const cors = require('cors');
const bcrypt = require('bcryptjs');

dotenv.config();
const jwtSecret = process.env.JWT_SECRET;
const bcryptSalt = bcrypt.genSaltSync(10);

const app = express();
const port = 4000;

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = ['http://localhost:5174'];
app.use(cors({
  credentials: true,
  origin: allowedOrigins,
}));

app.use(express.urlencoded({ extended: false }));

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

app.get('/test', (req, res) => {
  res.json('Test ok!');
});

app.get('/profile', (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, (err, userData) => {
      if (err) throw err;
      res.json(userData);
    });
  } else {
    res.status(401).json('no token');
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const foundUser = await User.findOne({ username });
  if (foundUser) {
    const passOk = bcrypt.compareSync(password, foundUser.password);
    if (passOk) {
      jwt.sign({ userId: foundUser._id, username }, jwtSecret, {}, (err, token) => {
        res.cookie('token', token,{ sameSite: 'none', secure: true }).json({
          id: foundUser._id,
        });
      });
    }
  }
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
    const createdUser = await User.create({
      username: username,
      password: hashedPassword,
    });
    jwt.sign({ userId: createdUser._id, username }, jwtSecret, (err, token) => {
      if (err) throw err;
      res.cookie('token', token, { sameSite: 'none', secure: true }).status(201).json({
        id: createdUser._id,
      });
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json('Internal Server Error');
  }
});


/*const express = require('express');
const mongoose = require('mongoose');
const cookieParser=require('cookie-parser');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const cors = require('cors');
const bycrypt = require('bcryptjs');

dotenv.config();
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(4000, () => {
      console.log('Server is running on port 4000');
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

const jwtSecret = process.env.JWT_SECRET;
bycryptSalt=bycrypt.genSaltSync(10);

const app = express();
// Body parser middleware
app.use(express.json());
app.use(cookieParser());


// Allow requests from the specified client URL
const allowedOrigins = ['http://localhost:5173'];
app.use(cors({
  credentials: true, // To enable credentials
  origin: allowedOrigins,  
}));


app.use(express.urlencoded({ extended: false }));

app.get('/test', (req, res) => {
  res.json('Test ok!');
});

app.get('/profile',(req,res)=>{
  const{token}=req.cookies?.token;
  if(token){

    jwt.verify(token,jwtSecret,{},(err,userData)=>{
      if(err) throw err;
      res.json(userData);
  });
}else{
  res.status(401).json('no token');
}
});

app.post('/login', async (req,res)=>{
  const {username,password}=req.body;
  const foundUser=await User.findOne({username});
  if (foundUser){
    const passOk = bycrypt.compareSync(password,foundUser.password)
    if(passOk){
      jwt.sign({userId:foundUser._id,username},jwtSecret,{},(err,token)=>{
        res.cookie('token',token).json({
          id:foundUser._id,
        })
      })

    }
  }
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword=bycrypt.hashSync(password,bcryptSalt);
    const createdUser = await User.create({ 
      
      username:username, 
      password:hashedPassword,   
    });
    jwt.sign({ userId: createdUser._id,username }, jwtSecret, (err, token) => {
      if (err) throw err;
      res.cookie('token', token,{sameSite:'none',secure:true }).status(201).json({
        id:createdUser._id,      
      });
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json('Internal Server Error');
  }
});*/