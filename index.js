const express = require('express');
const { MongoClient } = require('mongodb');
const mongoConfig = require('./dbConfig.json');

const app = express();
const testUsername = 'MickyMouse';

//Getting our database set up.
const mongoUsername = mongoConfig.username;
const mongoPassword = mongoConfig.password;
const mongoHostname = mongoConfig.hostname;
const urlString = `mongodb+srv://${mongoUsername}:${mongoPassword}@${mongoHostname}/?retryWrites=true&w=majority`;


// The service port. In production the front-end code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 4000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Serve up the front-end static content hosting
app.use(express.static('public'));

// Router for service endpoints
var apiRouter = express.Router();
app.use(`/api`, apiRouter);



// GetApartments
apiRouter.get('/apartments', async (_req, res) => {
    res.send(await allFromCollection('apartments'));
});

// UpdateApartments
apiRouter.post('/apartments', async (req, res) => {
    try{
        const result = await updateApartments(req.body);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// GetMaintenance
apiRouter.get('/maintenance', async (_req, res) => {
    res.send(await allFromCollection('maintenance'));
});

// UpdateMaintenance
apiRouter.post('/maintenance', async (req, res) => {
    try{
        const result = await updateMaintenance(req.body);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// GetSettings
apiRouter.get('/settings', async (_req, res) => {
    res.send(await allFromCollection('settings'));
});

// UpdateSettings
apiRouter.post('/settings', async (req, res) => {
    try {
        const result = await updateSettings(req.body);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// GetChat
apiRouter.get('/chat', async (_req, res) => {
    res.send(await allFromCollection('chat'));
});

// UpdateChat
apiRouter.post('/chat', async (req, res) => {
    try {
        const result = await updateChat(req.body);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// GetData
apiRouter.get('/data', async (_req, res) => {
    res.send(await allFromCollection('stats'));
});

// UpdateData (just blocking a phone number)
apiRouter.post('/data', async (req, res) => {
    try {
        const result = await updateData(req.body);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Login
apiRouter.post('/login', (req, res) => {
    updateLogin(req.body);
    res.send(JSON.stringify(login));
});

// Text
apiRouter.post('/text/:message', (req, res) => {
    sendMessage(req.params.message);
    res.send(lastMessage);
});

// Return the application's default page if the path is unknown
app.use((req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});



let lastMessage = "";
let login = [];

async function updateApartments(_apartments){
    return setCollection(_apartments, 'apartments');
}

async function updateMaintenance(_maintenance){
    return setCollection(_maintenance, 'maintenance');
}

async function updateSettings(_settings) {
    return setCollection(_settings, 'settings');
}

async function updateChat(_chat){
    return insertOneIntoCollection(_chat, 'chat');
}

async function updateData(phoneNum) {
    //TODO allow data to update and change based on Twilio.
    let data = [{"type":"textsSent", "value":JSON.stringify(getRandNum())}, {"type":"textsRecieved", "value":JSON.stringify(getRandNum())}, {"type":"phoneNum", "value":JSON.stringify(getRandNum())}];
    setCollection(data, 'stats');
    return insertOneIntoCollection(phoneNum, 'blockedNumbers');
}

function updateLogin(_login){
    //We already know it's going to be that.
    login = {"username": _login.username, "password": _login.password};
    return login;
}

function sendMessage(_message){
    lastMessage = _message;
    return lastMessage;
}



async function allFromCollection(collectionName){
    const client = new MongoClient(urlString);
    const db = client.db(testUsername);
    const collection = db.collection(collectionName);
    await client.connect();
    return JSON.stringify(await collection.find().toArray());
}

async function setCollection(myData, collectionName){
    const client = new MongoClient(urlString);
    try {
        const db = client.db(testUsername);
        const collection = db.collection(collectionName);

        await client.connect();

        await clearCollection(collection);

        for (const obj of myData) {
            console.log("Insertion array: "+JSON.stringify(myData));
            console.log("Data we are inserting: "+JSON.stringify(obj));
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

async function insertOneIntoCollection(myData, collectionName){
    const client = new MongoClient(urlString);
    try {
        const db = client.db(testUsername);
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

async function clearCollection(collection){
    try {
        await collection.deleteMany();
    } catch (error) {
        throw error;
    }
}


function getRandNum(){
  return Math.floor(Math.random() * (100000 - 500) + 500);
}

/*

// Example code:
// SubmitScore
apiRouter.post('/score', (req, res) => {
    scores = updateScores(req.body, scores);
    res.send(scores);
  });

// updateScores considers a new score for inclusion in the high scores.
// The high scores are saved in memory and disappear whenever the service is restarted.
let scores = [];
function updateScores(newScore, scores) {
  let found = false;
  for (const [i, prevScore] of scores.entries()) {
    if (newScore.score > prevScore.score) {
      scores.splice(i, 0, newScore);
      found = true;
      break;
    }
  }

  if (!found) {
    scores.push(newScore);
  }

  if (scores.length > 10) {
    scores.length = 10;
  }

  return scores;
}

*/