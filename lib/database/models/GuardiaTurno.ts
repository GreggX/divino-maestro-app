import mongoose, { Schema, Document, Model, Types } from 'mongoose';

/**
 * GuardiaTurno (Guard Shift)
 * Represents guard shifts during the vigil with specific time slots
 */
export interface IGuardiaTurno extends Document {
  vigiliaId: Types.ObjectId;
  rangoHora: string; // e.g., "De 10 a 11"
  horarioEspecifico: string; // e.g., "10:45-11:00"
  horaInicio: Date;
  horaFin: Date;
  primerCoro: Types.ObjectId[];
  segundoCoro: Types.ObjectId[];
  observaciones?: string;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

const GuardiaTurnoSchema = new Schema<IGuardiaTurno>(
  {
    vigiliaId: {
      type: Schema.Types.ObjectId,
      ref: 'Vigilia',
      required: [true, 'La vigilia es requerida'],
      index: true,
    },
    rangoHora: {
      type: String,
      required: [true, 'El rango de hora es requerido'],
      trim: true,
    },
    horarioEspecifico: {
      type: String,
      required: [true, 'El horario específico es requerido'],
      trim: true,
      match: [
        /^\d{1,2}:\d{2}-\d{1,2}:\d{2}$/,
        'Formato de horario inválido (usar HH:MM-HH:MM)',
      ],
    },
    horaInicio: {
      type: Date,
      required: [true, 'La hora de inicio es requerida'],
    },
    horaFin: {
      type: Date,
      required: [true, 'La hora de fin es requerida'],
    },
    primerCoro: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Socio',
      },
    ],
    segundoCoro: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Socio',
      },
    ],
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
GuardiaTurnoSchema.index({ vigiliaId: 1, horaInicio: 1 });
GuardiaTurnoSchema.index({ vigiliaId: 1, rangoHora: 1 });

// Virtual para calcular duración del turno en minutos
GuardiaTurnoSchema.virtual('duracionMinutos').get(function () {
  if (this.horaInicio && this.horaFin) {
    return (this.horaFin.getTime() - this.horaInicio.getTime()) / (1000 * 60);
  }
  return 0;
});

// Virtual para obtener todos los socios asignados
GuardiaTurnoSchema.virtual('todosLosSocios').get(function () {
  return [...this.primerCoro, ...this.segundoCoro];
});

const GuardiaTurno: Model<IGuardiaTurno> =
  mongoose.models.GuardiaTurno ||
  mongoose.model<IGuardiaTurno>('GuardiaTurno', GuardiaTurnoSchema);

export default GuardiaTurno;
