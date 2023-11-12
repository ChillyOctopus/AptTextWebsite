const express = require('express');
const { Z_FULL_FLUSH } = require('zlib');
const app = express();

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
apiRouter.get('/apartments', (_req, res) => {
    res.send(JSON.stringify(apartments));
});

// UpdateApartments
apiRouter.post('/apartments', (req, res) => {
    updateApartments(req.body);
    res.send(JSON.stringify(apartments));
});
    
// GetMaintenance
apiRouter.get('/maintenance', (_req, res) => {
    res.send(JSON.stringify(maintenance));
});

// UpdateMaintenance
apiRouter.post('/maintenance', (req, res) => {
    updateMaintenance(req.body);
    res.send(JSON.stringify(maintenance));
});

// GetSettings
apiRouter.get('/settings', (_req, res) => {
    res.send(JSON.stringify(settings));
});

// UpdateSettings
apiRouter.post('/settings', (req, res) => {
    updateSettings(req.body);
    res.send(JSON.stringify(settings));
});
    
// GetChat
apiRouter.get('/chat', (_req, res) => {
   res.send(JSON.stringify(chat));
});

// UpdateChat
apiRouter.post('/chat', (req, res) => {
    updateChat(req.body);
    res.send(JSON.stringify("Updated"));
});
    
// GetData
apiRouter.get('/data', (_req, res) => {
    res.send(JSON.stringify(data));
});

// UpdateData
apiRouter.post('/data', (req, res) => {
    updateData(req.body)
    res.send(JSON.stringify(blockedNumbers));
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
let apartments = [];
let chat = [];
let data = {"textsSent": getRandNum(), "textsRecieved": getRandNum(), "phoneNum": getRandNum()};
let maintenance = [];
let settings = [];
let blockedNumbers = [];



function updateApartments(_apartments){
    apartments = _apartments;
    return apartments;
}

function updateMaintenance(_maintenance){
    maintenance = [];
    _maintenance.forEach((obj) => {
        const name = obj.name;
        const aptNum = obj.aptNum;
        const phoneNum = obj.phoneNum;
        const issue = obj.issue;
        const date = obj.date;
        const important = obj.important;
        let maintReq = {"name": name, "aptNum": aptNum, "phoneNum": phoneNum, "issue": issue, "date": date, "important": important};
        maintenance.push(maintReq);
    });

    return maintenance;
}

function updateSettings(_settings){
    //So far types are "contact" and "website". We may update them in the future
    // so we are allowing flexibility now.
    settings = _settings;
    return settings;
}

function updateChat(_chat){
    //This represents sending a chat
    chat.push(_chat);
    if(chat.length > 50) chat.length = 50;
    return chat;
}

function updateData(_data){
    //The post function for /data represents a number they want to block
    blockedNumbers.push(_data)
    return blockedNumbers;
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