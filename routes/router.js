// routes/authRoutes.js
const {Router} = require("express");
const router = Router();
const authController = require('../controllers/authController');

// Home route
router.get("/", (req, res) => {
    res.render("index", { user: req.user });
});
// Render the sign-up page
router.get("/sign-up", authController.signUpGet);
// Handle the sign-up form submission
router.post("/sign-up", authController.signUpPost);
// Handle log-in form submission
router.post("/log-in", authController.logInPost);
// render logged out page
router.get('/log-out', authController.logOutGet);
// render view posts page 
router.get('/view-posts', authController.viewPostsGet);
// handle view posts from submission to delete a post (members only)
router.post('/view-posts', authController.viewPostsPost);

// render create posts page
router.get('/create-post', authController.createPostGet);
// handle create-post form submission 
router.post('/create-post', authController.createPostPost);
// render members page 
router.get('/members', authController.membersGet);
// handle members post form submission
router.post('/members', authController.membersPost);


module.exports = router;
