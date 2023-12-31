// SETUP

// Imports
const express = require('express');
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const { WebSocketServer } = require('ws');

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
const wss = new WebSocketServer({ noServer: true });

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
        const result = await setCollection(username, req.body, 'apartments');
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
        const result = await setCollection(username, req.body, 'settings');
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
        const result = await insertOneIntoCollection(username, req.body, 'chat');
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

        const result = await insertOneIntoCollection(username, req.body, 'blockedNumbers');
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Text (post)
apiRouter.post('/text/:message', (req, res) => {
    sendTextMessage(req.params.message);
    res.send(lastMessage);
});

// Register / Login / User / Username (post & post & get)
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
    //console.log("Inside api/login.");
    if (user) {
        //console.log("Found user: "+JSON.stringify(user));
        if (await bcrypt.compare(req.body.password, user.password)) {
            //console.log("Password correct.");
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
            res.header('Content-Type', 'application/json');
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
apiRouter.get('/username', async (req, res) => {
    try {
        const username = await getUsernameFromCookie(req.cookies['token']);
        res.header('Content-Type', 'application/json');
        res.send(JSON.stringify({username: username}));
    } catch (error) {
        throw error;
    }
});

// Start
app.use((req, res) => {
    res.sendFile('index.html', { root: 'public' });
});
server = app.listen(port, () => {
    console.log(`Listening on ${port}`);
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



//WEBSOCKET

//Our array of connections
let connections = [];

// Handle the protocol upgrade from HTTP to WebSocket
server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, function done(ws) {
      wss.emit('connection', ws, request);
    });
});

// Handle the on connection, message, close, and pong logic
wss.on('connection', (ws) => {
  const connection = { id: connections.length + 1, alive: true, ws: ws };
  connections.push(connection);

  // Forward messages to everyone except the sender
  ws.on('message', function message(data) {
    const jsonData = JSON.parse(data);
    connections.forEach((c) => {
        if (c.id !== connection.id) {
            c.ws.send(JSON.stringify(jsonData));
        }
    });
  });

  // Remove the closed connection so we don't try to forward anymore
  ws.on('close', () => {
    connections.findIndex((o, i) => {
      if (o.id === connection.id) {
        connections.splice(i, 1);
        return true;
      }
    });
  });

  // Respond to pong messages by marking the connection alive
  ws.on('pong', () => {
    connection.alive = true;
  });

  // Handle how often to ping and pong the connections
  setInterval(() => {
      connections.forEach((c) => {
        // Kill any connection that didn't respond to the ping last time
        if (!c.alive) {
          c.ws.terminate();
        } else {
          c.alive = false;
          c.ws.ping();
        }
      });
  }, 30000);


});
  



// Send text
function sendTextMessage(_message) {
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