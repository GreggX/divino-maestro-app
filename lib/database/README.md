# Database Schema Documentation

This document provides an overview of the MongoDB schemas for the Divino Maestro App.

## Overview

The application uses MongoDB with Mongoose ODM to manage data for the Adoración Nocturna vigils.

## Schema Structure

### Authentication Schemas

#### User
- **Collection**: `users`
- **Purpose**: Stores user account information
- **Fields**:
  - `name`: User's full name
  - `email`: Unique email address
  - `emailVerified`: Email verification status
  - `image`: Optional profile image URL
  - `createdAt`, `updatedAt`: Timestamps

#### Session
- **Collection**: `sessions`
- **Purpose**: Manages user sessions
- **Fields**:
  - `userId`: Reference to User
  - `expiresAt`: Session expiration date (TTL index)
  - `token`: Unique session token
  - `ipAddress`, `userAgent`: Session metadata
  - `createdAt`, `updatedAt`: Timestamps

#### Account
- **Collection**: `accounts`
- **Purpose**: Stores authentication provider details
- **Fields**:
  - `userId`: Reference to User
  - `accountId`: Provider-specific account ID
  - `providerId`: Authentication provider identifier
  - `accessToken`, `refreshToken`, `idToken`: OAuth tokens
  - `password`: Hashed password (for email/password auth)
  - `createdAt`, `updatedAt`: Timestamps

#### Verification
- **Collection**: `verifications`
- **Purpose**: Email verification tokens
- **Fields**:
  - `identifier`: Email or user identifier
  - `value`: Verification token
  - `expiresAt`: Token expiration (TTL index)
  - `createdAt`, `updatedAt`: Timestamps

---

### Application Schemas

#### Seccion
- **Collection**: `seccions`
- **Purpose**: Represents a section/parish of Adoración Nocturna
- **Fields**:
  - `nombre`: Section name
  - `parroquia`: Parish name
  - `turnoNumero`: Turn number
  - `titular`: Patron saint or titular
  - `activa`: Active status
  - `fechaCreacion`, `fechaActualizacion`: Timestamps

#### Socio
- **Collection**: `socios`
- **Purpose**: Members and aspirants of the section
- **Fields**:
  - `nombreCompleto`: Full name
  - `seccionId`: Reference to Seccion
  - `tipo`: Member type ('socio', 'aspirante', 'primera')
  - `claseAdorador`: Member class ('aspirante', 'prueba', 'activo', 'honorario', 'baja', 'inactivo')
  - `ordenVigilia`: Order number in vigil
  - `telefono`, `email`, `direccion`, `domicilio`: Contact information
  - `fechaIngreso`: Admission date
  - `fechaPrueba`: Trial period start date
  - `fechaActivacion`: Activation as full member date
  - `activo`: Active status
  - `presentadoPor`: Name of member who presented them
  - `distintivos`: Array of distinctions/awards
  - `historialEstados`: Array of status transitions
  - `notas`: Additional notes
  - `fechaCreacion`, `fechaActualizacion`: Timestamps
- **Virtuals**:
  - `domicilioCompleto`: Returns domicilio or direccion

#### Vigilia
- **Collection**: `vigilias`
- **Purpose**: Represents a monthly vigil event
- **Fields**:
  - `seccionId`: Reference to Seccion
  - `fecha`: Vigil date
  - `fechaInicio`, `fechaFin`: Start and end times
  - `turnoNumero`: Turn number
  - `titular`: Patron saint
  - `capellan`, `jefe`: Chaplain and chief
  - `portaHachas`: Array of torch bearers
  - `ayudaronMisa`: Array of mass helpers
  - `observaciones`: Notes
  - `estado`: Status ('programada', 'en_curso', 'finalizada', 'cancelada')
  - `fechaCreacion`, `fechaActualizacion`: Timestamps
- **Virtuals**:
  - `duracionHoras`: Calculated duration in hours

#### Asistencia
- **Collection**: `asistencias`
- **Purpose**: Tracks member attendance at vigils
- **Fields**:
  - `vigiliaId`: Reference to Vigilia
  - `socioId`: Reference to Socio
  - `efectiva`: Attendance confirmed (boolean)
  - `ordenLlegada`: Arrival order
  - `horaLlegada`, `horaSalida`: Arrival and departure times
  - `observaciones`: Notes
  - `fechaCreacion`, `fechaActualizacion`: Timestamps
- **Virtuals**:
  - `tiempoPermanciaHoras`: Calculated stay duration
