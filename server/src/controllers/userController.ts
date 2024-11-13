import { Request, Response,RequestHandler } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/db';


export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password, name } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ error: 'Email already registered' });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      isAdmin: false
    });
    await newUser.save();

    res.status(201).json({ user: newUser });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Login User
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ error: 'Invalid credentials' });
      return;
    }

   
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ error: 'Please Enter the correct Password' });
      return;
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' }
    );
  
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        email: user.email, 
        name: user.name,
        image: user.image,
        isAdmin : user.isAdmin
      } 
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Received request to /api/me');
    console.log('Request headers:', req.headers);
    console.log('Decoded user ID:', req.body.decodedUser.id);

    const user = await User.findById(req.body.decodedUser.id).select('-password');
    console.log("The user:", user);

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Get User Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const updateProfile: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, name, email, image } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { _id: id },
      { $set: { name, email, image } },
      { new: true, runValidators: true }
    );

    if (updatedUser) {
  
      res.status(200).json({ user: updatedUser });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    if ((error as any).code === 11000) {
      res.status(400).json({ message: 'Email already exists' });
    } else {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

export const getUserData =  async (req: Request, res: Response): Promise<void>  => {
  try{
      const {email} = req.body
      if(!email){
          return
      }
    
      console.log(email,'email new req call')
      const user = await User.findOne({email})
      if (!user) {
       res.status(400).json({ message: 'Invalid email' });
      }
      res.status(200).json({ user, message: 'fetched successfull' });

  }catch(error){
      res.status(500).json({ message: 'Server error' });
  }
}