const { User } = require('../models'); // Import the User model from '../models'
const { signToken } = require('../utils/auth'); // Import the signToken function from '../utils/auth'

module.exports = {
  // Get a single user by ID or username
  async getSingleUser({ user = null, params }, res) {
    const foundUser = await User.findOne({
      $or: [{ _id: user ? user._id : params.id }, { username: params.username }],
    }); // Find a user with the specified ID or username

    if (!foundUser) {
      return res.status(400).json({ message: 'Cannot find a user with this id!' }); // If no user is found, return a 400 error response
    }

    res.json(foundUser); // If a user is found, return the user object as a JSON response
  },

  // Create a new user
  async createUser({ body }, res) {
    const user = await User.create(body); // Create a new user using the request body

    if (!user) {
      return res.status(400).json({ message: 'Something is wrong!' }); // If the user creation fails, return a 400 error response
    }

    const token = signToken(user); // Generate a JWT token for the user
    res.json({ token, user }); // Return the JWT token and the user object as a JSON response
  },

  // Log in a user
  async login({ body }, res) {
    const user = await User.findOne({ $or: [{ username: body.username }, { email: body.email }] }); // Find a user with the specified username or email

    if (!user) {
      return res.status(400).json({ message: "Can't find this user" }); // If no user is found, return a 400 error response
    }

    const correctPw = await user.isCorrectPassword(body.password); // Check if the password is correct

    if (!correctPw) {
      return res.status(400).json({ message: 'Wrong password!' }); // If the password is incorrect, return a 400 error response
    }

    const token = signToken(user); // Generate a JWT token for the user
    res.json({ token, user }); // Return the JWT token and the user object as a JSON response
  },

  // Add a book to a user's saved books
  async saveBook({ user, body }, res) {
    console.log(user);
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        { $addToSet: { savedBooks: body } },
        { new: true, runValidators: true }
      ); // Add the book to the user's savedBooks array and return the updated user object

      return res.json(updatedUser); // Return the updated user object as a JSON response
    } catch (err) {
      console.log(err);
      return res.status(400).json(err); // If an error occurs, return a 400 error response
    }
  },

  // Delete a book from a user's saved books
  async deleteBook({ user, params }, res) {
    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      { $pull: { savedBooks: { bookId: params.bookId } } },
      { new: true }
    ); // Remove the specified book from the user's savedBooks array and return the updated user object

       if (!updatedUser) {
      return res.status(404).json({ message: "Couldn't find user with this id!" });
    }
    return res.json(updatedUser);
  },
};
