import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Verification
 * Represents email verification tokens
 * Note: Currently unused - reserved for future email verification feature
 */
export interface IVerification extends Document {
  identifier: string;
  value: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const VerificationSchema = new Schema<IVerification>(
  {
    identifier: {
      type: String,
      required: [true, 'El identificador es requerido'],
      trim: true,
      index: true,
    },
    value: {
      type: String,
      required: [true, 'El valor es requerido'],
      trim: true,
    },
    expiresAt: {
      type: Date,
      required: [true, 'La fecha de expiración es requerida'],
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
VerificationSchema.index({ identifier: 1, value: 1 });
VerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index

const Verification: Model<IVerification> =
  mongoose.models.Verification ||
  mongoose.model<IVerification>('Verification', VerificationSchema);

export default Verification;
