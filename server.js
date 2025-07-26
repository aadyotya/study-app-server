const express = require('express');

const bodyParser = require('body-parser');

const cors = require('cors');



const app = express();

const PORT = process.env.PORT || 3000;



// This object will store the most recent data for each user

let roomData = {};



app.use(cors());

app.use(bodyParser.json());



// This endpoint is where your browser will send its status updates

app.post('/update', (req, res) => {

  const { userId, data } = req.body;

  if (!userId || !data) {

    return res.status(400).send('Invalid data');

  }

  

  // Store the latest data for this user, along with a timestamp

  roomData[userId] = {

    data: data,

    lastUpdated: Date.now()

  };

  

  res.sendStatus(200);

});



// This endpoint is where your browser will ask for your girlfriend's status

app.get('/status', (req, res) => {

  const { userId } = req.query;

  let otherUserData = null;



  // Find the other user's data in the room

  for (const id in roomData) {

    if (id !== userId) {

      otherUserData = roomData[id].data;

      break;

    }

  }

  

  res.json({ otherUser: otherUserData });

});



// A simple cleanup routine to remove users who have been inactive for over a minute

setInterval(() => {

    const now = Date.now();

    for (const userId in roomData) {

        if (now - roomData[userId].lastUpdated > 60000) { // 60 seconds

            delete roomData[userId];

        }

    }

}, 10000); // Check every 10 seconds



app.listen(PORT, () => {

  console.log(`Server listening on port ${PORT}`);

});
