// controllers/authController.js
const bcrypt = require('bcryptjs');
const passport = require("passport");
const pool = require('../db/pool');
const db = require('../db/queries');

const signUpGet = (req, res) => {
    res.render('sign-up-form', {
        first_name: '',   // default to empty string
        last_name: '',    // default to empty string
        username: '',     // default to empty string
        errorMessage: ''  // no error message initially
    });
};

const signUpPost = (req, res, next) => {

    const { first_name, last_name, username, password, confirmPassword } = req.body;

    if(password !== confirmPassword) {
        return res.render('sign-up-form', {
            errorMessage: 'Passwords do not match!',
            first_name,
            last_name,
            username,
        });
    }
    // using bcrypt to hash the password
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        if (err) {
            return next(err);
        }
        try {
            const member = false; // default 
            await db.createNewUser(first_name, last_name, username, hashedPassword, member);
            res.redirect("/");
        } catch (err) {
            return next(err);
        }
    });
};

const logInPost = passport.authenticate("local", { // checks the local strategy in passport.js 
    successRedirect: "/",
    failureRedirect: "/"
});

const logOutGet = (req, res) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        res.render('log-out');
    }); // passport method to clear users session data
}

const createPostGet = (req, res) => {
    res.render('create-post', {user: req.user});
}

async function createPostPost(req,res) {
    const user_id = req.user.id;
    const {title, text} = req.body;
    await db.addPost(title, text, user_id);
    res.redirect('/view-posts');
}

async function viewPostsGet(req, res) {
    try {
        const posts = await db.getAllPosts();
        res.render('view-posts', { posts: posts, user: req.user });
    } catch (err) {
        console.error('Error fetching posts:', err);
        res.status(500).send('An error occurred while fetching posts.');
    }
}

async function viewPostsPost(req, res) {
    try {
        const post_id = req.body.post_id;
        await db.deletePost(post_id);
        const posts = await db.getAllPosts();
        res.render('view-posts', { posts: posts, user: req.user });
    } catch (err) {
        res.status(500).send('An error occurred while deleting post.');
    }
}

async function membersGet(req, res) {
    res.render('members', {user: req.user, errorMessage: ''});
}

async function membersPost(req, res) {
    const user_id = req.user.id;
    const {secret} = req.body;
    if(secret === 'onepiece'){
        await db.setMemberTrue(user_id);
        res.render('members', {user: req.user, errorMessage: ''});
    } else {
        res.render('members', {user: req.user, errorMessage: 'Incorrect code'});
    }
}

module.exports = {
    signUpGet,
    signUpPost,
    logInPost,
    logOutGet,
    createPostGet,
    createPostPost,
    viewPostsGet,
    viewPostsPost,
    membersGet,
    membersPost,
};
