// India charges customs duty on imported gold/silver — 6% basic customs duty
// + a small agriculture infrastructure cess, commonly cited together as
// roughly 6.5% landed-cost markup over the raw international price. We bake
// that into every gold/silver figure we show (live rate, chart, breakdown,
// calculator, city table) so the headline number is close to what Indian
// buyers actually see quoted, rather than the lower "pure spot" price.
//
// GST (3%) is deliberately NOT included here — it's applied on top of metal
// value + making charges in the calculator, matching how a jeweller's bill
// actually itemises it. Baking GST in here too would double-count it there.
//
// This still won't match retail/MCX exactly, since dealer premiums and
// local bullion-association pricing vary and aren't captured by any public
// international feed.
export const IMPORT_DUTY_PCT = 6.5;

export function withImportDuty(value) {
  if (value == null) return null;
  return value * (1 + IMPORT_DUTY_PCT / 100);
}
