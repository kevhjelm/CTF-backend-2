const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());

// This object will store the users' scores and flags
const users = {};

const validFlags = [
    "flag{api1_d0cd9be2324cc237235b}",
    "flag{api2_6bf2beda61e2a1ab2d0a}",
    "flag{api3_0bad677bfc504c75ff72}",
    "flag{api4_ce696239323ea5b2d015}",
    "flag{api5_76dd990a97ff1563ae76}",
    "flag{api6_afb969db8b6e272694b4}",
    "flag{api7_e71b65071645e24ed50a}",
    "flag{api8_509f8e201807860d5c91}",
    "flag{api9_81e306bdd20a7734e244}",
    "flag{api10_5db611f7c1ffd747971f}"
];

app.post('/submit-flag', (req, res) => {
    const { username, flag } = req.body;

    if (!username || !flag) {
        return res.status(400).send('Username and flag are required.');
    }

    if (!validFlags.includes(flag)) {
        return res.status(400).send('Invalid flag.');
    }

    if (!users[username]) {
        users[username] = { score: 0, flags: [] };
    }

    if (users[username].flags.includes(flag)) {
        return res.status(400).send('Flag has already been submitted.');
    }

    users[username].flags.push(flag); // Record the flag
    users[username].score += 10; // Increment the user's score

    res.status(200).json({ message: 'Flag accepted', score: users[username].score });
});

app.get('/scores', (req, res) => {
    const scores = {};
    for (let user in users) {
        scores[user] = users[user].score;
    }
    res.status(200).json(scores);
});

// Endpoint for resetting the scoreboard (should be protected in production)
app.post('/reset', (req, res) => {
    // Reset users' data
    for (let user in users) {
        delete users[user]; // This deletes each user entry
    }

    res.status(200).send('Scoreboard and all users have been reset.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});