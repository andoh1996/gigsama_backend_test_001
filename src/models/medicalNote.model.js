const mongoose = require('mongoose');
const validator = require('validator');

const { Schema } = mongoose;

const NoteSchema = new Schema({
    userID: { 
        type: String,  
        required: true 
    },

    doctorID: { 
        type: String,
        required: true 
    },

    note: { 
        type: String, 
        required: true 
    },

    noteID: {
        type: String, 
        required: true,
        unique: true
    },

    timestamp: { 
        type: Date, 
        default: Date.now 
    },

    isActive: { type: Boolean, default: true },
  });
  



const Notes = mongoose.model('Notes', NoteSchema);

module.exports = Notes;
