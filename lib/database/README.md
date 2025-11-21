# Database Schema Documentation

This document provides comprehensive documentation for the MongoDB schemas used in the Divino Maestro App.

## Overview

The application uses MongoDB with Mongoose ODM to manage data for the Adoración Nocturna vigils. The database schema is designed to consolidate related data, simplify queries, and match the operational workflow.

## Collections

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

The application schemas are designed around three main concepts:
1. **Member** - Static information about members
2. **Vigil** - Operational data during the vigil event
3. **Minute** - Formal administrative records

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

#### Member
- **Collection**: `members`
- **Purpose**: Static information about members
- **Fields**:
  - `nombre`: Full name (indexed)
  - `tipo`: Member type - `ACTIVO`, `ASPIRANTE`, `HONORARIO`, `VETERANO`
  - `direccion`: Structured address object
    - `calle`: Street
    - `colonia`: Neighborhood
    - `municipio`: Municipality
  - `fechaIngreso`: Date joined
  - `estado`: Current state - `ALTA`, `BAJA`, `LICENCIA`, `PRUEBA`
  - `seccionId`: Reference to Seccion (optional)
  - `telefono`: Phone number
  - `email`: Email address
  - `presentadoPor`: Who presented them
  - `notas`: Additional notes
  - `fechaCreacion`, `fechaActualizacion`: Timestamps
- **Virtuals**:
  - `direccionCompleta`: Returns complete address as string
- **Indexes**:
  - `nombre + estado`
  - `seccionId + tipo`
  - `email` (sparse)

**Key features:**
- Simplified member types for better categorization
- Clear states for tracking member status
- Structured address for better data quality
- Static information that changes infrequently

#### Vigil
- **Collection**: `vigils`
- **Purpose**: Operational vigil document with live data
- **Fields**:
  - `numeroTurno`: Turn number (indexed)
  - `fechaInicio`: Start date/time (indexed)
  - `fechaFin`: End date/time
  - `parroquia`: Parish name
  - `titular`: Patron saint
  - `asistencia`: Array of attendance records (embedded)
    - `miembro`: Reference to Member
    - `presente`: Attendance confirmed (boolean)
    - `ordenLlegada`: Arrival order
    - `finanzas`: Payment breakdown (embedded)
      - `cuotasAtrasadas`: Overdue fees collected
      - `cuotasMes`: Monthly fees collected
      - `donativoExtra`: Extra donations
  - `rolesGuardia`: Array of guard shift blocks (embedded)
    - `bloqueHora`: Hour range (e.g., "De 10 a 11")
    - `turnos`: Array of specific time slots
      - `horaInicio`: Start time
      - `horaFin`: End time
      - `primerCoro`: Array of Member references (first choir)
      - `segundoCoro`: Array of Member references (second choir)
  - `rolesEspeciales`: Special roles (embedded)
    - `portaHachas`: Array of Member references (torch bearers)
    - `ayudaronMisa`: Array of Member references (mass helpers)
  - `actaId`: Reference to Minute (one-to-one)
  - `seccionId`: Reference to Seccion (optional)
  - `estado`: Status - `programada`, `en_curso`, `finalizada`, `cancelada`
  - `fechaCreacion`, `fechaActualizacion`: Timestamps
- **Virtuals**:
  - `totalPresentes`: Count of members present
  - `totalCuotasMes`: Sum of monthly fees collected
  - `totalCuotasAtrasadas`: Sum of overdue fees collected
  - `totalDonativosExtra`: Sum of extra donations
  - `duracionHoras`: Duration of vigil in hours
- **Indexes**:
  - `numeroTurno + seccionId`
  - `fechaInicio` (descending)
  - `estado + fechaInicio`

**Key features:**
- **Embedded attendance:** All attendance records embedded in the vigil document
- **Individual finances:** Each attendance record has its own payment breakdown
- **Embedded guard shifts:** Guard assignments organized by time blocks
- **Special roles:** Porta-hachas and mass helpers tracked directly
- **Virtual fields:** Automatic calculation of totals

