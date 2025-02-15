
async function saveToDb(Model, Data, options = {}) {
  try {
    // Create an instance of the model with the provided data
    const itemsToSave = new Model(Data); 
    // Save the instance to the database
    const response = await itemsToSave.save(options);
    // Return the saved instance
    return response;
  } catch (error) {
    // If an error occurs, return the error object
    throw error;
    
  }
}

////fetching all items from database that meet paased queries
async function fetchItemsFromDB(model, query) {
  try {
    // Use the Mongoose model to find items based on the provided query
    const items = await model.find(query);
    // Return the array of items to the caller
    return items;
  } catch (error) {
    // Return the error to allow higher-level error handling
    throw error;
  }
}

////fetching one item from database that meet paased query
async function fetchOneItemFromDb(model, query) {
  try {
    // Use the Mongoose model provided to find items based on the provided query
    const item = await model.findOne(query);
    // Return the item to the caller
    return item;
  } catch (error) {
    // Return the error to allow higher-level error handling
    throw error;
  }
}

async function fetchByID(model, objectID) {
  // eslint-disable-next-line no-useless-catch
  try {
    const item = await model.findById(objectID);

    return item;
  } catch (error) {
    // Return the error to allow higher-level error handling
    throw error;
  }
}

////////updating many items in collection
async function updateManyItemInDb(model, query, updateItem) {
  // eslint-disable-next-line no-useless-catch
  try {
    // Use the Mongoose model to update multiple items based on the provided query
    const response = await model.updateMany(query, {$set: updateItem}, { new: true });

    // Return the result of the update operation
    return response;
  } catch (error) {
    // Return the error to allow higher-level error handling
    throw error;
  }
}

////////updating many items in collection
async function updateOneItemInDb(model, query, updateItem, options = {}) {
  try {
    // Combine the options with the "new: true" option to ensure the updated document is returned
    const response = await model.findOneAndUpdate(
      query, 
      { $set: updateItem }, 
      { ...options, new: true } 
    );

    // Return the result of the update operation
    return response;
  } catch (error) {
    // Rethrow the error for higher-level error handling
    throw error;
  }
}


async function findOneAndUpdate(model, query, updateItem, options = {}){
  try {
        // Perform atomic upsert for provider data
        const response = await model.findOneAndUpdate(query, 
          { $set: updateItem }, 
          { new: true, upsert: true, ...options }
        );
 // Return the result of the update operation
       return response
  } catch (error) {
    throw error;
  }
}

async function deleteItemFromDB(model, query) {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await model.deleteMany(query);

    return response;
  } catch (error) {
    // Return the error to allow higher-level error handling
    throw error;
  }
}

////////////////////deleting one item from db////////////////
async function deleteSingleItemFromDB(model, query) {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await model.deleteOne(query);

    return response;
  } catch (error) {
    // Return the error to allow higher-level error handling
    throw error;
  }
}


/////////////////////////////Grouping items////////////////
async function fetchDocumentByGrouping(model, query){
 // eslint-disable-next-line no-useless-catch
 try {
    const respond = await model.aggregate(query)
    
    return respond
 } catch (error) {
  throw error;
 }
}



async function fetchItemsAndOrderWithLimit(model, query, sortOrder, limitValue) {
  try {
    const results = await model.find(query).sort(sortOrder).limit(limitValue).exec();
   
    return results
    // Handle the sorted results here
  } catch (err) {
    console.log(err)
    throw err;
    // Handle the error
  }
}


async function fetchItemsWithOrder(model, query, sortOrder) {
  try {
    const results = await model.find(query).sort(sortOrder).exec();
   
    return results
    // Handle the sorted results here
  } catch (err) {
    throw err;
    // Handle the error
  }
}



async function fetchItemsWithLimit(model, query, limit) {
  try {
 
    // Define your query (you can add conditions as needed)
    const queryDb = model.find(query).limit(limit);

    // Execute the query with await
     const results = await queryDb.exec();

     return results

  } catch (err) {
    throw err;
    // Handle the error
  }
}

async function getItemFromDBByOrder(model, query, sort) {
  try {
    const results = await model.find(query).sort(sort).exec();
    return results
  } catch (err) {
    throw err;
  }
}


async function addToArray(model, query, arrayData) {
  try {
    const updatedDocument = await model.findByIdAndUpdate(
      query,
      { $push: arrayData },
      { new: true }
    );

    if (updatedDocument) {
      return updatedDocument
    } else {
      return null
    }
  } catch (err) {
    throw err;
  }
}


const searchByUsingRegex = async (model, search, limit) => {
  try {
    const items = await model.find({ diseaseName: { $regex: new RegExp(search, 'i') } }).limit(limit);
    return items;
  } catch (err) {
    throw err;
  }
};


// eslint-disable-next-line no-shadow
const updateAndAddToArray = async(model, query, updateItem) => {
  try {
    const response = await model.updateOne(query, updateItem);
    return response
  } catch (error) {
    throw error;
  }
}


async function countDocument(model, query) {
  try {
    const count = await model.countDocuments(query);
     //console.log(count)
     return count

  } catch (error) {
    throw error;
  }
}

async function updateIncreaseOrDecrease (model, query, updateItem) {
  try {
    const update = await model.findByIdAndUpdate(
      query,
      updateItem,
      { new: true } 
    )

    return update
  } catch (error) {
    throw error;  
  }
}



module.exports = {
  saveToDb,
  fetchItemsFromDB,
  fetchOneItemFromDb,
  fetchByID,
  updateManyItemInDb,
  updateOneItemInDb,
  deleteItemFromDB,
  deleteSingleItemFromDB,
  fetchDocumentByGrouping,
   fetchItemsAndOrderWithLimit,
   fetchItemsWithLimit,
   getItemFromDBByOrder,
   addToArray,
   fetchItemsWithOrder,
   searchByUsingRegex,
   updateAndAddToArray,
   countDocument,
   findOneAndUpdate,
   updateIncreaseOrDecrease
};
