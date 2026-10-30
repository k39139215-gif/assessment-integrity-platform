export interface TelemetryEventData {
  eventType: string;
  metadata?: any;
}

export function calculateIntegrityScore(events: TelemetryEventData[]) {
  let score = 0;
  let reasons: string[] = [];

  let typedChars = 0;
  let pastedChars = 0;
  let pasteEvents = 0;
  let focusLosses = 0;
  let hasLargePaste = false;

  for (const event of events) {
    const meta = event.metadata ? (typeof event.metadata === 'string' ? JSON.parse(event.metadata) : event.metadata) : {};

    if (event.eventType === 'TYPE') {
      typedChars += meta.delta || 0;
    }

    if (event.eventType === 'PASTE') {
      pastedChars += meta.length || 0;
      pasteEvents++;
    }

    if (event.eventType === 'LARGE_PASTE') {
      hasLargePaste = true;
    }

    if (event.eventType === 'FOCUS_LOST') {
      focusLosses++;
    }
  }

  const totalChars = typedChars + pastedChars;
  const pasteRatio = totalChars > 0 ? pastedChars / totalChars : 0;

  if (pastedChars >= 100) {
    score += 15;
    reasons.push("paste activity");
  }

  if (hasLargePaste || pastedChars >= 500) {
    score += 20;
    reasons.push("large paste");
  }

  if (pasteEvents >= 3) {
    score += 15;
    reasons.push("multiple pastes");
  }

  if (pasteRatio >= 0.5) {
    score += 20;
    reasons.push("high paste ratio");
  }

  if (focusLosses >= 2) {
    score += 10;
    reasons.push("multiple focus losses");
  }

  score = Math.min(score, 100);

  let riskLevel = "Low";
  if (score >= 60) riskLevel = "High";
  else if (score >= 30) riskLevel = "Medium";

  if (reasons.length === 0) {
    reasons.push("No suspicious activity detected.");
  }

  return {
    score,
    riskLevel,
    reasons,
    summary: {
      typedChars,
      pastedChars,
      pasteEvents,
      focusLosses
    }
  };
}
