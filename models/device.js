let db = require("../db");

let deviceSchema = new db.Schema({
    deviceID:       { type: String, required: true, unique: true },
    APIKey:         { type: String, required: true, unique: true },
    friendlyName:   { type: String, default: '' },
    ownerEmail:     { type: String },
    dateRegistered: { type: Date, default: Date.now },
    lastRead:       { type: Date, default: Date.now },
    measureInterval:    { type: Number, default: 1800 },
    startTime:      { type: Number, default: 0},
    endTime:        { type: Number, default: (3600 * 24) - 1},
    readings:       [ Object ],
});

let Device = db.model("Device", deviceSchema);

module.exports = Device;
