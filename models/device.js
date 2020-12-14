let db = require("../db");

let deviceSchema = new db.Schema({
    deviceID:       { type: String, required: true, unique: true },
    APIKey:         { type: String, required: true, unique: true },
    friendlyName:   { type: String, default: '' },
    ownerEmail:     { type: String },
    dateRegistered: { type: Date, default: Date.now },
    lastRead:       { type: Date, default: Date.now },
    measureInterval:    { type: Number, default: 5 },
    startTimeHour:      { type: Number, default: 0},
    startTimeMin:        { type: Number, default: 0},
    endTimeHour:      { type: Number, default: 0},
    endTimeMin:        { type: Number, default: 0},
    readings:       [ Object ],
});

let Device = db.model("Device", deviceSchema);

module.exports = Device;
