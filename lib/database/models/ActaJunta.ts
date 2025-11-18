import mongoose, { Schema, Document, Model, Types } from 'mongoose';

/**
 * ActaJunta (Meeting Minutes)
 * Represents the complete minutes of a Turn Board Meeting
 */

// Subdocument Interfaces
export interface IJuntaDetalle {
  inicioHora: string;
  leyoOrdenGeneral: boolean;
  inscripcionHora: string;
  servicioHora: string;
  misaHora: string;
}

export interface IAsistenciaResumen {
  activos: number;
  prueba: number;
  comuniones: number;
  aspirantes: number;
  extraordinaria: number;
}

export interface IAsistenciaExtraordinaria {
  _id?: Types.ObjectId;
  seccionOTurno: string;
  autorizacion: string;
}

export interface ILecturas {
  circulares: boolean;
  correspondencia: boolean;
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
  claseAdorador: string;
  nombre: string;
  nuevoDomicilio: string;
}

export interface IPropuestaBaja {
  _id?: Types.ObjectId;
  claseAdorador: string;
  nombre: string;
  causa: string;
}

export interface IPropuestaDistintivo {
  _id?: Types.ObjectId;
  claseAdorador: string;
  nombre: string;
  domicilio: string;
}

export interface IMovimientosMiembros {
  vigiliaPrueba: IVigiliaPrueba[];
  solicitudesActivos: ISolicitudMiembro[];
  solicitudesHonorarios: ISolicitudMiembro[];
  cambiosDomicilio: ICambioDomicilio[];
  propuestasBaja: IPropuestaBaja[];
  propuestasDistintivos: IPropuestaDistintivo[];
}

export interface IOtroConcepto {
  concepto: string;
  monto: number;
}

export interface IColecta {
  recibosMes: number;
  cuotasAdeudos: number;
  semillas: number;
  honorarios: number;
  otros: IOtroConcepto[];
  sumaTotal: number;
}

export interface ICuotaHonorarioDetalle {
  _id?: Types.ObjectId;
  nombre: string;
  concepto: string;
  monto: number;
}

export interface IFirmas {
  jefeDeTurno: string;
  secretario: string;
  tesorero: string;
}

// Main Document Interface
export interface IActaJunta extends Document {
  seccionId: Types.ObjectId;
  vigiliaId?: Types.ObjectId;
  fecha: Date;
  lugar: string;
  referenciaParte: string;
  junta: IJuntaDetalle;
  asistencia: IAsistenciaResumen;
  asistenciaExtraordinariaDetalle: IAsistenciaExtraordinaria[];
  lecturas: ILecturas;
  movimientosMiembros: IMovimientosMiembros;
  colecta: IColecta;
  cuotasHonorariosDetalle: ICuotaHonorarioDetalle[];
  otrosAsuntos?: string;
  firmas: IFirmas;
  creadoEn: Date;
  fechaActualizacion: Date;
}

// Subdocument Schemas
const JuntaDetalleSchema = new Schema<IJuntaDetalle>(
  {
    inicioHora: {
      type: String,
      required: [true, 'La hora de inicio es requerida'],
      trim: true,
    },
    leyoOrdenGeneral: {
      type: Boolean,
      default: false,
    },
    inscripcionHora: {
      type: String,
      required: [true, 'La hora de inscripción es requerida'],
      trim: true,
    },
    servicioHora: {
      type: String,
      required: [true, 'La hora del servicio es requerida'],
      trim: true,
    },
    misaHora: {
      type: String,
      required: [true, 'La hora de la misa es requerida'],
      trim: true,
    },
  },
  { _id: false }
);

const AsistenciaResumenSchema = new Schema<IAsistenciaResumen>(
  {
    activos: {
      type: Number,
      required: true,
      min: [0, 'No puede ser negativo'],
      default: 0,
    },
    prueba: {
      type: Number,
      required: true,
      min: [0, 'No puede ser negativo'],
      default: 0,
    },
    comuniones: {
      type: Number,
      required: true,
      min: [0, 'No puede ser negativo'],
      default: 0,
    },
    aspirantes: {
      type: Number,
      required: true,
      min: [0, 'No puede ser negativo'],
      default: 0,
    },
    extraordinaria: {
      type: Number,
      required: true,
      min: [0, 'No puede ser negativo'],
      default: 0,
    },
  },
  { _id: false }
);

const AsistenciaExtraordinariaSchema = new Schema<IAsistenciaExtraordinaria>({
  seccionOTurno: {
    type: String,
    required: [true, 'La sección o turno es requerido'],
    trim: true,
  },
  autorizacion: {
    type: String,
    required: [true, 'La autorización es requerida'],
    trim: true,
  },
});

const LecturasSchema = new Schema<ILecturas>(
  {
    circulares: {
      type: Boolean,
      default: false,
    },
    correspondencia: {
      type: Boolean,
      default: false,
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
  claseAdorador: {
    type: String,
    required: [true, 'La clase de adorador es requerida'],
    trim: true,
  },
  nombre: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true,
  },
  nuevoDomicilio: {
    type: String,
    required: [true, 'El nuevo domicilio es requerido'],
    trim: true,
  },
});

