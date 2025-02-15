const mongoose = require('mongoose');
const validator = require('validator');

const { Schema } = mongoose;


const ReminderSchema = new Schema({
     userID: { 
        type: String,  
        required: true 
    },

    task: String,

    reminder_times: Date,

    completed: { type: Boolean, default: false },

    isActive: { type: Boolean, default: true },

    status: {type: String, enum: ['pending', 'completed', 'missed'], default: 'pending'}
  });


  const Reminders = mongoose.model('Reminders', ReminderSchema);
  
  module.exports = Reminders;