- **Unique Index**: `vigiliaId + socioId`

#### Cuota
- **Collection**: `cuotas`
- **Purpose**: Tracks fee payments and debts
- **Fields**:
  - `socioId`: Reference to Socio
  - `vigiliaId`: Optional reference to Vigilia
  - `monto`: Amount
  - `tipo`: Type ('pago' or 'adeudo')
  - `concepto`: Payment concept
  - `fechaPago`: Payment date
  - `metodoPago`: Payment method ('efectivo', 'transferencia', 'otro')
  - `referencia`: Payment reference
  - `notas`: Additional notes
  - `fechaCreacion`, `fechaActualizacion`: Timestamps

#### GuardiaTurno
- **Collection**: `guardiarturnos`
- **Purpose**: Guard shift assignments during vigils
- **Fields**:
  - `vigiliaId`: Reference to Vigilia
  - `rangoHora`: Hour range (e.g., "De 10 a 11")
  - `horarioEspecifico`: Specific time slot (e.g., "10:45-11:00")
  - `horaInicio`, `horaFin`: Start and end times
  - `primerCoro`: Array of Socio references (first choir)
  - `segundoCoro`: Array of Socio references (second choir)
  - `observaciones`: Notes
  - `fechaCreacion`, `fechaActualizacion`: Timestamps
- **Virtuals**:
  - `duracionMinutos`: Calculated duration in minutes
  - `todosLosSocios`: Combined array of all assigned members

#### ActaJunta
- **Collection**: `actajuntas`
- **Purpose**: Represents complete minutes of a Turn Board Meeting
- **Fields**:
  - `seccionId`: Reference to Seccion
  - `vigiliaId`: Optional reference to Vigilia
  - `fecha`: Meeting date
  - `lugar`: Meeting location
  - `referenciaParte`: Reference number (unique)
  - `junta`: Meeting details (subdocument)
    - `inicioHora`: Start time
    - `leyoOrdenGeneral`: Whether general order was read
    - `inscripcionHora`, `servicioHora`, `misaHora`: Event times
  - `asistencia`: Attendance summary (subdocument)
    - `activos`, `prueba`, `comuniones`, `aspirantes`, `extraordinaria`: Counts
  - `asistenciaExtraordinariaDetalle`: Array of extraordinary attendees
  - `lecturas`: Readings (subdocument)
    - `circulares`, `correspondencia`: Boolean flags
  - `movimientosMiembros`: Member movements (subdocument)
    - `vigiliaPrueba`: New members on trial
    - `solicitudesActivos`: Applications for active membership
    - `solicitudesHonorarios`: Applications for honorary membership
    - `cambiosDomicilio`: Address changes
    - `propuestasBaja`: Proposals for removal
    - `propuestasDistintivos`: Proposals for distinctions
  - `colecta`: Collection details (subdocument)
    - `recibosMes`, `cuotasAdeudos`, `semillas`, `honorarios`: Amounts
    - `otros`: Array of other concepts
    - `sumaTotal`: Total sum
  - `cuotasHonorariosDetalle`: Array of specific fee payments
  - `otrosAsuntos`: Other matters (text)
  - `firmas`: Signatures (subdocument)
    - `jefeDeTurno`, `secretario`, `tesorero`: Signature names
  - `creadoEn`, `fechaActualizacion`: Timestamps
- **Virtuals**:
  - `totalAsistencia`: Calculated total attendance
  - `colectaCalculada`: Calculated collection total for validation

## Relationships

```
Seccion (1) -> (n) Socio
Seccion (1) -> (n) Vigilia
Seccion (1) -> (n) ActaJunta

Vigilia (1) -> (n) Asistencia
Vigilia (1) -> (n) GuardiaTurno
Vigilia (1) -> (n) Cuota (optional)
Vigilia (1) -> (1) ActaJunta (optional)

ActaJunta (1) -> (1) Vigilia (optional)
ActaJunta (1) -> (1) Seccion

Socio (1) -> (n) Asistencia
Socio (1) -> (n) Cuota
Socio (n) <-> (n) GuardiaTurno (through primerCoro/segundoCoro arrays)

User (1) -> (n) Session
User (1) -> (n) Account
```

## Indexes

All schemas include appropriate indexes for:
- Foreign key references
- Frequently queried fields
- Unique constraints
- TTL (Time To Live) for sessions and verifications

## Usage Examples

### Creating a Vigilia with ActaJunta

