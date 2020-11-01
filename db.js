const mongoose = require("mongoose");
const mongo_uri = process.env.MONGO_URI;

// Use this on AWS ec2 with locally installed MongoDB
// mongoose.connect("mongodb://localhost/projdb", { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

// Use this on repl.it with Mongo Atlas DB
mongoose.connect("mongodb://localhost/projdb", { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

module.exports = mongoose;