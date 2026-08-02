// India's customs duty on imported gold/silver bullion was hiked from 6% to
// 15% effective May 13, 2026 (cited by MMTC-PAMP and TaxGuru). We bake that
// into every gold/silver figure we show (live rate, chart, breakdown,
// calculator, city table) so the headline number is close to what Indian
// buyers actually see quoted, rather than the lower "pure spot" price.
// NOTE: if this rate changes again, update it here — it's a policy figure,
// not something derivable from market data.
//
// GST (3%) is deliberately NOT included here — it's applied on top of metal
// value + making charges in the calculator, matching how a jeweller's bill
// actually itemises it. Baking GST in here too would double-count it there.
//
// This still won't match retail/MCX exactly, since dealer premiums and
// local bullion-association pricing vary and aren't captured by any public
// international feed.
export const IMPORT_DUTY_PCT = 15;

export function withImportDuty(value) {
  if (value == null) return null;
  return value * (1 + IMPORT_DUTY_PCT / 100);
}
