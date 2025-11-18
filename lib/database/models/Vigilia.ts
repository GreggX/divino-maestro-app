import mongoose, { Schema, Document, Model, Types } from 'mongoose';

/**
 * Vigilia (Vigil)
 * Represents a monthly vigil event
 */
export interface IVigilia extends Document {
  seccionId: Types.ObjectId;
  fecha: Date;
  fechaInicio: Date;
  fechaFin: Date;
  turnoNumero: number;
  titular: string;
  capellan?: string;
  jefe?: string;
  portaHachas?: string[];
  ayudaronMisa?: string[];
  observaciones?: string;
  estado: 'programada' | 'en_curso' | 'finalizada' | 'cancelada';
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

const VigiliaSchema = new Schema<IVigilia>(
  {
    seccionId: {
      type: Schema.Types.ObjectId,
      ref: 'Seccion',
      required: [true, 'La sección es requerida'],
      index: true,
    },
    fecha: {
      type: Date,
      required: [true, 'La fecha de la vigilia es requerida'],
    },
    fechaInicio: {
      type: Date,
      required: [true, 'La fecha de inicio es requerida'],
    },
    fechaFin: {
      type: Date,
      required: [true, 'La fecha de fin es requerida'],
    },
    turnoNumero: {
      type: Number,
      required: [true, 'El número de turno es requerido'],
      min: [1, 'El número de turno debe ser mayor a 0'],
    },
    titular: {
      type: String,
      required: [true, 'El titular es requerido'],
      trim: true,
    },
    capellan: {
      type: String,
      trim: true,
    },
    jefe: {
      type: String,
      trim: true,
    },
    portaHachas: [
      {
        type: String,
        trim: true,
      },
    ],
    ayudaronMisa: [
      {
        type: String,
        trim: true,
      },
    ],
    observaciones: {
      type: String,
      trim: true,
    },
    estado: {
      type: String,
      enum: {
        values: ['programada', 'en_curso', 'finalizada', 'cancelada'],
        message: '{VALUE} no es un estado válido',
      },
      default: 'programada',
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
VigiliaSchema.index({ seccionId: 1, fecha: -1 });
VigiliaSchema.index({ seccionId: 1, estado: 1 });
VigiliaSchema.index({ fecha: -1 });

// Virtual para calcular duración
VigiliaSchema.virtual('duracionHoras').get(function () {
  if (this.fechaInicio && this.fechaFin) {
    return (
      (this.fechaFin.getTime() - this.fechaInicio.getTime()) / (1000 * 60 * 60)
    );
  }
  return 0;
});

const Vigilia: Model<IVigilia> =
  mongoose.models.Vigilia || mongoose.model<IVigilia>('Vigilia', VigiliaSchema);

export default Vigilia;
