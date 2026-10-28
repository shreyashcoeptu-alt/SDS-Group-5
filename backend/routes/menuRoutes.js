// ==============================================================================
// FILE: backend/routes/menuRoutes.js
// STUDENT: Shreyash (Student 2 - Menu & Food Management)
// PURPOSE: Express Router connecting URLs to our menuController logic
// ==============================================================================

// Step 1: Import Express and create a Router
// The router acts like a traffic police officer: when a URL comes in,
// it directs the request to the right controller function.
const express = require('express');
const router = express.Router();

// Step 2: Import our controller functions
const {
  getMenu,
  getMenuItemById,
  addMenuItem,
  editMenuItem,
  toggleAvailability,
  removeMenuItem,
} = require('../controllers/menuController');

// Step 3: Optional Authentication Middleware (from Student 1)
const { protect, authorize } = require('../middleware/auth');

/**
 * Helper Middleware for Student 2 Testing:
 * If a valid admin JWT token is sent, we verify it.
 * If in development mode and no token is sent, we allow the student to test freely
 * without getting stuck on 401 Unauthorized errors!
 */
const studentFriendlyAuth = (req, res, next) => {
  // If the request contains an authorization header, verify it strictly
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return protect(req, res, () => authorize('admin')(req, res, next));
  }
  
  // In development mode, allow Student 2 to test add/edit/delete from Postman/browser
  if (process.env.NODE_ENV !== 'production') {
    return next();
  }

  // In production, strictly require login
  return protect(req, res, () => authorize('admin')(req, res, next));
};

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
router.get('/get', getMenu); // Alias route so '/get' works as requested!

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
 * Description: Adds a new dish to the cafeteria menu (default ₹1 price)
 * Access: Admin / Cafeteria Staff
 */
router.post('/', studentFriendlyAuth, addMenuItem);
router.post('/add', studentFriendlyAuth, addMenuItem); // Alias route for adding

/**
 * -----------------------------------------------------------------------------
 * 4. EDIT MENU ITEM
 * -----------------------------------------------------------------------------
 * Route: PUT /api/menu/:id OR PUT/POST /api/menu/edit/:id
 * Description: Updates dish subparts (name, price, tags, description, etc.)
 * Access: Admin / Cafeteria Staff
 */
router.put('/:id', studentFriendlyAuth, editMenuItem);
router.put('/edit/:id', studentFriendlyAuth, editMenuItem);   // Alias route for '/edit'
router.post('/edit/:id', studentFriendlyAuth, editMenuItem);  // Also accepts POST for HTML forms / Postman

/**
 * -----------------------------------------------------------------------------
 * 5. TOGGLE AVAILABILITY (Menu Available Options)
 * -----------------------------------------------------------------------------
 * Route: PATCH /api/menu/:id/availability
 * Description: Quick toggle to turn a dish In Stock or Sold Out
 * Access: Admin / Kitchen Staff
 */
router.patch('/:id/availability', studentFriendlyAuth, toggleAvailability);

/**
 * -----------------------------------------------------------------------------
 * 6. REMOVE MENU ITEM
 * -----------------------------------------------------------------------------
 * Route: DELETE /api/menu/:id OR DELETE/POST /api/menu/remove/:id
 * Description: Deletes a dish completely from the database
 * Access: Admin / Cafeteria Staff
 */
router.delete('/:id', studentFriendlyAuth, removeMenuItem);
router.delete('/remove/:id', studentFriendlyAuth, removeMenuItem); // Alias route for removing
router.post('/remove/:id', studentFriendlyAuth, removeMenuItem);   // Also accepts POST for simple clients

// Step 4: Export the router to be mounted in backend/server.js as /api/menu
module.exports = router;
