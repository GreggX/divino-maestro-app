import mongoose, { Schema, Document, Model, Types } from 'mongoose';

/**
 * Cuota (Fee/Payment)
 * Tracks fee payments from members
 */
export interface ICuota extends Document {
  socioId: Types.ObjectId;
  vigiliaId?: Types.ObjectId;
  monto: number;
  tipo: 'pago' | 'adeudo';
  concepto?: string;
  fechaPago?: Date;
  metodoPago?: 'efectivo' | 'transferencia' | 'otro';
  referencia?: string;
  notas?: string;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

const CuotaSchema = new Schema<ICuota>(
  {
    socioId: {
      type: Schema.Types.ObjectId,
      ref: 'Socio',
      required: [true, 'El socio es requerido'],
      index: true,
    },
    vigiliaId: {
      type: Schema.Types.ObjectId,
      ref: 'Vigilia',
      index: true,
    },
    monto: {
      type: Number,
      required: [true, 'El monto es requerido'],
      min: [0, 'El monto debe ser mayor o igual a 0'],
    },
    tipo: {
      type: String,
      enum: {
        values: ['pago', 'adeudo'],
        message: '{VALUE} no es un tipo válido',
      },
      required: [true, 'El tipo es requerido'],
    },
    concepto: {
      type: String,
      trim: true,
      default: 'Cuota mensual',
    },
    fechaPago: {
      type: Date,
    },
    metodoPago: {
      type: String,
      enum: {
        values: ['efectivo', 'transferencia', 'otro'],
        message: '{VALUE} no es un método de pago válido',
      },
    },
    referencia: {
      type: String,
      trim: true,
    },
    notas: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: {
      createdAt: 'fechaCreacion',
      updatedAt: 'fechaActualizacion',
    },
  }
);

// Indexes
CuotaSchema.index({ socioId: 1, tipo: 1 });
CuotaSchema.index({ socioId: 1, fechaCreacion: -1 });
CuotaSchema.index({ vigiliaId: 1 });

const Cuota: Model<ICuota> =
  mongoose.models.Cuota || mongoose.model<ICuota>('Cuota', CuotaSchema);

export default Cuota;
