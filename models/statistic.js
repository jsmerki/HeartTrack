let db = require("../db");

let statisticSchema = new db.Schema({
    deviceID:       { type: String, required: true, unique: true },
    measureTime:    { type: Date, default: Date.now },
    bloodOxygen:    { type: Number },
    heartRate:      { type: Number },
});

let Statistic = db.model("Statistic", statisticSchema);

module.exports = Statistic;
