// ==============================================================================
// FILE: backend/routes/menuRoutes.js
// PURPOSE: Express Router connecting URLs to our menuController logic
// ==============================================================================

const express = require('express');
const router = express.Router();

// Import our controller functions
const {
  getMenu,
  getMenuItemById,
  addMenuItem,
  editMenuItem,
  toggleAvailability,
  removeMenuItem,
} = require('../controllers/menuController');

// Import the consolidated, secure auth middleware
const { protect, authorize } = require('../middleware/auth');

// ==============================================================================
// ROUTES DEFINITIONS
// ==============================================================================

/**
 * -----------------------------------------------------------------------------
 * 1. GET MENU
 * -----------------------------------------------------------------------------
 * Route: GET /api/menu OR GET /api/menu/get
 * Description: Retrieves all cafeteria food items (with optional filters)
 * Access: Public (Anyone can view the menu)
 */
router.get('/', getMenu);
router.get('/get', getMenu);

/**
 * -----------------------------------------------------------------------------
 * 2. GET SINGLE ITEM
 * -----------------------------------------------------------------------------
 * Route: GET /api/menu/:id
 * Description: Retrieves details of a single dish by its MongoDB _id
 * Access: Public
 */
router.get('/:id', getMenuItemById);

/**
 * -----------------------------------------------------------------------------
 * 3. ADD MENU ITEM
 * -----------------------------------------------------------------------------
 * Route: POST /api/menu OR POST /api/menu/add
 * Description: Adds a new dish to the cafeteria menu
 * Access: Admin / Cafeteria Staff
 */
router.post('/', protect, authorize('admin'), addMenuItem);
router.post('/add', protect, authorize('admin'), addMenuItem);

/**
 * -----------------------------------------------------------------------------
 * 4. EDIT MENU ITEM
 * -----------------------------------------------------------------------------
 * Route: PUT /api/menu/:id OR PUT/POST /api/menu/edit/:id
 * Description: Updates dish details (name, price, tags, description, etc.)
 * Access: Admin / Cafeteria Staff
 */
router.put('/:id', protect, authorize('admin'), editMenuItem);
router.put('/edit/:id', protect, authorize('admin'), editMenuItem);
router.post('/edit/:id', protect, authorize('admin'), editMenuItem); 

/**
 * -----------------------------------------------------------------------------
 * 5. TOGGLE AVAILABILITY
 * -----------------------------------------------------------------------------
 * Route: PATCH /api/menu/:id/availability
 * Description: Quick toggle to turn a dish In Stock or Sold Out
 * Access: Admin / Kitchen Staff
 */
router.patch('/:id/availability', protect, authorize('admin'), toggleAvailability);

/**
 * -----------------------------------------------------------------------------
 * 6. REMOVE MENU ITEM
 * -----------------------------------------------------------------------------
 * Route: DELETE /api/menu/:id OR DELETE/POST /api/menu/remove/:id
 * Description: Deletes a dish completely from the database
 * Access: Admin / Cafeteria Staff
 */
router.delete('/:id', protect, authorize('admin'), removeMenuItem);
router.delete('/remove/:id', protect, authorize('admin'), removeMenuItem);
router.post('/remove/:id', protect, authorize('admin'), removeMenuItem); 

module.exports = router;