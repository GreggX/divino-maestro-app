import mongoose, { Schema, Document, Model, Types } from 'mongoose';

/**
 * Account
 * Represents authentication accounts (email/password, OAuth, etc.)
 * Note: Currently unused - preserved for future OAuth integration
 */
export interface IAccount extends Document {
  userId: Types.ObjectId;
  accountId: string;
  providerId: string;
  accessToken?: string;
  refreshToken?: string;
  idToken?: string;
  accessTokenExpiresAt?: Date;
  refreshTokenExpiresAt?: Date;
  scope?: string;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AccountSchema = new Schema<IAccount>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El usuario es requerido'],
      index: true,
    },
    accountId: {
      type: String,
      required: [true, 'El ID de cuenta es requerido'],
      trim: true,
    },
    providerId: {
      type: String,
      required: [true, 'El ID del proveedor es requerido'],
      trim: true,
    },
    accessToken: {
      type: String,
      trim: true,
    },
    refreshToken: {
      type: String,
      trim: true,
    },
    idToken: {
      type: String,
      trim: true,
    },
    accessTokenExpiresAt: {
      type: Date,
    },
    refreshTokenExpiresAt: {
      type: Date,
    },
    scope: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      select: false, // Don't include password in queries by default
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
AccountSchema.index({ userId: 1, providerId: 1 });
AccountSchema.index({ accountId: 1, providerId: 1 }, { unique: true });

const Account: Model<IAccount> =
  mongoose.models.Account || mongoose.model<IAccount>('Account', AccountSchema);

export default Account;
