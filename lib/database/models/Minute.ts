import mongoose, { Schema, Document, Model, Types } from 'mongoose';

/**
 * Minute (Acta Administrativa)
 * Represents the formal administrative minutes of the Turn Board Meeting.
 * This is the official record generated after the vigil is completed.
 */

// Subdocument Interfaces
export interface IHorarios {
  inicioJunta: string;
  lecturaOrden: boolean;
  manifiesto: string;
  reservado: string;
  misa: string;
}

export interface ILecturas {
  circulares?: string;
  correspondencia?: string;
}

export interface IVigiliaPrueba {
  _id?: Types.ObjectId;
  nombre: string;
  domicilio: string;
  presentadoPor: string;
}

export interface ISolicitudMiembro {
  _id?: Types.ObjectId;
  nombre: string;
  domicilio: string;
}

export interface ICambioDomicilio {
  _id?: Types.ObjectId;
  miembro?: Types.ObjectId; // Optional reference to Member
  nuevoDomicilio: string;
}

export interface IBaja {
  _id?: Types.ObjectId;
  miembro?: Types.ObjectId; // Optional reference to Member
  causa: string;
}

export interface IDistintivo {
  _id?: Types.ObjectId;
  miembro?: Types.ObjectId; // Optional reference to Member
  fechaSolicitud: Date;
}

export interface IMovimientos {
  vigiliaPrueba: IVigiliaPrueba[];
  solicitudesActivos: ISolicitudMiembro[];
  solicitudesHonorarios: ISolicitudMiembro[];
  cambiosDomicilio: ICambioDomicilio[];
  bajas: IBaja[];
  distintivos: IDistintivo[];
}

export interface IAsistenciaExtraordinariaDetalle {
  _id?: Types.ObjectId;
  nombre: string;
  seccionTurno: string;
  autorizacion: string;
}

export interface IEstadisticasAsistencia {
  activos: number;
  prueba: number;
  comuniones: number;
  aspirantes: number;
  extraordinaria: number;
  detalleExtraordinaria: IAsistenciaExtraordinariaDetalle[];
}

export interface IOtroConcepto {
  _id?: Types.ObjectId;
  concepto: string;
  monto: number;
}

export interface IFinanzasResumen {
  recibosMes: number;
  recibosAtrasados: number;
  semillas: number;
  honorarios: number;
  otrosConceptos: IOtroConcepto[];
  sumaTotal: number;
}

export interface IDetalleHonorario {
  _id?: Types.ObjectId;
  nombre: string;
  concepto: string;
  monto: number;
}

export interface IFirmas {
  jefeTurno?: Types.ObjectId; // Reference to Member
  secretario?: Types.ObjectId; // Reference to Member
  tesorero?: Types.ObjectId; // Reference to Member
}

