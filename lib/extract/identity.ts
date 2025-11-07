export function extractPositioning(text: string): { icp?: string[]; taglines?: string[] } {
    const lines = text.split(/\n+/).map(s => s.trim()).filter(Boolean);
    const taglines = lines.filter(l =>
      /for creators|for coaches|all-in-one|sell (courses|downloads|services)/i.test(l)
    ).slice(0, 5);
  
    const icp: string[] = [];
    if (/coach|coaches/i.test(text)) icp.push('Coaches');
    if (/creator|influencer/i.test(text)) icp.push('Creators');
    if (/consultant/i.test(text)) icp.push('Consultants');
    if (/small business|solo|freelancer/i.test(text)) icp.push('Solopreneurs');
  
    return { icp: Array.from(new Set(icp)), taglines };
  }