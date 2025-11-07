import { prisma } from '@/lib/prisma';
import { json, HttpError } from '@/lib/http';
import { requireAuth } from '@/lib/auth';

export async function GET(_: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth();
    const { id: projectId } = await ctx.params;
    
    // Verify project exists and user owns it
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { userId: true }
    });
    
    if (!project) {
      throw new HttpError(404, 'Project not found');
    }
    
    if (project.userId !== user.id) {
      throw new HttpError(403, 'Forbidden');
    }
    
    // Get all runs for this project
    const runs = await prisma.run.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        status: true,
        createdAt: true,
        completedAt: true
      }
    });
    
    return json(runs);
  } catch (error: any) {
    console.error('Error fetching project runs:', error);
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, error.message || 'Internal server error');
  }
}
