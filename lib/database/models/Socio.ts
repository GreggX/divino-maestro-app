import mongoose, { Schema, Document, Model, Types } from 'mongoose';

/**
 * Socio (Member)
 * Represents a member or aspirant of the Adoración Nocturna section
 */

export interface IHistorialEstado {
  _id?: Types.ObjectId;
  estadoAnterior: string;
  estadoNuevo: string;
  fecha: Date;
  motivo?: string;
  autorizadoPor?: string;
}

export interface ISocio extends Document {
  nombreCompleto: string;
  seccionId: Types.ObjectId;
  tipo: 'socio' | 'aspirante' | 'primera';
  claseAdorador:
    | 'aspirante'
    | 'prueba'
    | 'activo'
    | 'honorario'
    | 'baja'
    | 'inactivo';
  ordenVigilia?: number;
  telefono?: string;
  email?: string;
  direccion?: string;
  domicilio?: string; // Alias for direccion (used in ActaJunta)
  fechaIngreso: Date;
  fechaPrueba?: Date;
  fechaActivacion?: Date;
  activo: boolean;
  presentadoPor?: string;
  distintivos?: string[];
  historialEstados?: IHistorialEstado[];
  notas?: string;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

const HistorialEstadoSchema = new Schema<IHistorialEstado>({
  estadoAnterior: {
    type: String,
    required: true,
    trim: true,
  },
  estadoNuevo: {
    type: String,
    required: true,
    trim: true,
  },
  fecha: {
    type: Date,
    default: Date.now,
  },
  motivo: {
    type: String,
    trim: true,
  },
  autorizadoPor: {
    type: String,
    trim: true,
  },
});

const SocioSchema = new Schema<ISocio>(
  {
    nombreCompleto: {
      type: String,
      required: [true, 'El nombre completo es requerido'],
      trim: true,
    },
    seccionId: {
      type: Schema.Types.ObjectId,
      ref: 'Seccion',
      required: [true, 'La sección es requerida'],
      index: true,
    },
    tipo: {
      type: String,
      enum: {
        values: ['socio', 'aspirante', 'primera'],
        message: '{VALUE} no es un tipo válido',
      },
      default: 'socio',
    },
    claseAdorador: {
      type: String,
      enum: {
        values: [
          'aspirante',
          'prueba',
          'activo',
          'honorario',
          'baja',
          'inactivo',
        ],
        message: '{VALUE} no es una clase válida',
      },
      default: 'aspirante',
      index: true,
    },
    ordenVigilia: {
      type: Number,
      min: [1, 'El orden de vigilia debe ser mayor a 0'],
    },
    telefono: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email no válido'],
    },
    direccion: {
      type: String,
      trim: true,
    },
    domicilio: {
      type: String,
      trim: true,
    },
    fechaIngreso: {
      type: Date,
      default: Date.now,
    },
    fechaPrueba: {
      type: Date,
    },
    fechaActivacion: {
      type: Date,
    },
    activo: {
      type: Boolean,
      default: true,
    },
    presentadoPor: {
      type: String,
      trim: true,
    },
    distintivos: [
      {
        type: String,
        trim: true,
      },
    ],
    historialEstados: [HistorialEstadoSchema],
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
SocioSchema.index({ seccionId: 1, nombreCompleto: 1 });
SocioSchema.index({ seccionId: 1, tipo: 1, activo: 1 });
SocioSchema.index({ seccionId: 1, claseAdorador: 1 });
SocioSchema.index({ email: 1 }, { sparse: true });

// Virtual to sync domicilio with direccion
SocioSchema.virtual('domicilioCompleto').get(function () {
  return this.domicilio || this.direccion || '';
});

const Socio: Model<ISocio> =
  mongoose.models.Socio || mongoose.model<ISocio>('Socio', SocioSchema);

export default Socio;
