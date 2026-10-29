// ==============================================================================
// FILE: backend/controllers/menuController.js
// STUDENT: Shreyash (Student 2 - Menu & Food Management)
// PURPOSE: Request Controller for all Menu Operations (Get, Add, Edit, Remove, Toggle)
// ==============================================================================

// Step 1: Import our MenuItem model from models folder
// This gives us access to MongoDB operations like .find(), .create(), .findByIdAndUpdate(), etc.
const MenuItem = require('../models/MenuItem');

/**
 * -----------------------------------------------------------------------------
 * 1. GET MENU ITEMS
 * -----------------------------------------------------------------------------
 * Controller function to fetch dishes from MongoDB.
 * Handles: GET /api/menu and GET /api/menu/get
 * 
 * Supports optional URL query parameters:
 * - ?category=Breakfast (filters items by category)
 * - ?availableOnly=true (only returns dishes currently in stock)
 */
const getMenu = async (req, res) => {
  try {
    // Build a search filter object based on what the client requested in req.query
    const filter = {};

    // If the frontend asks for a specific category (e.g., ?category=Breakfast)
    if (req.query.category && req.query.category !== 'All') {
      filter.category = req.query.category;
    }

    // If the customer only wants dishes that are available right now (isAvailable: true)
    if (req.query.availableOnly === 'true') {
      filter.isAvailable = true;
    }

    // Find items in MongoDB matching the filter, sorted with newest first
    // await tells Node.js: "Wait for MongoDB to finish querying before moving to next line"
    const items = await MenuItem.find(filter).sort({ createdAt: -1 });

    // Send back the items to the browser/Postman as a JSON response with HTTP 200 (OK)
    res.status(200).json(items);
  } catch (error) {
    // If the database fails or crashes, catch the error and send a helpful error message
    console.error('Error fetching menu:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch menu items from database',
      error: error.message,
    });
  }
};

/**
 * -----------------------------------------------------------------------------
 * 2. GET SINGLE MENU ITEM BY ID
 * -----------------------------------------------------------------------------
 * Controller function to get full details of one specific food item.
 * Handles: GET /api/menu/:id
 */
const getMenuItemById = async (req, res) => {
  try {
    // req.params.id gets the value from the URL path, e.g. /api/menu/6652ef...
    const item = await MenuItem.findById(req.params.id);

    // If no item is found with that MongoDB ID, send back 404 (Not Found)
    if (!item) {
      return res.status(404).json({
        success: false,
        message: `Menu item with ID ${req.params.id} not found`,
      });
    }

    // Return the found item
    res.status(200).json(item);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Invalid menu item ID format',
      error: error.message,
    });
  }
};

/**
 * -----------------------------------------------------------------------------
 * 3. ADD A NEW MENU ITEM
 * -----------------------------------------------------------------------------
 * Controller function to add a new food item into the menu.
 * Handles: POST /api/menu and POST /api/menu/add
 * 
 * Data comes from req.body (sent as JSON from frontend form or Postman)
 */
const addMenuItem = async (req, res) => {
  try {
    // Destructure (pull out) the fields from the incoming request body
    const {
      name,
      category,
      price,
      description,
      tags,
      image,
      isVeg,
      isAvailable,
    } = req.body;

    // Validate required fields in simple if statements
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both dish name and description',
      });
    }

    // Second-year student requirement: Keep default price as 1 rupee!
    // If price wasn't specified or was 0, we make sure it defaults to 1.
    const finalPrice = price !== undefined && price !== null && Number(price) > 0 ? Number(price) : 1;

    // Create and save the new document in MongoDB
    const newItem = await MenuItem.create({
      name: name.trim(),
      category: category ? category.trim() : 'Snacks',
      price: finalPrice,
      description: description.trim(),
      tags: Array.isArray(tags) ? tags : (tags ? [tags] : []),
      image: image ? image.trim() : '',
      isVeg: isVeg !== undefined ? Boolean(isVeg) : true,
      isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : true,
    });

    // Send HTTP 201 (Created) status with the newly saved item
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error adding menu item:', error.message);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to add menu item',
    });
  }
};

/**
 * -----------------------------------------------------------------------------
 * 4. EDIT / UPDATE AN EXISTING MENU ITEM
 * -----------------------------------------------------------------------------
 * Controller function to edit/update dish details (price, name, tags, description, etc.).
 * Handles: PUT /api/menu/:id and PUT /api/menu/edit/:id (or POST /api/menu/edit/:id)
 */
const editMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    // First check if the dish actually exists in MongoDB
    const existingItem = await MenuItem.findById(id);
    if (!existingItem) {
      return res.status(404).json({
        success: false,
        message: `Cannot edit: Dish with ID ${id} was not found`,
      });
    }

    // If price is updated, ensure it is a valid positive number
    const updateData = { ...req.body };
    if (updateData.price !== undefined) {
      updateData.price = Number(updateData.price);
    }

    // findByIdAndUpdate takes 3 arguments:
    // 1. The document ID to find
    // 2. The fields to update
    // 3. Options: { new: true } returns the updated document, { runValidators: true } enforces schema rules
    const updatedItem = await MenuItem.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedItem);
  } catch (error) {
    console.error('Error editing menu item:', error.message);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to edit menu item',
    });
  }
};

/**
 * -----------------------------------------------------------------------------
 * 5. TOGGLE / UPDATE MENU AVAILABILITY
 * -----------------------------------------------------------------------------
 * Controller function to quickly toggle whether an item is available or sold out.
 * Handles: PATCH /api/menu/:id/availability
 */
const toggleAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { isAvailable } = req.body;

    // Check if isAvailable is provided as a boolean
    if (typeof isAvailable !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'isAvailable field must be true or false',
      });
    }

    // Update only the isAvailable property in MongoDB
    const updatedItem = await MenuItem.findByIdAndUpdate(
      id,
      { isAvailable },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({
        success: false,
        message: `Menu item with ID ${id} not found`,
      });
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    console.error('Error updating availability:', error.message);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update availability',
    });
  }
};

/**
 * -----------------------------------------------------------------------------
 * 6. REMOVE / DELETE A MENU ITEM
 * -----------------------------------------------------------------------------
 * Controller function to remove a dish from the menu.
 * Handles: DELETE /api/menu/:id and DELETE /api/menu/remove/:id (or POST /api/menu/remove/:id)
 */
const removeMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the item in one step
    const deletedItem = await MenuItem.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({
        success: false,
        message: `Cannot remove: Dish with ID ${id} not found`,
      });
    }

    // Return a success status and the deleted item's ID
    res.status(200).json({
      success: true,
      message: `Dish "${deletedItem.name}" was successfully removed from the menu`,
      id: id,
    });
  } catch (error) {
    console.error('Error removing menu item:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to remove menu item',
    });
  }
};

// Export all controller functions so our routes file can call them
module.exports = {
  getMenu,
  getMenuItemById,
  addMenuItem,
  editMenuItem,
  toggleAvailability,
  removeMenuItem,
};
