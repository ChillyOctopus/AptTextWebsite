// SETUP

// Imports
const express = require('express');
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');

// Database
const { MongoClient } = require('mongodb');
const mongoConfig = require('./dbConfig.json');
const mongoUsername = mongoConfig.username;
const mongoPassword = mongoConfig.password;
const mongoHostname = mongoConfig.hostname;
const urlString = `mongodb+srv://${mongoUsername}:${mongoPassword}@${mongoHostname}/?retryWrites=true&w=majority`;

// General
const port = process.argv.length > 2 ? process.argv[2] : 4000;
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.static('public'));
var apiRouter = express.Router();
app.use(`/api`, apiRouter);



// ENDPOINTS

// Apartments (get & post)
apiRouter.get('/apartments', async (_req, res) => {
    const username = await getUsernameFromCookie(_req.cookies['token']);
    if (username === 'Unauthorized') {
        res.status(401).send({ msg: 'Unauthorized' });
        return;
    }
    res.send(await allFromCollection(username, 'apartments'));
});
apiRouter.post('/apartments', async (req, res) => {
    try {
        const username = await getUsernameFromCookie(req.cookies['token']);
        if (username === 'Unauthorized') {
            res.status(401).send({ msg: 'Unauthorized' });
            return;
        }
        const result = await setCollection(username, _apartments, 'apartments');
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Maintenance (get & post)
apiRouter.get('/maintenance', async (_req, res) => {
    const username = await getUsernameFromCookie(_req.cookies['token']);
    if (username === 'Unauthorized') {
        res.status(401).send({ msg: 'Unauthorized' });
        return;
    }
    res.send(await allFromCollection(username, 'maintenance'));
});
apiRouter.post('/maintenance', async (req, res) => {
    try {
        const username = await getUsernameFromCookie(req.cookies['token']);
        if (username === 'Unauthorized') {
            res.status(401).send({ msg: 'Unauthorized' });
            return;
        }
        const result = await setCollection(username, _maintenance, 'maintenance');
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Settings (get & post)
apiRouter.get('/settings', async (_req, res) => {
    const username = await getUsernameFromCookie(_req.cookies['token']);
    if (username === 'Unauthorized') {
        res.status(401).send({ msg: 'Unauthorized' });
        return;
    }
    res.send(await allFromCollection(username, 'settings'));
});
apiRouter.post('/settings', async (req, res) => {
    try {
        const username = await getUsernameFromCookie(req.cookies['token']);
        if (username === 'Unauthorized') {
            res.status(401).send({ msg: 'Unauthorized' });
            return;
        }
        const result = await setCollection(username, _settings, 'settings');
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Chat (get & post)
apiRouter.get('/chat', async (_req, res) => {
    const username = await getUsernameFromCookie(_req.cookies['token']);
    if (username === 'Unauthorized') {
        res.status(401).send({ msg: 'Unauthorized' });
        return;
    }
    res.send(await allFromCollection(username, 'chat'));
});
apiRouter.post('/chat', async (req, res) => {
    try {
        const username = await getUsernameFromCookie(req.cookies['token']);
        if (username === 'Unauthorized') {
            res.status(401).send({ msg: 'Unauthorized' });
            return;
        }
        const result = await insertOneIntoCollection(username, _chat, 'chat');
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Stats (get & post)
apiRouter.get('/data', async (_req, res) => {
    const username = await getUsernameFromCookie(_req.cookies['token']);
    if (username === 'Unauthorized') {
        res.status(401).send({ msg: 'Unauthorized' });
        return;
    }
    res.send(await allFromCollection(username, 'stats'));
});
apiRouter.post('/data', async (req, res) => {
    try {
        const username = await getUsernameFromCookie(req.cookies['token']);
        if (username === 'Unauthorized') {
            res.status(401).send({ msg: 'Unauthorized' });
            return;
        }

        let data = [{ "type": "textsSent", "value": JSON.stringify(getRandNum()) }, { "type": "textsRecieved", "value": JSON.stringify(getRandNum()) }, { "type": "phoneNum", "value": JSON.stringify(getRandNum()) }];
        setCollection(data, 'stats');

        const result = await insertOneIntoCollection(username, phoneNum, 'blockedNumbers');
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Text (post)
apiRouter.post('/text/:message', (req, res) => {
    sendMessage(req.params.message);
    res.send(lastMessage);
});

// Register / Login / User (post & post & get)
apiRouter.post('/register', async (req, res) => {
    if (await getUser(req.body.username)) {
        res.status(409).send({ msg: 'Username taken!' });
    } else {
        const user = await createUser(req.body.username, req.body.password);
        setAuthCookie(res, user.token);
        res.send({
            id: user._id,
        });
    }
});
apiRouter.post('/login', async (req, res) => {
    const user = await getUser(req.body.username);
    console.log(JSON.stringify(user));
    console.log(req.body.username);
    console.log(req.body.password);
    if (user) {
        if (await bcrypt.compare(req.body.password, user.password)) {
            setAuthCookie(res, user.token);
            res.send({ id: user._id });
            return;
        }
    }
    res.status(401).send({ msg: 'Unauthorized' });
});
apiRouter.get('/user', async (req, res) => {
    authToken = req.cookies['token'];
    const client = MongoClient(urlString);
    try {
        const db = client.db('master');
        const collection = db.collection('user');
        await client.connect();
        const user = await collection.findOne({ token: authToken });
        if (user) {
            res.send({ username: user.username });
            return;
        }
        res.status(401).send({ msg: 'Unauthorized' });

    } catch (error) {
        throw error;
    } finally {
        client.close;
    }
});

// Start
app.use((req, res) => {
    res.sendFile('index.html', { root: 'public' });
});
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});



//USER FUNCTIONS

// Create
async function createUser(username, password) {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = {
        username: username,
        password: passwordHash,
        token: uuid.v4(),
    };

    const client = new MongoClient(urlString);
    try {
        const db = client.db('master');
        const collection = db.collection('user');

        await client.connect();
        await collection.insertOne(user);

        return user;

    } catch (error) {
        throw error;
    } finally {
        await client.close();
    }
}

// Find
async function getUser(username) {
    const client = new MongoClient(urlString);
    try {
        const db = client.db('master');
        const collection = db.collection('user');

        await client.connect();
        return await collection.findOne({ username: username });
    } catch (error) {
        throw error;
    } finally {
        //await client.close();
    }
}

// Cookies
function setAuthCookie(res, authToken) {
    res.cookie('token', authToken, {
        secure: true,
        httpOnly: true,
        sameSite: 'strict',
    });
}

// Find with cookie
async function getUsernameFromCookie(token) {
    const client = new MongoClient(urlString);
    try {
        const db = client.db('master');
        const collection = db.collection('user');
        await client.connect();
        const user = await collection.findOne({ token: token });
        if (user) {
            return user.username;
        }

        return "Unauthorized";

    } catch (error) {
        throw error;
    } finally {
        client.close;
    }
}



//GENERAL DATABASE FUNCTIONS

// Find all
async function allFromCollection(username, collectionName) {
    const client = new MongoClient(urlString);
    const db = client.db(username);
    const collection = db.collection(collectionName);

    await client.connect();
    return JSON.stringify(await collection.find().toArray());
}

// Clear and set
async function setCollection(username, myData, collectionName) {
    const client = new MongoClient(urlString);
    try {
        const db = client.db(username);
        const collection = db.collection(collectionName);

        await client.connect();

        await clearCollection(collection);

        for (const obj of myData) {
            //console.log("Insertion array: "+JSON.stringify(myData));
            //console.log("Data we are inserting: "+JSON.stringify(obj));
            await collection.insertOne(obj);
        }
        const response = await collection.find().toArray();
        return response;

    } catch (error) {
        throw error;
    } finally {
        await client.close();
    }
}

// Insert one record
async function insertOneIntoCollection(username, myData, collectionName) {
    const client = new MongoClient(urlString);
    try {
        const db = client.db(username);
        const collection = db.collection(collectionName);

        await client.connect();
        await collection.insertOne(myData);

        const response = await collection.find().toArray();
        return response;

    } catch (error) {
        throw error;
    } finally {
        await client.close();
    }
}

// Clear collection
async function clearCollection(collection) {
    try {
        await collection.deleteMany();
    } catch (error) {
        throw error;
    }
}



//UTILITY

// Random number
function getRandNum() {
    return Math.floor(Math.random() * (100000 - 500) + 500);
}

// Send text
function sendMessage(_message) {
    return _message;
}



//EXAMPLE CODE
/*
    const { MongoClient } = require('mongodb');
    const uuid = require('uuid');
    const bcrypt = require('bcrypt');
    const cookieParser = require('cookie-parser');
    const express = require('express');
    const app = express();

    const mongoCreds = require('./dbConfig.json');
    const userName = mongoCreds.username;
    const password = mongoCreds.password;
    const hostname = mongoCreds.hostname;

    const url = `mongodb+srv://${userName}:${password}@${hostname}`;
    const client = new MongoClient(url);
    const collection = client.db('authTest').collection('user');

    app.use(cookieParser());
    app.use(express.json());

    // createAuthorization from the given credentials
    app.post('/auth/create', async (req, res) => {
    if (await getUser(req.body.email)) {
        res.status(409).send({ msg: 'Existing user' });
    } else {
        const user = await createUser(req.body.email, req.body.password);
        setAuthCookie(res, user.token);
        res.send({
        id: user._id,
        });
    }
    });

    // loginAuthorization from the given credentials
    app.post('/auth/login', async (req, res) => {
    const user = await getUser(req.body.email);
    if (user) {
        if (await bcrypt.compare(req.body.password, user.password)) {
        setAuthCookie(res, user.token);
        res.send({ id: user._id });
        return;
        }
    }
    res.status(401).send({ msg: 'Unauthorized' });
    });

    // getMe for the currently authenticated user
    app.get('/user/me', async (req, res) => {
    authToken = req.cookies['token'];
    const user = await collection.findOne({ token: authToken });
    if (user) {
        res.send({ email: user.email });
        return;
    }
    res.status(401).send({ msg: 'Unauthorized' });
    });

    function getUser(email) {
    return collection.findOne({ email: email });
    }

    async function createUser(email, password) {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = {
        email: email,
        password: passwordHash,
        token: uuid.v4(),
    };
    await collection.insertOne(user);

    return user;
    }

    function setAuthCookie(res, authToken) {
    res.cookie('token', authToken, {
        secure: true,
        httpOnly: true,
        sameSite: 'strict',
    });
    }

    const port = 8080;
    app.listen(port, function () {
    console.log(`Listening on port ${port}`);
    });
*/