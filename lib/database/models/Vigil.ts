import mongoose, { Schema, Document, Model, Types } from 'mongoose';

/**
 * Vigil (Vigilia Operativa)
 * Represents the operational vigil with all live data: attendance, payments, and guard assignments.
 * This is the working document during the vigil event.
 */

export interface IFinanzasIndividual {
  cuotasAtrasadas: number;
  cuotasMes: number;
  donativoExtra: number;
}

export interface IAsistenciaMiembro {
  _id?: Types.ObjectId;
  miembro: Types.ObjectId; // Reference to Member
  presente: boolean;
  ordenLlegada?: number;
  finanzas: IFinanzasIndividual;
}

export interface ITurnoEspecifico {
  _id?: Types.ObjectId;
  horaInicio: string;
  horaFin: string;
  primerCoro: Types.ObjectId[]; // References to Members
  segundoCoro: Types.ObjectId[]; // References to Members
}

export interface IBloqueHora {
  _id?: Types.ObjectId;
  bloqueHora: string; // e.g., "De 10 a 11"
  turnos: ITurnoEspecifico[];
}

export interface IRolesEspeciales {
  portaHachas: Types.ObjectId[]; // References to Members
  ayudaronMisa: Types.ObjectId[]; // References to Members
}

export interface IVigil extends Document {
  numeroTurno: number;
  fechaInicio: Date;
  fechaFin: Date;
  parroquia?: string;
  titular: string;
  asistencia: IAsistenciaMiembro[];
  rolesGuardia: IBloqueHora[];
  rolesEspeciales: IRolesEspeciales;
  actaId?: Types.ObjectId; // Reference to Minute (one-to-one)
  seccionId?: Types.ObjectId; // Optional reference to Seccion
  estado: 'programada' | 'en_curso' | 'finalizada' | 'cancelada';
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

// Subdocument Schemas
const FinanzasIndividualSchema = new Schema<IFinanzasIndividual>(
  {
    cuotasAtrasadas: {
      type: Number,
      default: 0,
      min: [0, 'No puede ser negativo'],
    },
    cuotasMes: {
      type: Number,
      default: 0,
      min: [0, 'No puede ser negativo'],
    },
    donativoExtra: {
      type: Number,
      default: 0,
      min: [0, 'No puede ser negativo'],
    },
  },
  { _id: false }
);

const AsistenciaMiembroSchema = new Schema<IAsistenciaMiembro>({
  miembro: {
    type: Schema.Types.ObjectId,
    ref: 'Member',
    required: [true, 'El miembro es requerido'],
    index: true,
  },
  presente: {
    type: Boolean,
    default: false,
  },
  ordenLlegada: {
    type: Number,
    min: [1, 'El orden debe ser mayor a 0'],
  },
  finanzas: {
    type: FinanzasIndividualSchema,
    default: () => ({
      cuotasAtrasadas: 0,
      cuotasMes: 0,
      donativoExtra: 0,
    }),
  },
});

const TurnoEspecificoSchema = new Schema<ITurnoEspecifico>({
  horaInicio: {
    type: String,
    required: [true, 'La hora de inicio es requerida'],
    trim: true,
  },
  horaFin: {
    type: String,
    required: [true, 'La hora de fin es requerida'],
    trim: true,
  },
  primerCoro: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Member',
    },
  ],
  segundoCoro: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Member',
    },
  ],
});

const BloqueHoraSchema = new Schema<IBloqueHora>({
  bloqueHora: {
    type: String,
    required: [true, 'El bloque de hora es requerido'],
    trim: true,
  },
  turnos: [TurnoEspecificoSchema],
});

const RolesEspecialesSchema = new Schema<IRolesEspeciales>(
  {
    portaHachas: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Member',
      },
    ],
    ayudaronMisa: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Member',
      },
    ],
  },
  { _id: false }
);

// Main Schema
const VigilSchema = new Schema<IVigil>(
  {
    numeroTurno: {
      type: Number,
      required: [true, 'El número de turno es requerido'],
      min: [1, 'El número de turno debe ser mayor a 0'],
      index: true,
    },
    fechaInicio: {
      type: Date,
      required: [true, 'La fecha de inicio es requerida'],
      index: true,
    },
    fechaFin: {
      type: Date,
      required: [true, 'La fecha de fin es requerida'],
    },
    parroquia: {
      type: String,
      trim: true,
    },
    titular: {
      type: String,
      required: [true, 'El titular es requerido'],
      trim: true,
    },
    asistencia: [AsistenciaMiembroSchema],
    rolesGuardia: [BloqueHoraSchema],
    rolesEspeciales: {
      type: RolesEspecialesSchema,
      default: () => ({
        portaHachas: [],
        ayudaronMisa: [],
      }),
    },
    actaId: {
      type: Schema.Types.ObjectId,
      ref: 'Minute',
      index: true,
    },
    seccionId: {
      type: Schema.Types.ObjectId,
      ref: 'Seccion',
      index: true,
    },
    estado: {
      type: String,
      enum: {
        values: ['programada', 'en_curso', 'finalizada', 'cancelada'],
        message: '{VALUE} no es un estado válido',
      },
      default: 'programada',
      index: true,
    },
  },
  {
    timestamps: {
      createdAt: 'fechaCreacion',
      updatedAt: 'fechaActualizacion',
    },
  }
);

// Indexes for common queries
VigilSchema.index({ numeroTurno: 1, seccionId: 1 });
VigilSchema.index({ fechaInicio: -1 });
VigilSchema.index({ estado: 1, fechaInicio: -1 });

// Virtual to calculate total present members
VigilSchema.virtual('totalPresentes').get(function () {
  return this.asistencia.filter(a => a.presente).length;
});

// Virtual to calculate total collected this month
VigilSchema.virtual('totalCuotasMes').get(function () {
  return this.asistencia.reduce(
    (sum, a) => sum + (a.finanzas?.cuotasMes || 0),
    0
  );
});

// Virtual to calculate total overdue fees collected
VigilSchema.virtual('totalCuotasAtrasadas').get(function () {
  return this.asistencia.reduce(
    (sum, a) => sum + (a.finanzas?.cuotasAtrasadas || 0),
    0
  );
});

// Virtual to calculate total extra donations
VigilSchema.virtual('totalDonativosExtra').get(function () {
  return this.asistencia.reduce(
    (sum, a) => sum + (a.finanzas?.donativoExtra || 0),
    0
  );
});

// Virtual to calculate duration in hours
VigilSchema.virtual('duracionHoras').get(function () {
  if (this.fechaInicio && this.fechaFin) {
    return (
      (this.fechaFin.getTime() - this.fechaInicio.getTime()) / (1000 * 60 * 60)
    );
  }
  return 0;
});

const Vigil: Model<IVigil> =
  mongoose.models.Vigil || mongoose.model<IVigil>('Vigil', VigilSchema);

export default Vigil;
