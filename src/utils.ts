import * as Types from "./types.js";

export function formatCreditsInfo(metadata: Types.ResponseMetadata | null): string {
  if (!metadata) {
    return "";
  }

  const { creditsCost, creditsRemaining } = metadata;

  let info = "\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
  info += "💳 Credits\n";

  if (creditsCost !== null) {
    info += `  Cost: -${creditsCost}\n`;
  }

  if (creditsRemaining !== null) {
    info += `  Remaining: ${creditsRemaining}\n`;
  }

  if (creditsCost !== null && creditsRemaining !== null) {
    const percentage = Math.round((creditsRemaining / (creditsRemaining + creditsCost)) * 100);
    info += `  Usage: ${percentage}% of account\n`;
  }

  info += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━";

  return info;
}
