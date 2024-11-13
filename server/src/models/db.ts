import mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  image :string;
  isAdmin : boolean;
}

const userSchema: Schema<IUser> = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image:{type:String},
  isAdmin: { type: Boolean, default: false },
});

export default mongoose.model<IUser>('User', userSchema);
