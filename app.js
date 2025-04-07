const express = require("express");
const app = express();
const path = require("path")
const sequelize = require("./data/dbConnection");
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const session = require('express-session');
const flash = require("connect-flash");
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const cors = require("cors");


require("dotenv").config();

//Veritabanı ve ilişkileri
require("./data/dbConnection");
require("./data/relationships");

app.use(cors({origin: '*',credentials: true}));
app.set("view engine","ejs");
app.use(express.static("node_modules"));
app.use("/static",express.static(path.join(__dirname,"public")));
app.use("/uploads",express.static(path.join(__dirname,"uploads")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());



const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");
const customerRoutes = require("./routes/customer");
const homeRoutes = require("./routes/home");


app.use(session({
  secret: "your-secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 30 * 60
  },
  store: new SequelizeStore({
    db: sequelize,
    expiration: 1000 * 60 * 30,
    checkExpirationInterval: 1000 * 60 * 30
  })
}));



app.use(require("./middlewares/locals"));
app.use(flash());

app.use((req, res, next) => {
  res.locals.message = req.flash('message');
  next();
});

app.use(homeRoutes);
app.use(userRoutes);
app.use(authRoutes);
app.use(adminRoutes);
app.use(customerRoutes);


app.use((req, res, next) => {
  const err = new Error("Sayfa Bulunamadı");
  err.status = 404;
  next(err);
});

const errorHandlers = require("./middlewares/error");

// Diğer Hatalar için Middleware
app.use((err, req, res, next) => {
  if (err.status === 403) {
    return errorHandlers.handle403(req, res);
  }
  if (err.status === 404) {
    return errorHandlers.handle404(req, res);
  }
  if (err.status === 500) {
    return errorHandlers.handle500(req, res);
  }
});

//Veritabanını modellere göre yeniler
// (async () => {
//   await sequelize.sync({ alter: true });
//   await require("./data/dummyData")();
// })();

app.listen(process.env.PORT || 8000, () => {
  console.log(process.env.PORT  || 8000, "portuna bağlandı")
})
