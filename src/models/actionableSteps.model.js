const mongoose = require('mongoose');
const validator = require('validator');

const { Schema } = mongoose;


const ActionableStepSchema = new Schema({
    noteID: { 
        type: String, 
        required: true 
    },

    checklist: [{ 
        task: {type: String}, 
        completed: { type: Boolean, default: false } 
        }],

    plan: [{ 
        task: String, 
        frequency: String, 
        duration: String, 
        completed: { type: Boolean, default: false } 
    }],

        isActive: { type: Boolean, default: true },
  });


  const Actions = mongoose.model('Actions', ActionableStepSchema);
  
  module.exports = Actions;