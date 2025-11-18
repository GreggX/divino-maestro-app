import mongoose, { Schema, Document, Model, Types } from 'mongoose';

/**
 * Session
 * Represents a user session for authentication
 * Note: Currently unused - JWT tokens stored in HTTP-only cookies instead
 */
export interface ISession extends Document {
  userId: Types.ObjectId;
  expiresAt: Date;
  token: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SessionSchema = new Schema<ISession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El usuario es requerido'],
      index: true,
    },
    expiresAt: {
      type: Date,
      required: [true, 'La fecha de expiración es requerida'],
      index: true,
    },
    token: {
      type: String,
      required: [true, 'El token es requerido'],
      unique: true,
      index: true,
    },
    ipAddress: {
      type: String,
      trim: true,
    },
    userAgent: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
SessionSchema.index({ token: 1 }, { unique: true });
SessionSchema.index({ userId: 1, expiresAt: -1 });
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index

const Session: Model<ISession> =
  mongoose.models.Session || mongoose.model<ISession>('Session', SessionSchema);

export default Session;
