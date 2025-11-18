import mongoose, { Schema, Document, Model, Types } from 'mongoose';

/**
 * Asistencia (Attendance)
 * Tracks attendance of members at vigils
 */
export interface IAsistencia extends Document {
  vigiliaId: Types.ObjectId;
  socioId: Types.ObjectId;
  efectiva: boolean;
  ordenLlegada?: number;
  horaLlegada?: Date;
  horaSalida?: Date;
  observaciones?: string;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

const AsistenciaSchema = new Schema<IAsistencia>(
  {
    vigiliaId: {
      type: Schema.Types.ObjectId,
      ref: 'Vigilia',
      required: [true, 'La vigilia es requerida'],
      index: true,
    },
    socioId: {
      type: Schema.Types.ObjectId,
      ref: 'Socio',
      required: [true, 'El socio es requerido'],
      index: true,
    },
    efectiva: {
      type: Boolean,
      default: false,
    },
    ordenLlegada: {
      type: Number,
      min: [1, 'El orden de llegada debe ser mayor a 0'],
    },
    horaLlegada: {
      type: Date,
    },
    horaSalida: {
      type: Date,
    },
    observaciones: {
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
AsistenciaSchema.index({ vigiliaId: 1, socioId: 1 }, { unique: true });
AsistenciaSchema.index({ socioId: 1, fechaCreacion: -1 });

// Virtual para calcular tiempo de permanencia
AsistenciaSchema.virtual('tiempoPermanciaHoras').get(function () {
  if (this.horaLlegada && this.horaSalida) {
    return (
      (this.horaSalida.getTime() - this.horaLlegada.getTime()) /
      (1000 * 60 * 60)
    );
  }
  return 0;
});

const Asistencia: Model<IAsistencia> =
  mongoose.models.Asistencia ||
  mongoose.model<IAsistencia>('Asistencia', AsistenciaSchema);

export default Asistencia;
