const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const app = express();
const collection = require("./config");

// Convert data into JSON format
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Use EJS as the view engine
app.set('view engine', 'ejs');

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Render the login page
app.get("/", (req, res) => {
    res.render("login");
});

// Render the signup page
app.get("/signup", (req, res) => {
    res.render("signup");
});


// Register User
app.post("/signup", async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await collection.findOne({ name: username });
        if (existingUser) {
            return res.status(400).send("User already exists. Please enter different credentials.");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await collection.insertMany({ name: username, password: hashedPassword });
        console.log("User registered successfully:", { username });
        res.redirect("/"); // Redirect to login page after successful signup
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).send("Error registering user. Please try again later.");
    }
});


// User Login
app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await collection.findOne({ name: username });
        if (!user) {
            return res.status(400).send("Username not found.");
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) {
            return res.render("home");
        } else {
            return res.status(400).send("Incorrect password.");
        }
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).send("Error logging in. Please try again later.");
    }
});

const port = 5000;
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
