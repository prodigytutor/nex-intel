import { prisma } from '@/lib/prisma';
import { json, HttpError } from '@/lib/http';
import { requireAuth } from '@/lib/auth';

export async function GET(_: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth();
    const { id } = await ctx.params;
    const run = await prisma.run.findUnique({ 
      where: { id },
      include: { project: true }
    });
    if (!run) throw new HttpError(404, 'Run not found');
    
    // Verify user owns the project
    if (run.project.userId !== user.id) {
      throw new HttpError(403, 'Forbidden');
    }
    
    return json({ 
      status: run.status, 
      lastNote: run.lastNote,
      createdAt: run.createdAt, 
      completedAt: run.completedAt 
    });
  } catch (error: any) {
    console.error('Status endpoint error:', error);
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, error.message || 'Internal server error');
  }
}