// Main Document Interface
export interface IMinute extends Document {
  vigiliaId: Types.ObjectId; // Reference to Vigil (required)
  horarios: IHorarios;
  lecturas: ILecturas;
  movimientos: IMovimientos;
  otrosAsuntos?: string;
  estadisticasAsistencia: IEstadisticasAsistencia;
  finanzasResumen: IFinanzasResumen;
  detalleHonorarios: IDetalleHonorario[];
  firmas: IFirmas;
  seccionId?: Types.ObjectId; // Optional reference to Seccion
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

// Subdocument Schemas
const HorariosSchema = new Schema<IHorarios>(
  {
    inicioJunta: {
      type: String,
      required: [true, 'La hora de inicio es requerida'],
      trim: true,
    },
    lecturaOrden: {
      type: Boolean,
      default: false,
    },
    manifiesto: {
      type: String,
      trim: true,
    },
    reservado: {
      type: String,
      trim: true,
    },
    misa: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const LecturasSchema = new Schema<ILecturas>(
  {
    circulares: {
      type: String,
      trim: true,
    },
    correspondencia: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const VigiliaPruebaSchema = new Schema<IVigiliaPrueba>({
  nombre: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true,
  },
  domicilio: {
    type: String,
    required: [true, 'El domicilio es requerido'],
    trim: true,
  },
  presentadoPor: {
    type: String,
    required: [true, 'Presentado por es requerido'],
    trim: true,
  },
});

const SolicitudMiembroSchema = new Schema<ISolicitudMiembro>({
  nombre: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true,
  },
  domicilio: {
    type: String,
    required: [true, 'El domicilio es requerido'],
    trim: true,
  },
});

const CambioDomicilioSchema = new Schema<ICambioDomicilio>({
  miembro: {
    type: Schema.Types.ObjectId,
    ref: 'Member',
  },
  nuevoDomicilio: {
    type: String,
    required: [true, 'El nuevo domicilio es requerido'],
    trim: true,
  },
});

const BajaSchema = new Schema<IBaja>({
  miembro: {
    type: Schema.Types.ObjectId,
    ref: 'Member',
  },
  causa: {
    type: String,
    required: [true, 'La causa es requerida'],
    trim: true,
  },
});

const DistintivoSchema = new Schema<IDistintivo>({
  miembro: {
    type: Schema.Types.ObjectId,
    ref: 'Member',
  },
  fechaSolicitud: {
    type: Date,
    default: Date.now,
  },
});

const MovimientosSchema = new Schema<IMovimientos>(
  {
    vigiliaPrueba: [VigiliaPruebaSchema],
    solicitudesActivos: [SolicitudMiembroSchema],
    solicitudesHonorarios: [SolicitudMiembroSchema],
    cambiosDomicilio: [CambioDomicilioSchema],
    bajas: [BajaSchema],
    distintivos: [DistintivoSchema],
  },
  { _id: false }
);

const AsistenciaExtraordinariaDetalleSchema =
  new Schema<IAsistenciaExtraordinariaDetalle>({
    nombre: {
      type: String,
      required: [true, 'El nombre es requerido'],
      trim: true,
    },
    seccionTurno: {
      type: String,
      required: [true, 'La sección/turno es requerida'],
      trim: true,
    },
    autorizacion: {
      type: String,
      required: [true, 'La autorización es requerida'],
      trim: true,
    },
  });

const EstadisticasAsistenciaSchema = new Schema<IEstadisticasAsistencia>(
  {
    activos: {
      type: Number,
      default: 0,
      min: [0, 'No puede ser negativo'],
    },
    prueba: {
      type: Number,
      default: 0,
      min: [0, 'No puede ser negativo'],
    },
    comuniones: {
      type: Number,
      default: 0,
      min: [0, 'No puede ser negativo'],
    },
    aspirantes: {
      type: Number,
      default: 0,
      min: [0, 'No puede ser negativo'],
    },
    extraordinaria: {
      type: Number,
      default: 0,
      min: [0, 'No puede ser negativo'],
    },
    detalleExtraordinaria: [AsistenciaExtraordinariaDetalleSchema],
  },
  { _id: false }
);

const OtroConceptoSchema = new Schema<IOtroConcepto>({
  concepto: {
    type: String,
    required: [true, 'El concepto es requerido'],
    trim: true,
  },
  monto: {
    type: Number,
    required: [true, 'El monto es requerido'],
    min: [0, 'El monto no puede ser negativo'],
  },
});

const FinanzasResumenSchema = new Schema<IFinanzasResumen>(
  {
    recibosMes: {
      type: Number,
      default: 0,
      min: [0, 'No puede ser negativo'],
    },
    recibosAtrasados: {
      type: Number,
      default: 0,
      min: [0, 'No puede ser negativo'],
    },
    semillas: {
      type: Number,
      default: 0,
      min: [0, 'No puede ser negativo'],
    },
    honorarios: {
      type: Number,
      default: 0,
      min: [0, 'No puede ser negativo'],
    },
    otrosConceptos: [OtroConceptoSchema],
    sumaTotal: {
      type: Number,
      default: 0,
      min: [0, 'No puede ser negativo'],
    },
  },
  { _id: false }
);

const DetalleHonorarioSchema = new Schema<IDetalleHonorario>({
  nombre: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true,
  },
  concepto: {
    type: String,
    required: [true, 'El concepto es requerido'],
    trim: true,
  },
  monto: {
    type: Number,
    required: [true, 'El monto es requerido'],
    min: [0, 'El monto no puede ser negativo'],
  },
});

const FirmasSchema = new Schema<IFirmas>(
  {
    jefeTurno: {
      type: Schema.Types.ObjectId,
      ref: 'Member',
    },
    secretario: {
      type: Schema.Types.ObjectId,
      ref: 'Member',
    },
    tesorero: {
      type: Schema.Types.ObjectId,
      ref: 'Member',
    },
  },
  { _id: false }
);

// Main Schema
const MinuteSchema = new Schema<IMinute>(
  {
    vigiliaId: {
      type: Schema.Types.ObjectId,
      ref: 'Vigil',
      required: [true, 'La vigilia es requerida'],
      index: true,
      unique: true, // One-to-one relationship
    },
    horarios: {
      type: HorariosSchema,
      required: true,
    },
    lecturas: {
      type: LecturasSchema,
      default: () => ({}),
    },
    movimientos: {
      type: MovimientosSchema,
      default: () => ({
        vigiliaPrueba: [],
        solicitudesActivos: [],
        solicitudesHonorarios: [],
        cambiosDomicilio: [],
        bajas: [],
        distintivos: [],
      }),
    },
    otrosAsuntos: {
      type: String,
      trim: true,
    },
    estadisticasAsistencia: {
      type: EstadisticasAsistenciaSchema,
      default: () => ({
        activos: 0,
        prueba: 0,
        comuniones: 0,
        aspirantes: 0,
        extraordinaria: 0,
        detalleExtraordinaria: [],
      }),
    },
    finanzasResumen: {
      type: FinanzasResumenSchema,
      default: () => ({
        recibosMes: 0,
        recibosAtrasados: 0,
        semillas: 0,
        honorarios: 0,
        otrosConceptos: [],
        sumaTotal: 0,
      }),
    },
    detalleHonorarios: [DetalleHonorarioSchema],
    firmas: {
      type: FirmasSchema,
      default: () => ({}),
    },
    seccionId: {
      type: Schema.Types.ObjectId,
      ref: 'Seccion',
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
MinuteSchema.index({ vigiliaId: 1 }, { unique: true });
MinuteSchema.index({ seccionId: 1, fechaCreacion: -1 });

// Virtual to calculate total attendance
MinuteSchema.virtual('totalAsistencia').get(function () {
  return (
    this.estadisticasAsistencia.activos +
    this.estadisticasAsistencia.prueba +
    this.estadisticasAsistencia.aspirantes
  );
});

// Virtual to validate suma total in finanzas
MinuteSchema.virtual('finanzasCalculadas').get(function () {
  const otrosTotal = this.finanzasResumen.otrosConceptos.reduce(
    (sum, item) => sum + item.monto,
    0
  );
  return (
    this.finanzasResumen.recibosMes +
    this.finanzasResumen.recibosAtrasados +
    this.finanzasResumen.semillas +
    this.finanzasResumen.honorarios +
    otrosTotal
  );
});

const Minute: Model<IMinute> =
  mongoose.models.Minute || mongoose.model<IMinute>('Minute', MinuteSchema);

export default Minute;