```typescript
import { Vigilia, ActaJunta, Socio, Asistencia, GuardiaTurno } from '@/lib/database/models';

// Create a new vigilia
const vigilia = await Vigilia.create({
  seccionId: seccionId,
  fecha: new Date('2025-11-15'),
  fechaInicio: new Date('2025-11-15T22:00:00'),
  fechaFin: new Date('2025-11-16T05:30:00'),
  turnoNumero: 1,
  titular: 'Santísimo Sacramento',
  estado: 'programada'
});

// Create the ActaJunta (meeting minutes)
const acta = await ActaJunta.create({
  seccionId: seccionId,
  vigiliaId: vigilia._id,
  fecha: new Date('2025-11-16'),
  lugar: 'Parroquia de San Miguel, Salón 2',
  referenciaParte: 'Parte No. 45/2025',
  junta: {
    inicioHora: '09:00 PM',
    leyoOrdenGeneral: true,
    inscripcionHora: '09:15 PM',
    servicioHora: '10:00 PM',
    misaHora: '07:00 AM'
  },
  asistencia: {
    activos: 25,
    prueba: 3,
    comuniones: 28,
    aspirantes: 2,
    extraordinaria: 5
  },
  lecturas: {
    circulares: true,
    correspondencia: false
  },
  movimientosMiembros: {
    vigiliaPrueba: [
      {
        nombre: 'Carlos Mendoza Ruiz',
        domicilio: 'Calle Sol 123',
        presentadoPor: 'Miguel Ríos Bravo'
      }
    ],
    solicitudesActivos: [],
    solicitudesHonorarios: [],
    cambiosDomicilio: [],
    propuestasBaja: [],
    propuestasDistintivos: []
  },
  colecta: {
    recibosMes: 1500.50,
    cuotasAdeudos: 850.00,
    semillas: 300.00,
    honorarios: 450.00,
    otros: [],
    sumaTotal: 3100.50
  },
  cuotasHonorariosDetalle: [],
  firmas: {
    jefeDeTurno: 'Firma de Alvaro González G.',
    secretario: 'Firma de Antonio Bravo A.',
    tesorero: 'Firma de Gabriel Real R.'
  }
});

// Record attendance
const asistencia = await Asistencia.create({
  vigiliaId: vigilia._id,
  socioId: socioId,
  efectiva: true,
  ordenLlegada: 1,
  horaLlegada: new Date()
});

// Create guard shifts
const turno = await GuardiaTurno.create({
  vigiliaId: vigilia._id,
  rangoHora: 'De 10 a 11',
  horarioEspecifico: '10:45-11:00',
  horaInicio: new Date('2025-11-15T22:45:00'),
  horaFin: new Date('2025-11-15T23:00:00'),
  primerCoro: [socioId1, socioId2],
  segundoCoro: []
});
```

### Managing Member Status Transitions

```typescript
import { Socio } from '@/lib/database/models';

// Create a new aspirant
const nuevoSocio = await Socio.create({
  nombreCompleto: 'Juan Pérez López',
  seccionId: seccionId,
  tipo: 'aspirante',
  claseAdorador: 'aspirante',
  domicilio: 'Calle Principal 123',
  presentadoPor: 'Miguel Ríos Bravo',
  fechaIngreso: new Date()
});

// Promote to prueba (trial)
nuevoSocio.claseAdorador = 'prueba';
nuevoSocio.fechaPrueba = new Date();
nuevoSocio.historialEstados = nuevoSocio.historialEstados || [];
nuevoSocio.historialEstados.push({
  estadoAnterior: 'aspirante',
  estadoNuevo: 'prueba',
  fecha: new Date(),
  motivo: 'Completó período de aspirante',
  autorizadoPor: 'Jefe de Turno'
});
await nuevoSocio.save();

// Activate as full member
nuevoSocio.claseAdorador = 'activo';
nuevoSocio.fechaActivacion = new Date();
nuevoSocio.historialEstados.push({
  estadoAnterior: 'prueba',
  estadoNuevo: 'activo',
  fecha: new Date(),
  motivo: 'Aprobado por la junta',
  autorizadoPor: 'Jefe de Turno'
});
await nuevoSocio.save();
```

## Notes

- All date fields use JavaScript Date objects
- Monetary amounts (cuotas) are stored as Numbers
- Spanish field names are used to match domain terminology
- TTL indexes automatically delete expired sessions and verifications
- Virtual fields are computed but not stored in the database
