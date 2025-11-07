import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getCredits } from '@/lib/credits';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const user = await requireAuth();
    
    // Get actual credit usage from runs this month
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    
    const used = await prisma.run.count({
      where: {
        project: { userId: user.id },
        createdAt: { gte: monthStart }
      }
    });
    
    const limit = await getCredits(user.id);
    
    return NextResponse.json({ used, limit });
  } catch (error: any) {
    return NextResponse.json({ used: 0, limit: 1000 }, { status: 200 });
  }
}
