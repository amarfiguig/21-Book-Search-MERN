// Importing necessary components and packages
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';
import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

// Creating an instance of ApolloClient with required settings
const client = new ApolloClient({
  // Adding authorization token to the headers of the GraphQL requests
  request: (operation) => {
    const token = localStorage.getItem('id_token');

    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : '',
      },
    });
  },
  uri: '/graphql',
});

// Main App component
function App() {
  // Wrapping App component with ApolloProvider and Router components
  return (
    <ApolloProvider client={client}>
      <Router>
        <>
          {/* Rendering Navbar component */}
          <Navbar />
          {/* Defining routes */}
          <Switch>
            {/* Route for searching books */}
            <Route exact path='/' component={SearchBooks} />
            {/* Route for displaying saved books */}
            <Route exact path='/saved' component={SavedBooks} />
            {/* Default route for displaying wrong page error */}
            <Route render={() => <h1 className='display-2'>Wrong page!</h1>} />
          </Switch>
        </>
      </Router>
    </ApolloProvider>
  );
}

// Exporting the main App component
export default App;
