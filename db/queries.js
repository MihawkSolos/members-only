const pool = require('./pool.js');

async function createNewUser(first_name, last_name, username, password, member) {
    try {
        await pool.query(
            `
            INSERT INTO users (first_name, last_name, username, password, member)
            VALUES ($1, $2, $3, $4, $5);
            `,
            [first_name, last_name, username, password, member]
        );
    } catch (err) {
        console.error("Error creating new user:", err);
        throw err;
    }
}

async function getAllPosts() {
    try {
        const { rows } = await pool.query('SELECT * FROM posts ORDER BY timestamp DESC;');
        return rows;  // Return the posts array from the query
    } catch (err) {
        console.error('Error fetching posts:', err);
        throw err;  // Make sure the error is thrown to be handled in the controller
    }
}


async function addPost(title, text, user_id) {
    try {
        await pool.query(`
            INSERT INTO posts (title, text, user_id)
            VALUES 
            ($1, $2, $3);
            `,
            [title, text, user_id]
        )
    } catch (err){
        console.error("Error creating new post:", err);
        throw err;
    }
}

async function setMemberTrue(user_id) {
    try {
        await pool.query(`
            UPDATE users 
            SET member = $1
            WHERE id = $2;
            `, [true, user_id]
        )
    } catch (err){
        console.error("Error changing member status: ", err);
        throw err;
    }
}

async function deletePost(post_id) {
    try {
        await pool.query(`
            DELETE FROM posts 
            WHERE id = $1;
            `, [post_id]
        )
    } catch (err){
        console.error("Error deleting post: ", err);
        throw err;
    }
}

module.exports = {
    createNewUser,
    getAllPosts,
    addPost,
    setMemberTrue,
    deletePost,
}    
