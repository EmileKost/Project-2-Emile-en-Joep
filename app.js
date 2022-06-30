require('dotenv').config();

const express = require('express');
const expressGraphQL = require('express-graphql');
const defaults = require('graphql-defaults')
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 4269;

const fetch = import('node-fetch');

const { graphql } = require('@octokit/graphql')

app.listen(port, console.log('The app is running on '+ port));

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static(path.resolve('public')));
app.use(express.urlencoded({ extended: false}));

const graphqlAuth = graphql.defaults({
    headers: {
        authorization: "token " + process.env.GITHUB_PERSONAL_ACCES_TOKEN
    }
})

app.get('/', (req, res) => {
  graphqlAuth(`{
    user(login: "EmileKost") {
        repositories(affiliations: OWNER, first: 20, privacy: PUBLIC, orderBy: {field: UPDATED_AT, direction: DESC}) {
          edges {
            node {
              name
              description
              createdAt
              owner {
                id
              }
              updatedAt
              url
            }
          }
        }
      }
  }`)
  .then((data) => {
      console.log(data.user.repositories.edges)
      res.render('index', {
          data: data.user.repositories.edges
      })
      
  })
})

app.post('/', (req, res) => {
  const input = req.body.search;
  graphqlAuth(`
    query { 
      user(login: "EmileKost") {
        repository(name: "${input}") {
              name
              description
              createdAt
              owner {
                id
              }
              updatedAt
              url
            }
          }
        }
  `)
  .then(result => {
    console.log(result)
    res.render('search', {
      data: result.user.repository
    })
    .catch(err => res.send(err))
  })
})