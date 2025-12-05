import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import connectDB from '@/lib/database/mongodb';
import Vigil from '@/lib/database/models/Vigil';
import { vigilSchema } from '@/lib/utils/validators';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const status = searchParams.get('status');

    // Build query
    const query: Record<string, unknown> = {};

    if (startDate && endDate) {
      query.fechaInicio = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else if (startDate) {
      query.fechaInicio = { $gte: new Date(startDate) };
    } else if (endDate) {
      query.fechaInicio = { $lte: new Date(endDate) };
    }

    if (
      status &&
      ['programada', 'en_curso', 'finalizada', 'cancelada'].includes(status)
    ) {
      query.estado = status;
    }

    const vigils = await Vigil.find(query)
      .select('numeroTurno fechaInicio fechaFin parroquia titular estado')
      .sort({ fechaInicio: -1 })
      .lean();

    // Transform to calendar event format
    const events = vigils.map(vigil => ({
      id: vigil._id.toString(),
      title: vigil.titular,
      startDate: vigil.fechaInicio,
      endDate: vigil.fechaFin,
      status: vigil.estado,
      turnNumber: vigil.numeroTurno,
      parroquia: vigil.parroquia,
    }));

    return NextResponse.json({ events });
  } catch (error) {
    console.error('Error fetching vigils:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();

    // Validate input
    const validation = vigilSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { numeroTurno, fechaInicio, fechaFin, parroquia, titular, estado } =
      validation.data;

    // Create new vigil
    const newVigil = new Vigil({
      numeroTurno,
      fechaInicio: new Date(fechaInicio),
      fechaFin: new Date(fechaFin),
      parroquia: parroquia || undefined,
      titular,
      estado,
      asistencia: [],
      rolesGuardia: [],
      rolesEspeciales: { portaHachas: [], ayudaronMisa: [] },
    });

    await newVigil.save();

    return NextResponse.json(
      {
        success: true,
        vigil: {
          id: newVigil._id.toString(),
          title: newVigil.titular,
          startDate: newVigil.fechaInicio,
          endDate: newVigil.fechaFin,
          status: newVigil.estado,
          turnNumber: newVigil.numeroTurno,
          parroquia: newVigil.parroquia,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating vigil:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
