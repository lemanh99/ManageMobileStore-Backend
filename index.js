const express = require("express");
const env = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

//routes
const adminRoutes = require("./src/routes/admin");
const customerRoutes = require("./src/routes/customer");
const categoryRoutes = require("./src/routes/category");
const brandRoutes = require("./src/routes/brand");
const productRoutes = require("./src/routes/product");
const orderRoutes = require("./src/routes/order");

//environment variable
env.config();

const port = process.env.PORT || 80;
const app = express();

//connect mongodb
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.mphwh.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }
  )
  .then(() => {
    console.log("Database connected");
  });

app.use(cors());
app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "src/uploads")));
app.use("/api", adminRoutes);
app.use("/api", customerRoutes);
app.use("/api", categoryRoutes);
app.use("/api", brandRoutes);
app.use("/api", productRoutes);
app.use("/api", orderRoutes);

app.listen(port, () => {
  console.log(`Server is listening on port:${port}`);
});
