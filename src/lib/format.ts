// Formats d'affichage et de saisie propres au Sénégal (voir CLAUDE.md).

/** 25000 → « 25 000 FCFA ». Les montants sont des entiers, sans centimes. */
export function formatFCFA(amount: number): string {
  if (!Number.isInteger(amount)) throw new Error(`Montant non entier : ${amount}`);
  const sign = amount < 0 ? "-" : "";
  const digits = String(Math.abs(amount)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${sign}${digits} FCFA`;
}

/** « 25 000 », « 25.000 FCFA » ou « 25000f » → 25000. Renvoie null si illisible. */
export function parseFCFA(input: string): number | null {
  const digits = input.replace(/\D/g, "");
  if (!digits) return null;
  const value = Number(digits);
  return Number.isSafeInteger(value) ? value : null;
}

/** Date ISO (« 2026-10-20 ») ou objet Date → « 20/10/2026 ». */
export function formatDate(value: string | Date): string {
  const d = typeof value === "string" ? parseISODate(value) : value;
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getFullYear()}`;
}

function parseISODate(value: string): Date {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!m) throw new Error(`Date invalide : ${value}`);
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
}

// Numéros sénégalais à 9 chiffres : mobiles en 70 à 78, fixes en 33.
// Plage volontairement large : mieux vaut accepter un numéro rare que refuser un vrai client.
const SN_NUMBER = /^(7[0-8]\d{7}|33\d{7})$/;

/**
 * Normalise un numéro saisi (« 77 123 45 67 », « 00221771234567 », « +221 77… »)
 * au format stocké « +221771234567 ». Renvoie null si ce n'est pas un numéro sénégalais.
 */
export function normalizePhoneSN(input: string): string | null {
  let digits = input.replace(/\D/g, "");
  if (digits.startsWith("00221")) digits = digits.slice(5);
  else if (digits.startsWith("221") && digits.length === 12) digits = digits.slice(3);
  return SN_NUMBER.test(digits) ? `+221${digits}` : null;
}

/** « +221771234567 » → « 77 123 45 67 » pour l'affichage. */
export function formatPhoneSN(stored: string): string {
  const d = stored.replace(/^\+221/, "");
  return d.length === 9 ? `${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5, 7)} ${d.slice(7)}` : stored;
}
