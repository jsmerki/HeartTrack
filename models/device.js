let db = require("../db");

let deviceSchema = new db.Schema({
    deviceID:       { type: String, required: true, unique: true },
    APIKey:         { type: String, required: true, unique: true },
    friendlyName:   { type: String, default: '' },
    ownerEmail:     { type: String },
    dateRegistered: { type: Date, default: Date.now },
    lastRead:       { type: Date, default: Date.now },
    readings:       [ String ],
});

let Device = db.model("Device", deviceSchema);

module.exports = Device;