const PropuestaBajaSchema = new Schema<IPropuestaBaja>({
  claseAdorador: {
    type: String,
    required: [true, 'La clase de adorador es requerida'],
    trim: true,
  },
  nombre: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true,
  },
  causa: {
    type: String,
    required: [true, 'La causa es requerida'],
    trim: true,
  },
});

const PropuestaDistintivoSchema = new Schema<IPropuestaDistintivo>({
  claseAdorador: {
    type: String,
    required: [true, 'La clase de adorador es requerida'],
    trim: true,
  },
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

const MovimientosMiembrosSchema = new Schema<IMovimientosMiembros>(
  {
    vigiliaPrueba: [VigiliaPruebaSchema],
    solicitudesActivos: [SolicitudMiembroSchema],
    solicitudesHonorarios: [SolicitudMiembroSchema],
    cambiosDomicilio: [CambioDomicilioSchema],
    propuestasBaja: [PropuestaBajaSchema],
    propuestasDistintivos: [PropuestaDistintivoSchema],
  },
  { _id: false }
);

const OtroConceptoSchema = new Schema<IOtroConcepto>(
  {
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
  },
  { _id: false }
);

const ColectaSchema = new Schema<IColecta>(
  {
    recibosMes: {
      type: Number,
      required: true,
      min: [0, 'No puede ser negativo'],
      default: 0,
    },
    cuotasAdeudos: {
      type: Number,
      required: true,
      min: [0, 'No puede ser negativo'],
      default: 0,
    },
    semillas: {
      type: Number,
      required: true,
      min: [0, 'No puede ser negativo'],
      default: 0,
    },
    honorarios: {
      type: Number,
      required: true,
      min: [0, 'No puede ser negativo'],
      default: 0,
    },
    otros: [OtroConceptoSchema],
    sumaTotal: {
      type: Number,
      required: true,
      min: [0, 'No puede ser negativo'],
      default: 0,
    },
  },
  { _id: false }
);

const CuotaHonorarioDetalleSchema = new Schema<ICuotaHonorarioDetalle>({
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
    jefeDeTurno: {
      type: String,
      required: [true, 'La firma del jefe de turno es requerida'],
      trim: true,
    },
    secretario: {
      type: String,
      required: [true, 'La firma del secretario es requerida'],
      trim: true,
    },
    tesorero: {
      type: String,
      required: [true, 'La firma del tesorero es requerida'],
      trim: true,
    },
  },
  { _id: false }
);

// Main Schema
const ActaJuntaSchema = new Schema<IActaJunta>(
  {
    seccionId: {
      type: Schema.Types.ObjectId,
      ref: 'Seccion',
      required: [true, 'La sección es requerida'],
      index: true,
    },
    vigiliaId: {
      type: Schema.Types.ObjectId,
      ref: 'Vigilia',
      index: true,
    },
    fecha: {
      type: Date,
      required: [true, 'La fecha es requerida'],
      index: true,
    },
    lugar: {
      type: String,
      required: [true, 'El lugar es requerido'],
      trim: true,
    },
    referenciaParte: {
      type: String,
      required: [true, 'La referencia del parte es requerida'],
      trim: true,
      unique: true,
    },
    junta: {
      type: JuntaDetalleSchema,
      required: true,
    },
    asistencia: {
      type: AsistenciaResumenSchema,
      required: true,
    },
    asistenciaExtraordinariaDetalle: [AsistenciaExtraordinariaSchema],
    lecturas: {
      type: LecturasSchema,
      required: true,
    },
    movimientosMiembros: {
      type: MovimientosMiembrosSchema,
      required: true,
    },
    colecta: {
      type: ColectaSchema,
      required: true,
    },
    cuotasHonorariosDetalle: [CuotaHonorarioDetalleSchema],
    otrosAsuntos: {
      type: String,
      trim: true,
    },
    firmas: {
      type: FirmasSchema,
      required: true,
    },
    creadoEn: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: {
      createdAt: 'creadoEn',
      updatedAt: 'fechaActualizacion',
    },
  }
);

// Indexes
ActaJuntaSchema.index({ seccionId: 1, fecha: -1 });
ActaJuntaSchema.index({ referenciaParte: 1 }, { unique: true });
ActaJuntaSchema.index({ vigiliaId: 1 });

// Virtual to calculate total attendance
ActaJuntaSchema.virtual('totalAsistencia').get(function () {
  return (
    this.asistencia.activos +
    this.asistencia.prueba +
    this.asistencia.aspirantes
  );
});

// Virtual to validate suma total in colecta
ActaJuntaSchema.virtual('colectaCalculada').get(function () {
  const otrosTotal = this.colecta.otros.reduce(
    (sum, item) => sum + item.monto,
    0
  );
  return (
    this.colecta.recibosMes +
    this.colecta.cuotasAdeudos +
    this.colecta.semillas +
    this.colecta.honorarios +
    otrosTotal
  );
});

const ActaJunta: Model<IActaJunta> =
  mongoose.models.ActaJunta ||
  mongoose.model<IActaJunta>('ActaJunta', ActaJuntaSchema);

export default ActaJunta;
