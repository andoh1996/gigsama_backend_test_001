const cron = require('node-cron');
const ReminderModel = require('../models/reminders.model'); 
const factory = require('../modelServices/factory.service');

// Function to check and send reminders
const checkReminders = async () => {
  try {
    const now = new Date();
    
    const reminders = await factory.fetchItemsFromDB(ReminderModel, {
      reminder_times: { $lte: now },
      completed: false,
      isActive: true,
    });

    for (const reminder of reminders) {
      console.log(`New Reminder: ${reminder.task}`); 

      // Mark reminder as completed to avoid duplicate notifications
      await factory.updateOneItemInDb(ReminderModel, 
        { _id: reminder._id }, 
        { isActive: false, completed: true, status: 'completed' }
      );
    }
    
    console.log(`Checked reminders at ${now.toISOString()}`);
  } catch (error) {
    console.error('Error running cron job:', error);
  }
};

// Function to handle missed reminders
const handleMissedReminders = async () => {
  try {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000); // Compute time 1 hour ago

    const missedReminders = await factory.fetchItemsFromDB(ReminderModel, {
      reminder_times: { $lte: oneHourAgo }, // Find reminders overdue by at least 1 hour
      completed: false,
      isActive: true,
    });

    for (const missed of missedReminders) {
      // Extend the schedule by adding an extra day
      const newReminderTime = new Date(missed.reminder_times);
      newReminderTime.setDate(newReminderTime.getDate() + 1);

      // Mark the old reminder as missed and inactive
      await factory.updateOneItemInDb(ReminderModel, 
        { _id: missed._id }, 
        { isActive: false, completed: false, status: 'missed' }
      );

      // Create a new reminder for the missed task
      await factory.saveToDb(ReminderModel, {
        userID: missed.userID,
        task: missed.task,
        reminder_times: newReminderTime,
        completed: false,
        isActive: true,
      });
    }
  } catch (error) {
    console.error('Error handling missed reminders:', error);
  }
};

// Cron job runs every minute to check reminders and handle missed ones
cron.schedule('* * * * *', async () => {
  await checkReminders();
  await handleMissedReminders();
});

console.log('Checking for reminders.....')