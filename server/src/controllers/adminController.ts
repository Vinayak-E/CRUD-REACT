import { Request, Response,RequestHandler } from 'express';
import User from '../models/db'
import bcrypt from 'bcryptjs'


export const getUsers = async (req: Request, res: Response): Promise<any> => {
  try {
    const { query } = req.query;
    let users;

    if (query) {
      users = await User.find({
        $and: [
          { isAdmin: false },
          {
            $or: [
              { name: { $regex: query, $options: 'i' } },
              { email: { $regex: query, $options: 'i' } },
            ],
          },
        ],
      });
    } else {
      users = await User.find({ isAdmin: false });
    }

    return res.status(200).json({ users });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching users' });
  }
};

export const addUser = async(req: Request, res: Response): Promise<any> => {
    const { name, email, isAdmin,password } = req.body;
    try {
   
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User with this email already exists.' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({ name, email, isAdmin ,password:hashedPassword});
      await newUser.save();
  
      res.status(201).json({ message: 'User added successfully', user: newUser });
    } catch (error) {
      console.error('Error adding user:', error);
      res.status(500).json({ message: 'Failed to add user. Please try again later.' });
    }
  };
  
  export const updateUser = async (req: Request, res: Response): Promise<any> => {
    const { userId } = req.params;
    const { name, email, isAdmin } = req.body;
  
    try {

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (email && email !== user.email) {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: 'User with this email already exists.' });
        }
      }
  
      // Update the user
      user.name = name;
      user.email = email;
      user.isAdmin = isAdmin;
      await user.save();
  
      res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ message: 'Failed to update user. Please try again later.' });
    }
  };
  

  export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;
  
    try {
      const user = await User.findByIdAndDelete(userId);
  
      if (!user) {
        console.log('User not found');
        res.status(404).json({ message: 'User not found' });
        return;
      }
  
      console.log('User deleted successfully');
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ message: 'Failed to delete user. Please try again later.' });
    }
  };