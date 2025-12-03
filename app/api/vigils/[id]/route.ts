import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import connectDB from '@/lib/database/mongodb';
import Vigil from '@/lib/database/models/Vigil';
import { vigilSchema } from '@/lib/utils/validators';
import mongoose from 'mongoose';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid vigil ID' }, { status: 400 });
    }

    await connectDB();

    const vigil = await Vigil.findById(id)
      .select('numeroTurno fechaInicio fechaFin parroquia titular estado')
      .lean();

    if (!vigil) {
      return NextResponse.json({ error: 'Vigil not found' }, { status: 404 });
    }

    return NextResponse.json({
      vigil: {
        id: vigil._id.toString(),
        title: vigil.titular,
        startDate: vigil.fechaInicio,
        endDate: vigil.fechaFin,
        status: vigil.estado,
        turnNumber: vigil.numeroTurno,
        parroquia: vigil.parroquia,
      },
    });
  } catch (error) {
    console.error('Error fetching vigil:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid vigil ID' }, { status: 400 });
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

    const updatedVigil = await Vigil.findByIdAndUpdate(
      id,
      {
        numeroTurno,
        fechaInicio: new Date(fechaInicio),
        fechaFin: new Date(fechaFin),
        parroquia: parroquia || undefined,
        titular,
        estado,
      },
      { new: true, runValidators: true }
    )
      .select('numeroTurno fechaInicio fechaFin parroquia titular estado')
      .lean();

    if (!updatedVigil) {
      return NextResponse.json({ error: 'Vigil not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      vigil: {
        id: updatedVigil._id.toString(),
        title: updatedVigil.titular,
        startDate: updatedVigil.fechaInicio,
        endDate: updatedVigil.fechaFin,
        status: updatedVigil.estado,
        turnNumber: updatedVigil.numeroTurno,
        parroquia: updatedVigil.parroquia,
      },
    });
  } catch (error) {
    console.error('Error updating vigil:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid vigil ID' }, { status: 400 });
    }

    await connectDB();

    const deletedVigil = await Vigil.findByIdAndDelete(id);

    if (!deletedVigil) {
      return NextResponse.json({ error: 'Vigil not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Vigil deleted' });
  } catch (error) {
    console.error('Error deleting vigil:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
