/**
 * Schedules reminders based on the extracted plan
 */
function scheduleReminders(patientId, plan) {
    plan.forEach(({ task, frequency, duration }) => {
      for (let i = 0; i < duration; i++) {
        let reminderDate = new Date();
        reminderDate.setDate(reminderDate.getDate() + i);
  
        const newReminder = new Reminder({ patientId, task, dueDate: reminderDate });
        newReminder.save();
  
        schedule.scheduleJob(reminderDate, async () => {
          console.log(`Reminder for Patient ${patientId}: ${task}`);
        });
      }
    });
  }