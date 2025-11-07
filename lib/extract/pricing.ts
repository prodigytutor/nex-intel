type PricingCandidate = {
    planName: string;
    priceMonthly?: number;
    priceAnnual?: number;
    transactionFee?: number;
    notes?: string;
  };
  
  export function parseCurrencyToNumber(s: string): number | undefined {
    const m = s.replace(/,/g, '').match(/\$?\s?(\d{1,4})(\.\d{1,2})?/);
    if (!m) return;
    return parseFloat(m[1] + (m[2] ?? ''));
  }
  
  export function detectMonthly(text: string): number | undefined {
    // $29/month, $29/mo
    const m = text.match(/\$?\s?\d{1,3}(\.\d{2})?\s*\/?\s*(month|mo)\b/i);
    if (!m) return;
    return parseCurrencyToNumber(m[0]);
  }
  
  export function detectAnnual(text: string): number | undefined {
    // $290/year, $290/yr, billed annually $24/mo
    const m = text.match(/\$?\s?\d{2,5}(\.\d{2})?\s*\/?\s*(year|yr|annually)\b/i);
    if (!m) return;
    return parseCurrencyToNumber(m[0]);
  }
  
  export function detectFeePct(text: string): number | undefined {
    // 9% fee, 10% transaction fee
    const m = text.match(/(\d{1,2}(\.\d+)?)\s*%\s*(platform|transaction)?\s*fee/i);
    if (!m) return;
    return parseFloat(m[1]);
  }
  
  // From a single page’s clean text, produce rough plan rows
  export function extractPricing(text: string): PricingCandidate[] {
    const lines = text.split(/[\n\r]+/).map(s => s.trim()).filter(Boolean);
    const rows: PricingCandidate[] = [];
    let current: PricingCandidate | null = null;
  
    for (const line of lines) {
      // naive plan name detection
      if (/^free\b|starter\b|basic\b|pro\b|growth\b|team\b|business\b/i.test(line)) {
        if (current) rows.push(current);
        current = { planName: line.split(/\s+/)[0] };
      }
      const pm = detectMonthly(line);
      const pa = detectAnnual(line);
      const fee = detectFeePct(line);
      if (!current) current = { planName: 'Entry' };
      if (pm != null && current.priceMonthly == null) current.priceMonthly = pm;
      if (pa != null && current.priceAnnual == null) current.priceAnnual = pa;
      if (fee != null && current.transactionFee == null) current.transactionFee = fee;
      if (/no fees|0% fee|zero fees/i.test(line)) current.transactionFee = 0;
    }
    if (current) rows.push(current);
  
    // de-noise: keep 1–4 plans
    return rows.slice(0, 4);
  }