#### Minute
- **Collection**: `minutes`
- **Purpose**: Formal administrative record of the meeting
- **Fields**:
  - `vigiliaId`: Reference to Vigil (required, unique - one-to-one)
  - `horarios`: Meeting schedule (embedded)
    - `inicioJunta`: Start time
    - `lecturaOrden`: Whether general order was read
    - `manifiesto`: Manifestation time
    - `reservado`: Reserved time
    - `misa`: Mass time
  - `lecturas`: Readings and correspondence (embedded)
    - `circulares`: Circular readings
    - `correspondencia`: Correspondence
  - `movimientos`: Administrative movements (embedded)
    - `vigiliaPrueba`: New members on trial
    - `solicitudesActivos`: Applications for active membership
    - `solicitudesHonorarios`: Applications for honorary membership
    - `cambiosDomicilio`: Address changes (references Member)
    - `bajas`: Removals/departures (references Member)
    - `distintivos`: Distinctions/awards (references Member)
  - `otrosAsuntos`: Other matters (text)
  - `estadisticasAsistencia`: Attendance statistics (embedded)
    - `activos`: Count of active members
    - `prueba`: Count of trial members
    - `comuniones`: Count of communions
    - `aspirantes`: Count of aspirants
    - `extraordinaria`: Count of extraordinary attendees
    - `detalleExtraordinaria`: Array of extraordinary attendee details
  - `finanzasResumen`: Financial summary (embedded)
    - `recibosMes`: Monthly fees total
    - `recibosAtrasados`: Overdue fees total
    - `semillas`: Seeds/donations
    - `honorarios`: Honorary fees
    - `otrosConceptos`: Array of other concepts
    - `sumaTotal`: Grand total
  - `detalleHonorarios`: Array of specific honorary fee details
  - `firmas`: Signatures (embedded)
    - `jefeTurno`: Reference to Member (chief)
    - `secretario`: Reference to Member (secretary)
    - `tesorero`: Reference to Member (treasurer)
  - `seccionId`: Reference to Seccion (optional)
  - `fechaCreacion`, `fechaActualizacion`: Timestamps
- **Virtuals**:
  - `totalAsistencia`: Calculated total attendance
  - `finanzasCalculadas`: Calculated financial total for validation
- **Indexes**:
  - `vigiliaId` (unique - enforces one-to-one)
  - `seccionId + fechaCreacion`

**Key features:**
- **One-to-one relationship with Vigil:** Each minute is tied to exactly one vigil
- **Administrative movements:** Track member changes (address updates, removals, distinctions)
- **Financial summary:** Totals automatically calculated from Vigil document
- **References to Members:** Address changes, removals, and distinctions reference the Member collection

## Operational Workflow

The schema is designed to support this operational workflow:

### 1. Initial Load: Create Member Documents

When setting up the system, create a `Member` document for every member:

```typescript
import { Member } from '@/lib/database/models';

await Member.create({
  nombre: 'Juan Pérez López',
  tipo: 'ACTIVO',
  direccion: {
    calle: 'Calle Principal 123',
    colonia: 'Centro',
    municipio: 'Zumpango del Río'
  },
  fechaIngreso: new Date('2020-01-15'),
  estado: 'ALTA'
});
```

### 2. Create Vigil: Start the Event

When starting a new vigil, create a `Vigil` document and populate the attendance list:

```typescript
import { Vigil, Member } from '@/lib/database/models';

// Get all active members
const activeMembers = await Member.find({ estado: 'ALTA' });

// Create vigil with pre-populated attendance
const vigil = await Vigil.create({
  numeroTurno: 15,
  fechaInicio: new Date('2025-11-20T22:00:00'),
  fechaFin: new Date('2025-11-21T06:00:00'),
  titular: 'Santísimo Sacramento',
  parroquia: 'De Zumpango del Río',
  asistencia: activeMembers.map(member => ({
    miembro: member._id,
    presente: false,
    finanzas: {
      cuotasAtrasadas: 0,
      cuotasMes: 0,
      donativoExtra: 0
    }
  })),
  rolesGuardia: [],
  rolesEspeciales: {
    portaHachas: [],
    ayudaronMisa: []
  },
  estado: 'programada'
});

// Frontend downloads the vigil and displays attendance table
const vigilWithMembers = await Vigil.findById(vigil._id)
  .populate('asistencia.miembro')
  .exec();
```

### 3. Save Operation: Update Attendance and Payments

As members arrive and make payments, update the `Vigil` document:

```typescript
// Mark attendance and record payment
await Vigil.updateOne(
  { _id: vigilId, 'asistencia.miembro': memberId },
  {
    $set: {
      'asistencia.$.presente': true,
      'asistencia.$.ordenLlegada': 5,
      'asistencia.$.finanzas.cuotasMes': 50,
      'asistencia.$.finanzas.cuotasAtrasadas': 100
    }
  }
);
```

### 4. Assign Guard Shifts

During the vigil, assign guard shifts:

```typescript
await Vigil.updateOne(
  { _id: vigilId },
  {
    $push: {
      rolesGuardia: {
        bloqueHora: 'De 10 a 11',
        turnos: [{
          horaInicio: '10:00',
          horaFin: '10:15',
          primerCoro: [member1Id, member2Id],
          segundoCoro: [member3Id, member4Id]
        }]
      }
    }
  }
);
```

### 5. Generate Acta: Create the Official Minute

At the end of the vigil, the backend:
1. Calculates all totals from the `Vigil` document
2. Creates a `Minute` document with pre-filled financial data
3. User only needs to fill text fields (readings, administrative movements)

