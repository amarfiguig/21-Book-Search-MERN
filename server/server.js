const express = require('express');
const { ApolloServer } = require('apollo-server-express');
// new line above

const path = require('path');

const { typeDefs, resolvers } = require('./schemas');
// new line above
// Import `authMiddleware()` function to be configured with the Apollo Server
const { authMiddleware } = require('./utils/auth');
// new line above

const db = require('./config/connection');
const routes = require('./routes');

const PORT = process.env.PORT || 3001;
const app = express();

// new lines below
const server = new ApolloServer({
  typeDefs,
  resolvers,
  // Add context to our server so data from the `authMiddleware()` function can pass data to our resolver functions
  context: authMiddleware,
});
server.applyMiddleware({ app });
/// the above two lines are new

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// app.use(routes);    /// verify this line later
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'))
})

db.once('open', () => {
    app.listen(PORT, () => console.log(`🌍 Server now listening on localhost:${PORT}`));
  });

