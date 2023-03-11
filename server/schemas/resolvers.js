// Import necessary packages
const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

// Define the resolvers object
const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      // Check if the user is authenticated
      if (context.user) {
        // Find the user data and remove some fields from the response
        const userData = await User.findOne({ _id: context.user._id }).select('-__v -password');

        return userData;
      }

      // Throw an error if the user is not authenticated
      throw new AuthenticationError('Not logged in');
    },
  },

  Mutation: {
    addUser: async (parent, args) => {
      console.log(args);
      // Create a new user
      const user = await User.create(args);
      // Generate a JWT token for the user
      const token = signToken(user);

      // Return the token and the user data
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      // Find the user with the given email
      const user = await User.findOne({ email });

      // Throw an error if the user does not exist
      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }

      // Check if the password is correct
      const correctPw = await user.isCorrectPassword(password);

      // Throw an error if the password is incorrect
      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      // Generate a JWT token for the user
      const token = signToken(user);

      // Return the token and the user data
      return { token, user };
    },
    saveBook: async (parent, { bookData }, context) => {
      // Check if the user is authenticated
      if (context.user) {
        // Update the user's saved books array by adding the new book data
        const updatedUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { savedBooks: bookData } },
          { new: true }
        );

        // Return the updated user data
        return updatedUser;
      }

      // Throw an error if the user is not authenticated
      throw new AuthenticationError('You need to be logged in!');
    },
    removeBook: async (parent, { bookId }, context) => {
      // Check if the user is authenticated
      if (context.user) {
        // Update the user's saved books array by removing the book with the given ID
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );

        // Return the updated user data
        return updatedUser;
      }

      // Throw an error if the user is not authenticated
      throw new AuthenticationError('You need to be logged in!');
    },
  },
};

// Export the resolvers object
module.exports = resolvers;
