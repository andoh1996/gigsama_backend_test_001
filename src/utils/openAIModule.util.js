const { OpenAI } = require("openai");
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });


/**
 * LLM function to extract actionable steps (Checklist & Plan)
 */

async function extractActionableSteps(notes) {
    const safeNotes = JSON.stringify(notes);
  
    // Construct the prompt
    const prompt = `Extract actionable steps from the following doctor notes and generate reminders based on the plan. The reminder_times should always start from today (${new Date().toISOString()}). Repeat the each reminder until it is exhausted and repeat each reminder_time as separate object and not array:
    Notes: ${safeNotes}
    Please provide the output in valid JSON format:
    {
    "checklist": ["Immediate task 1", "Immediate task 2"],
    "plan": [{"task": "Task name", "frequency": "daily/weekly", "duration": "3 days/ 1 month}],
    "reminder": [{"task": "Take paracetamol 500", "reminder_times": "2025-02-14T22:37:47Z"}, {"task": "Take paracetamol 500", "reminder_times": "2025-02-18T22:37:47Z"}]
    }`;

  
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.5,
      });
  
      // Log response to see what is returned
      let responseContent = (response.choices[0].message.content);

      // Remove the backticks or any unwanted characters (like 'json' markdown formatting)
      responseContent = responseContent.replace(/^```json/, '').replace(/```$/, '').trim();

      console.log(responseContent)
  
      // Try parsing the JSON response
      return JSON.parse(responseContent);
    } catch (error) {
      console.error('Error parsing response:', error);
      // Handle the error or return a default value
      return { checklist: [], plan: [] };
    }
  }
  

  async function generateReminders(plan) {
    const safeNotes = JSON.stringify(plan);
  
    // Construct the prompt
    const prompt = `Generate reminders based on the following medical plan:

    Plan:
    ${JSON.stringify(plan, null, 2)}

        Ensure the reminders:
        - Clearly specify the task.
        - Include the frequency of execution.
        - Indicate the duration where applicable.
        - Format the output in valid JSON as follows:

        {
        "reminders": [
            {
            "task": "Task description",
            "reminder_times": ["YYYY-MM-DD HH:mm", "YYYY-MM-DD HH:mm"], 
            "repeat": "every X hours/days" or "once",
            "notes": "Any additional context if needed"
            }
        ]
        }
        
        - Convert frequency and duration into actual reminder times where possible.
        - If the task is ongoing or as needed, provide an appropriate reminder strategy.
        - Ensure output is structured and strictly valid JSON.`;
        
    
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.5,
      });
  
      // Log response to see what is returned
      let responseContent = (response.choices[0].message.content);

      // Remove the backticks or any unwanted characters (like 'json' markdown formatting)
      responseContent = responseContent.replace(/^```json/, '').replace(/```$/, '').trim();
  
      // Try parsing the JSON response
      return JSON.parse(responseContent);
    } catch (error) {
      console.error('Error parsing response:', error);
      // Handle the error or return a default value
      return { checklist: [], plan: [] };
    }
  }

  module.exports = {
    extractActionableSteps,
    generateReminders
  }