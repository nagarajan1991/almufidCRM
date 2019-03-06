const mongoose = require('mongoose');

const planVisitSchema = mongoose.Schema({
  userId: { type:String, required:true},
  title: { type:String, required:true},
  start: { type:Date, default:Date.now},
  end: { type:Date, default:Date.now},
  color: {type:String, required:true},
  draggable: {type:Boolean, required:true},
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  resizable: {
    beforeStart: {type:String, required:true},
    afterEnd: {type:String, required:true},
  },
});

module.exports = mongoose.model('PlanVisit', planVisitSchema);
