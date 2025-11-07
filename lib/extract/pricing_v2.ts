export type PricingRow = {
    planName: string;
    priceMonthly?: number;
    priceAnnual?: number;
    transactionFee?: number;
    currency?: string;
  };
  
  const money = /(\$|€|£)?\s?(\d{1,4}(?:[.,]\d{2})?)/;
  const feePct = /(\d{1,2}(?:\.\d{1,2})?)\s?%/i;
  
  function parseMoney(s: string): { currency?: string; amount?: number } {
    const m = s.match(money);
    if (!m) return {};
    const currency = m[1] ?? '$';
    const amt = parseFloat(m[2].replace(',', ''));
    return { currency, amount: isNaN(amt) ? undefined : amt };
  }
  
  export function extractPricingV2(raw: string): PricingRow[] {
    const text = raw.replace(/\s+/g, ' ').trim();
    const rows: PricingRow[] = [];
    const annualHints = /(billed\s+annually|per\s+year|annual\s+billing)/i.test(text);
  
    // 1) Try to detect simple table-like segments: headers like Plan | Price
    const split = raw.split(/\n{2,}|\r{2,}/);
    for (const block of split) {
      const lines = block.split(/\n|\r/).map(l => l.trim()).filter(Boolean);
      if (lines.length < 2) continue;
      const headerish = /plan|price|monthly|annual|billed/i.test(lines[0] + lines[1]);
      if (!headerish) continue;
  
      for (let i = 0; i < lines.length; i++) {
        const l = lines[i];
        // Pattern: Plan Name ... $X/mo or $Y/year
        const planName = l.replace(/\$.*$/,'').replace(/[:\-–|]+$/,'').trim();
        const priceMatch = l.match(money);
        if (priceMatch) {
          const { currency, amount } = parseMoney(l);
          if (amount != null) {
            let priceMonthly: number | undefined;
            let priceAnnual: number | undefined;
            if (/\/\s*mo|per\s*month|monthly/i.test(l)) priceMonthly = amount;
            if (/\/\s*y(ear)?|per\s*year|ann(ual)?/i.test(l)) priceAnnual = amount;
  
            // Normalize “billed annually” expressions
            if (!priceMonthly && annualHints && priceAnnual == null) {
              // If we see "billed annually $240 ($20/mo)" kind of lines
              const moInLine = l.match(/(\$[\d.,]+)\s*\/\s*mo/i)?.[1];
              if (moInLine) priceMonthly = parseMoney(moInLine).amount;
            }
  
            // If we only have annual price and block says billed annually, derive monthly
            if (priceAnnual && !priceMonthly) priceMonthly = +(priceAnnual / 12).toFixed(2);
  
            // Fees
            const fee = l.match(feePct)?.[1];
            const transactionFee = fee ? parseFloat(fee) : undefined;
  
            rows.push({ planName, priceMonthly, priceAnnual, transactionFee, currency });
          }
        }
      }
    }
  
    // 2) Fallback: scan whole text for “Plan – $X/mo”
    const planLine = /([A-Z][A-Za-z0-9+ ]{2,40})\s+[-–—:]\s+([^\.]{0,60})/g;
    let m;
    while ((m = planLine.exec(raw)) !== null) {
      const planName = m[1].trim();
      const segment = m[2];
      const { currency, amount } = parseMoney(segment);
      if (amount != null) {
        let priceMonthly: number | undefined;
        let priceAnnual: number | undefined;
        if (/\/\s*mo|monthly/i.test(segment)) priceMonthly = amount;
        if (/\/\s*y|annual/i.test(segment)) priceAnnual = amount;
        if (!priceMonthly && priceAnnual) priceMonthly = +(priceAnnual / 12).toFixed(2);
        const fee = segment.match(feePct)?.[1];
        rows.push({ planName, priceMonthly, priceAnnual, transactionFee: fee ? parseFloat(fee) : undefined, currency });
      }
    }
  
    // Deduplicate by plan+price
    const key = (r: PricingRow) => `${r.planName.toLowerCase()}|${r.priceMonthly ?? ''}|${r.priceAnnual ?? ''}|${r.transactionFee ?? ''}`;
    const seen = new Set<string>();
    return rows.filter(r => (seen.has(key(r)) ? false : (seen.add(key(r)), true)));
  }