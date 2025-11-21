import mongoose, { Schema, Document, Model, Types } from 'mongoose';

/**
 * Member (Socio)
 * Represents static information about members of the Adoración Nocturna section.
 * This is the core member registry with personal and status information.
 */

export interface IDireccion {
  calle?: string;
  colonia?: string;
  municipio?: string;
}

export interface IMember extends Document {
  nombre: string;
  tipo: 'ACTIVO' | 'ASPIRANTE' | 'HONORARIO' | 'VETERANO';
  direccion?: IDireccion;
  fechaIngreso: Date;
  estado: 'ALTA' | 'BAJA' | 'LICENCIA' | 'PRUEBA';
  seccionId?: Types.ObjectId; // Optional reference to Seccion
  telefono?: string;
  email?: string;
  presentadoPor?: string;
  notas?: string;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

const DireccionSchema = new Schema<IDireccion>(
  {
    calle: {
      type: String,
      trim: true,
    },
    colonia: {
      type: String,
      trim: true,
    },
    municipio: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const MemberSchema = new Schema<IMember>(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es requerido'],
      trim: true,
      index: true,
    },
    tipo: {
      type: String,
      enum: {
        values: ['ACTIVO', 'ASPIRANTE', 'HONORARIO', 'VETERANO'],
        message: '{VALUE} no es un tipo válido',
      },
      default: 'ACTIVO',
      index: true,
    },
    direccion: {
      type: DireccionSchema,
    },
    fechaIngreso: {
      type: Date,
      default: Date.now,
    },
    estado: {
      type: String,
      enum: {
        values: ['ALTA', 'BAJA', 'LICENCIA', 'PRUEBA'],
        message: '{VALUE} no es un estado válido',
      },
      default: 'ALTA',
      index: true,
    },
    seccionId: {
      type: Schema.Types.ObjectId,
      ref: 'Seccion',
      index: true,
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
    presentadoPor: {
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

// Indexes for common queries
MemberSchema.index({ nombre: 1, estado: 1 });
MemberSchema.index({ seccionId: 1, tipo: 1 });
MemberSchema.index({ email: 1 }, { sparse: true });

// Virtual to get complete address as string
MemberSchema.virtual('direccionCompleta').get(function () {
  if (!this.direccion) return '';
  const parts = [
    this.direccion.calle,
    this.direccion.colonia,
    this.direccion.municipio,
  ].filter(Boolean);
  return parts.join(', ');
});

const Member: Model<IMember> =
  mongoose.models.Member || mongoose.model<IMember>('Member', MemberSchema);

export default Member;
