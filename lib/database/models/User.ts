import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * User
 * Represents a user in the authentication system
 */
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  emailVerified: boolean;
  image?: string;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'El nombre es requerido'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'El email es requerido'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email no válido'],
    },
    password: {
      type: String,
      required: [true, 'La contraseña es requerida'],
      select: true, // Ensure password is selected by default
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
      trim: true,
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
UserSchema.index({ email: 1 }, { unique: true });

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
