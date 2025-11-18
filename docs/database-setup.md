# Database Setup Guide

This guide covers MongoDB setup, configuration, and database schema for the Divino Maestro App.

## Table of Contents

- [MongoDB Installation](#mongodb-installation)
- [Database Configuration](#database-configuration)
- [Database Models](#database-models)
- [Connection Management](#connection-management)
- [Indexes and Performance](#indexes-and-performance)
- [Data Migration](#data-migration)
- [Troubleshooting](#troubleshooting)

## MongoDB Installation

### Local Installation

#### macOS (using Homebrew)

```bash
# Install MongoDB Community Edition
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB as a service
brew services start mongodb-community

# Verify installation
mongosh --version
```

#### Linux (Ubuntu/Debian)

```bash
# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Create list file
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update package database
sudo apt-get update

# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify installation
mongosh --version
```

#### Windows

1. Download MongoDB Community Server from [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Run the installer (`.msi` file)
3. Choose "Complete" installation
4. Install MongoDB as a Windows Service
5. Install MongoDB Compass (optional GUI tool)

### Cloud Installation (MongoDB Atlas)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (M0 free tier available)
4. Add your IP address to the allowlist
5. Create a database user with credentials
6. Get your connection string

## Database Configuration

### Environment Variables

Update your `.env.local` file:

```env
# Local MongoDB
MONGODB_URI=mongodb://localhost:27017/divino-maestro

# MongoDB Atlas (Cloud)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/divino-maestro?retryWrites=true&w=majority
```

### Connection Options

The app uses the following Mongoose connection options:

```typescript
{
  bufferCommands: false,  // Disable command buffering for better error handling
}
```

### Testing the Connection

```bash
# Start the dev server
npm run dev

# If connection successful, you'll see:
# "MongoDB connected successfully"
```

## Database Models

### Authentication Models

#### User
Stores user authentication information.

```typescript
{
  name: String,           // User's full name
  email: String,          // Email address (unique, indexed)
  emailVerified: Boolean, // Email verification status
  image?: String,         // Profile image URL
  createdAt: Date,        // Account creation timestamp
  updatedAt: Date         // Last update timestamp
}
```

**Indexes:**
- `email` (unique)

#### Account
Stores OAuth and credential account information.

```typescript
{
  userId: ObjectId,              // Reference to User
  accountId: String,             // Account identifier
  providerId: String,            // Auth provider (e.g., 'credential', 'google')
  accessToken?: String,          // OAuth access token
  refreshToken?: String,         // OAuth refresh token
  idToken?: String,              // OAuth ID token
  accessTokenExpiresAt?: Date,   // Token expiration
  refreshTokenExpiresAt?: Date,  // Refresh token expiration
  scope?: String,                // OAuth scopes
  password?: String,             // Hashed password (for credentials)
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `userId`
- `accountId + providerId` (unique composite)

#### Session
Stores user session data.

```typescript
{
  userId: ObjectId,       // Reference to User
  expiresAt: Date,        // Session expiration
  token: String,          // Session token (unique, indexed)
  ipAddress?: String,     // Client IP address
  userAgent?: String,     // Client user agent
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `token` (unique)
- `userId + expiresAt`
- `expiresAt` (TTL index for automatic cleanup)

#### Verification
Stores email verification tokens.

```typescript
{
  identifier: String,     // Email or identifier
  value: String,          // Verification token
  expiresAt: Date,        // Token expiration
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `identifier + value`
- `expiresAt` (TTL index)

### Application Models

#### Socio (Member)
Brotherhood member information.

```typescript
{
  nombre: String,         // First name
  apellidos: String,      // Last name
  numeroHermano: Number,  // Unique member number (indexed)
  dni: String,            // National ID (unique, optional, indexed)
  email: String,          // Email (unique, optional, indexed)
  telefono: String,       // Phone number (optional)
  direccion: String,      // Address (optional)
  poblacion: String,      // City/Town (optional)
  codigoPostal: String,   // Postal code (optional)
  fechaNacimiento: Date,  // Birth date (optional)
  fechaInscripcion: Date, // Registration date
  estado: String,         // Status: aspirante, prueba, activo, honorario, baja, inactivo
  seccionId: ObjectId,    // Reference to Seccion (optional)
  observaciones: String,  // Notes (optional)
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `numeroHermano` (unique)
- `dni` (unique, sparse)
- `email` (unique, sparse)
- `estado`

#### ActaJunta (Meeting Minutes)
Records of brotherhood meetings.

```typescript
{
  fecha: Date,            // Meeting date (indexed)
  titulo: String,         // Meeting title
  contenido: String,      // Meeting content/minutes
  asistentes: [ObjectId], // Array of Socio references
  tipo: String,           // Meeting type (e.g., 'ordinaria', 'extraordinaria')
  archivada: Boolean,     // Archive status (default: false)
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `fecha`
- `tipo`
- `archivada`

#### Vigilia (Vigil)
Vigil event information.

```typescript
{
  fecha: Date,            // Vigil date (indexed)
  titulo: String,         // Vigil title
  descripcion: String,    // Description (optional)
  lugar: String,          // Location
  horaInicio: String,     // Start time
  horaFin: String,        // End time (optional)
  responsable: ObjectId,  // Reference to Socio
  observaciones: String,  // Notes (optional)
  activa: Boolean,        // Active status (default: true)
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `fecha`
- `activa`

#### GuardiaTurno (Guard Duty)
Guard duty shift assignments.

```typescript
{
  fecha: Date,            // Shift date (indexed)
  turno: String,          // Shift type (e.g., 'mañana', 'tarde', 'noche')
  socioId: ObjectId,      // Reference to Socio
  seccionId: ObjectId,    // Reference to Seccion (optional)
  confirmado: Boolean,    // Confirmation status (default: false)
  observaciones: String,  // Notes (optional)
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `fecha`
- `socioId`
- `confirmado`

#### Asistencia (Attendance)
Event attendance records.

```typescript
{
  eventoId: ObjectId,     // Reference to event (ActaJunta or Vigilia)
  eventoTipo: String,     // Event type ('acta' or 'vigilia')
  socioId: ObjectId,      // Reference to Socio
  presente: Boolean,      // Attendance status
  observaciones: String,  // Notes (optional)
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `eventoId + eventoTipo`
- `socioId`

#### Cuota (Membership Dues)
Financial records for member dues.

```typescript
{
  socioId: ObjectId,      // Reference to Socio
  año: Number,            // Year (indexed)
  mes: Number,            // Month (1-12, indexed)
  monto: Number,          // Amount
  pagado: Boolean,        // Payment status (default: false, indexed)
  fechaPago: Date,        // Payment date (optional)
  metodoPago: String,     // Payment method (optional)
  observaciones: String,  // Notes (optional)
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `socioId + año + mes` (unique composite)
- `pagado`
- `año`

#### Seccion (Section)
Organizational sections within the brotherhood.

```typescript
{
  nombre: String,         // Section name (unique, indexed)
  descripcion: String,    // Description (optional)
  activa: Boolean,        // Active status (default: true)
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `nombre` (unique)

## Connection Management

### Connection Caching

The app uses a global connection cache to prevent multiple connections in development:

```typescript
// lib/database/mongodb.ts
const cached = global.mongooseCache || {
  conn: null,
  promise: null,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}
```

This ensures:
- Single connection reused across hot reloads
- No connection leaks in development
- Optimal performance in production

### Error Handling

Connection errors are logged to console:

```typescript
try {
  cached.conn = await cached.promise;
} catch (e) {
  cached.promise = null;
  throw e;
}
```

## Indexes and Performance

### Index Types

1. **Unique Indexes**: Ensure data uniqueness (e.g., email, numeroHermano)
2. **Composite Indexes**: Multi-field lookups (e.g., userId + providerId)
3. **TTL Indexes**: Automatic document expiration (sessions, verifications)
4. **Sparse Indexes**: Only index documents with the field (e.g., optional emails)

### Creating Indexes

Indexes are automatically created when models are defined. Mongoose creates them on first connection:

```bash
# Check indexes in MongoDB shell
mongosh divino-maestro
db.users.getIndexes()
db.socios.getIndexes()
```

### Performance Tips

1. **Use appropriate indexes** for frequent queries
2. **Avoid over-indexing** (impacts write performance)
3. **Monitor slow queries** using MongoDB profiler
4. **Use lean() queries** when you don't need Mongoose documents
5. **Implement pagination** for large result sets

## Data Migration

### Seeding Initial Data

Create a seed script for initial data:

```typescript
// scripts/seed.ts
import connectDB from '@/lib/database/mongodb';
import { Seccion } from '@/lib/database/models';

async function seed() {
  await connectDB();

  const sections = [
    { nombre: 'Varones', descripcion: 'Sección de hermanos varones' },
    { nombre: 'Mujeres', descripcion: 'Sección de hermanas' },
    { nombre: 'Jóvenes', descripcion: 'Sección juvenil' },
  ];

  await Seccion.insertMany(sections);
  console.log('Database seeded successfully');
}

seed();
```

Run with:
```bash
npx ts-node scripts/seed.ts
```

### Backup and Restore

#### Backup
```bash
# Backup entire database
mongodump --uri="mongodb://localhost:27017/divino-maestro" --out=./backup

# Backup specific collection
mongodump --uri="mongodb://localhost:27017/divino-maestro" --collection=socios --out=./backup
```

#### Restore
```bash
# Restore database
mongorestore --uri="mongodb://localhost:27017/divino-maestro" ./backup/divino-maestro

# Restore specific collection
mongorestore --uri="mongodb://localhost:27017/divino-maestro" --collection=socios ./backup/divino-maestro/socios.bson
```

## Troubleshooting

### Connection Issues

**Error: "ECONNREFUSED"**
- MongoDB server is not running
- Solution: Start MongoDB service

**Error: "Authentication failed"**
- Invalid credentials in connection string
- Solution: Verify username and password

**Error: "Timeout while connecting"**
- Network issues or firewall blocking connection
- Solution: Check network settings and MongoDB Atlas IP allowlist

### Index Issues

**Warning: "Duplicate schema index"**
- Index defined in both schema field and schema.index()
- Solution: Remove duplicate index definition

**Slow Queries**
- Missing appropriate indexes
- Solution: Create indexes for frequently queried fields

### Memory Issues

**Error: "Out of memory"**
- Large result sets without pagination
- Solution: Implement pagination and use lean() queries

### Data Validation

**Error: "Validation failed"**
- Data doesn't match schema requirements
- Solution: Check required fields and data types

## Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [MongoDB University](https://university.mongodb.com/) - Free courses

## Support

For database-related issues:
1. Check MongoDB server status
2. Verify connection string in `.env.local`
3. Review model definitions in `lib/database/models/`
4. Check MongoDB logs for errors
5. Test connection with `mongosh`
