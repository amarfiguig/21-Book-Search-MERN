import React from 'react';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/react-hooks'; // Importing hooks for querying and mutating data using Apollo Client
import { QUERY_ME } from '../utils/queries'; // Importing query for fetching user data
import { REMOVE_BOOK } from '../utils/mutations'; // Importing mutation for removing a book from the saved books list
import Auth from '../utils/auth'; // Importing helper function for checking if user is logged in
import { removeBookId } from '../utils/localStorage'; // Importing function for removing a book ID from local storage

const SavedBooks = () => {
  const { loading, data } = useQuery(QUERY_ME); // Querying the logged in user's data
  const [removeBook, { error }] = useMutation(REMOVE_BOOK); // Mutation for removing a book from the saved books list

  const userData = data?.me || {}; // Extracting the user data object from the query response, or setting it to an empty object

  const userDataLength = Object.keys(userData).length; // Getting the number of keys in the user data object

  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null; // Getting the user's auth token if they are logged in

    if (!token) {
      return false; // If user is not logged in, do not proceed with deleting the book and return false
    }

    try {
      const { data } = await removeBook({ // Calling the removeBook mutation with the bookId as the argument
        variables: { bookId },
      });

      removeBookId(bookId); // Removing the book ID from local storage
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) { // If data is still loading, display a loading message
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <Jumbotron fluid className='text-light bg-light'>
        <Container>
          <h1>Viewing {userData.username}'s saved books!</h1> // Displaying the logged in user's username
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData.savedBooks?.length // Checking if the user has any saved books
            ? `Viewing ${userData.savedBooks.length} saved ${
                userData.savedBooks.length === 1 ? 'book' : 'books'
              }:`
            : 'You have no saved books!'}
        </h2>
        <CardColumns>
          {userData.savedBooks?.map((book) => { // Mapping over the saved books array and rendering a Card component for each book
            return (
              <Card key={book.bookId} border='dark'>
                {book.image ? (
                  <Card.Img
                    src={book.image}
                    alt={`The cover for ${book.title}`}
                    variant='top'
                  />
                ) : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button
                    className='btn-block btn-danger'
                    onClick={() => handleDeleteBook(book.bookId)} // Calling the handleDeleteBook function with the bookId as the argument
                  >
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedBooks;
