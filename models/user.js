let db = require("../db");

let userSchema = new db.Schema({
    email:          { type: String, required: true, unique: true },
    fullName:       String,
    passwordHash:   String,
    dateRegistered: { type: Date, default: Date.now },
    lastAccess:     { type: Date, default: Date.now },
    userDevices:    [ String ],
});

let User = db.model("User", userSchema);

module.exports = User;