```typescript
import { Minute, Vigil } from '@/lib/database/models';

// Get vigil with all data
const vigil = await Vigil.findById(vigilId).populate('asistencia.miembro');

// Calculate financial totals
const recibosMes = vigil.asistencia.reduce(
  (sum, a) => sum + a.finanzas.cuotasMes,
  0
);
const recibosAtrasados = vigil.asistencia.reduce(
  (sum, a) => sum + a.finanzas.cuotasAtrasadas,
  0
);

// Create minute with auto-calculated values
const minute = await Minute.create({
  vigiliaId: vigil._id,
  horarios: {
    inicioJunta: '21:00',
    lecturaOrden: true,
    manifiesto: '22:00',
    reservado: '05:30',
    misa: '06:00'
  },
  estadisticasAsistencia: {
    activos: vigil.asistencia.filter(a => a.presente).length,
    prueba: 0,
    comuniones: 0,
    aspirantes: 0,
    extraordinaria: 0,
    detalleExtraordinaria: []
  },
  finanzasResumen: {
    recibosMes,
    recibosAtrasados,
    semillas: 0,
    honorarios: 0,
    otrosConceptos: [],
    sumaTotal: recibosMes + recibosAtrasados
  },
  movimientos: {
    vigiliaPrueba: [],
    solicitudesActivos: [],
    solicitudesHonorarios: [],
    cambiosDomicilio: [],
    bajas: [],
    distintivos: []
  },
  firmas: {}
});

// Link minute back to vigil
await Vigil.updateOne(
  { _id: vigil._id },
  { actaId: minute._id, estado: 'finalizada' }
);
```

## Example Queries

### Get all active members
```typescript
const activeMembers = await Member.find({ estado: 'ALTA' });
```

### Get vigil with full attendance details
```typescript
const vigil = await Vigil.findById(vigilId)
  .populate('asistencia.miembro')
  .populate('rolesGuardia.turnos.primerCoro')
  .populate('rolesGuardia.turnos.segundoCoro')
  .exec();
```

### Get minute with member references
```typescript
const minute = await Minute.findOne({ vigiliaId })
  .populate('vigiliaId')
  .populate('firmas.jefeTurno')
  .populate('firmas.secretario')
  .populate('firmas.tesorero')
  .exec();
```

### Get all vigils in a date range
```typescript
const vigils = await Vigil.find({
  fechaInicio: { $gte: startDate, $lte: endDate }
})
  .sort({ fechaInicio: -1 })
  .populate('asistencia.miembro', 'nombre')
  .exec();
```

### Calculate total fees collected in a month
```typescript
const vigils = await Vigil.find({
  fechaInicio: { $gte: monthStart, $lte: monthEnd },
  estado: 'finalizada'
});

const totalCollected = vigils.reduce((sum, vigil) =>
  sum + vigil.totalCuotasMes + vigil.totalCuotasAtrasadas,
  0
);
```

## Relationships

```
Seccion (1) -> (n) Member
Seccion (1) -> (n) Vigil
Seccion (1) -> (n) Minute

Vigil (1) -> (n) Member (through asistencia.miembro)
Vigil (1) -> (n) Member (through rolesGuardia.turnos.primerCoro/segundoCoro)
Vigil (1) -> (n) Member (through rolesEspeciales)
Vigil (1) -> (1) Minute (one-to-one through actaId)

Minute (1) -> (1) Vigil (one-to-one, required)
Minute (n) -> (1) Member (through firmas)
Minute (n) -> (1) Member (through movimientos.cambiosDomicilio)
Minute (n) -> (1) Member (through movimientos.bajas)
Minute (n) -> (1) Member (through movimientos.distintivos)

User (1) -> (n) Session
User (1) -> (n) Account
```

## Advantages of This Schema Design

### 1. **Fewer Queries**
Instead of 4-5 queries to load a vigil with attendance and shifts, you now need just 1 query with populate.

### 2. **Atomic Updates**
All attendance and payment data is in one document, making updates atomic and consistent.

### 3. **Clear Workflow**
The separation between `Vigil` (operational) and `Minute` (administrative) matches the real-world workflow.

### 4. **Automatic Calculations**
Virtual fields on `Vigil` automatically calculate totals, reducing the chance of errors.

### 5. **Better Data Integrity**
- One-to-one relationship between `Vigil` and `Minute` is enforced
- Member references are always valid
- Financial data is never orphaned

### 6. **Simpler Address Changes**
When a member changes address, you only update the `Member` document. Historical references in `Minute` documents remain correct through the reference.

## Indexes

All schemas include appropriate indexes for:
- Foreign key references
- Frequently queried fields
- Unique constraints
- TTL (Time To Live) for sessions and verifications

Key indexes:
- `Member`: `nombre + estado`, `seccionId + tipo`, `email` (sparse)
- `Vigil`: `numeroTurno + seccionId`, `fechaInicio` (desc), `estado + fechaInicio`
- `Minute`: `vigiliaId` (unique), `seccionId + fechaCreacion`

## Notes

- All date fields use JavaScript Date objects
- Monetary amounts are stored as Numbers
- Spanish field names are used to match domain terminology
- TTL indexes automatically delete expired sessions and verifications
- Virtual fields are computed but not stored in the database
- The schema consolidates related data to reduce queries and improve consistency
