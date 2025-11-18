import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Seccion (Section/Parish)
 * Represents a section or parish of the Adoración Nocturna
 */
export interface ISeccion extends Document {
  nombre: string;
  parroquia: string;
  turnoNumero: number;
  titular: string;
  activa: boolean;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

const SeccionSchema = new Schema<ISeccion>(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre de la sección es requerido'],
      trim: true,
    },
    parroquia: {
      type: String,
      required: [true, 'El nombre de la parroquia es requerido'],
      trim: true,
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
    activa: {
      type: Boolean,
      default: true,
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
SeccionSchema.index({ nombre: 1, parroquia: 1 });

const Seccion: Model<ISeccion> =
  mongoose.models.Seccion || mongoose.model<ISeccion>('Seccion', SeccionSchema);

export default Seccion;
