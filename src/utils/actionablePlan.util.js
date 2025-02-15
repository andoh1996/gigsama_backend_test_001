
const createActionablePlans = (checklist = [], plan = [], noteID) => {
    try {
        // Ensure checklist and plan are arrays
        if (!Array.isArray(checklist) || !Array.isArray(plan)) {
            throw new Error("Invalid input: checklist and plan should be arrays");
        }

        const checklistArray = checklist.map(item => ({ task: item?.trim() || '' }));

        const planArray = plan.map(item => ({
            task: item.task || '',
            frequency: item.frequency || '',
            duration: item.duration || ''
        }));

        const ActionData = {
            noteID,
            checklist: checklistArray,
            plan: planArray
         }
 
         return ActionData
    } catch (error) {
        console.error("Error in createActionablePlans:", error);
        throw error; // Rethrow for handling upstream
    }
};



module.exports = {
    createActionablePlans
}