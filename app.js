require("dotenv").load();
const express = require("express");
const app = express();
const queries = require("./queries");
const bodyParser = require("body-parser");
const cors = require("cors");
const Twitter = require("twitter");
const client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

app.use(cors());
app.use(bodyParser.json());

app.get("/", (request, response) => {
  queries
    .list("personalLocations")
    .then(personalLocations =>
      queries.list("woeid").then(woeid =>
        response.json({
          personalLocations: personalLocations,
          woeid: woeid
        })
      )
    )
    .catch(error => console.log(error));
});

app.get("/tweets", (request, response) => {
  var params = { id: 23424977 };
  client.get("trends/place", params, function(error, tweets, twitterResponse) {
    if (!error) {
      console.log(tweets);
      response.send({ tweets });
    }
  });
});

app.get("/tweets/:id", (request, response) => {
  var id = {id: request.params.id};
  client.get("trends/place", id, function(error, tweets, twitterResponse) {
    if (!error) {
      console.error(error);
      response.send({ tweets });
    }
  });
});

app.get("/personalLocations", (request, response) => {
  queries
    .list("personalLocations")
    .then(personalLocations => {
      response.json({ personalLocations });
    })
    .catch(error => console.log(error));
});

app.get("/personalLocations/:id", (request, response) => {
  queries
    .read(request.params.id, "personalLocations")
    .then(personalLocations => {
      personalLocations
        ? response.json({ personalLocations })
        : response.sendStatus(404);
    })
    .catch(console.error);
});

app.get("/woeid", (request, response) => {
  queries
    .list("woeid")
    .then(woeid => {
      response.json({ woeid });
    })
    .catch(error => console.log(error));
});

app.get("/woeid/:id", (request, response) => {
  queries
    .read(request.params.id, "woeid")
    .then(woeid => {
      woeid ? response.json({ woeid }) : response.sendStatus(404);
    })
    .catch(console.error);
});

app.post("/personalLocations", (request, response) => {
  queries
    .createLocations(request.body)
    .then(personalLocations => {
      response.status(201).json({ personalLocations: personalLocations });
    })
    .catch(console.error);
});

app.delete("/personalLocations/:id", (request, response) => {
  queries
    .deleteLocations(request.params.id)
    .then(() => {
      response.sendStatus(204);
    })
    .catch(console.error);
});

app.put("/personalLocations/:id", (request, response) => {
  queries
    .updateLocations(request.params.id, request.body)
    .then(personalLocations => {
      response.json({ personalLocations: personalLocations[0] });
    })
    .catch(console.error);
});

module.exports = app;
