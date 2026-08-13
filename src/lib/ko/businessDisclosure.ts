/**
 * Korean business disclosure (전자상거래법 제10조).
 *
 * Korea's Act on Consumer Protection in Electronic Commerce requires a seller
 * to display specific identifying details on the site itself — not on request,
 * not in a PDF, on the page. The required fields are enumerated below, each
 * with the statutory name a Korean reader (and a Korean regulator) expects to
 * see, because a translated approximation of the label is not the label.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * WHY EVERY VALUE HERE IS EMPTY
 *
 * These are facts about a legal entity. There is exactly one correct value for
 * each and I do not have any of them. A plausible-looking 사업자등록번호 is not
 * a placeholder — it is a fabricated business registration number displayed to
 * Korean consumers as though it were real, which is worse than displaying
 * nothing and is not a thing to be filled in later and forgotten.
 *
 * So the component renders NOTHING while these are blank, rather than rendering
 * a shape with dummy values in it. An absent block is visibly absent; a block
 * full of 000-00-00000 looks finished. check:i18n reports the missing fields by
 * name so the gap stays on the board instead of being discovered by a Korean
 * customer.
 *
 * WHICH FIELDS EVEN APPLY IS A COUNSEL QUESTION, NOT A TRANSLATION ONE.
 * 통신판매업 신고번호 is a filing made with a Korean local authority. Whether a
 * US entity selling cross-border into Korea must make that filing — and whether
 * it therefore has such a number at all — depends on the sale structure, which
 * is one of the open commercial decisions. Two possibilities:
 *
 *   - Team KR (or the partner) is the seller of record in Korea. Then all of
 *     these apply and the partner already has most of them.
 *   - The US entity sells directly. Then the 통신판매업 filing may not apply,
 *     and the honest disclosure is the entity's own details plus a Korean
 *     contact — NOT an invented Korean registration.
 *
 * The answer changes what this block says, so it is in the partner questions
 * rather than guessed at here. See docs/korea-partner-questions-DRAFT.md.
 */

export type DisclosureField = {
  /** The statutory Korean label, as it must appear. */
  readonly label: string;
  /** What the owner needs to supply, in plain English. */
  readonly needs: string;
  /** The value. Empty means "not supplied" — the block will not render. */
  readonly value: string;
  /** False for fields that may not apply depending on the sale structure. */
  readonly required: boolean;
};

export const KO_BUSINESS_DISCLOSURE: readonly DisclosureField[] = [
  { label: "상호", needs: "Registered company name as filed", value: "", required: true },
  { label: "대표자", needs: "Name of the representative director", value: "", required: true },
  { label: "주소", needs: "Registered business address", value: "", required: true },
  { label: "전화번호", needs: "Contact telephone number", value: "", required: true },
  { label: "전자우편", needs: "Contact email address", value: "", required: true },
  { label: "사업자등록번호", needs: "Business registration number", value: "", required: true },
  {
    label: "통신판매업 신고번호",
    needs: "Mail-order sales filing number — only if the Korean entity is the seller of record",
    value: "",
    required: false,
  },
  {
    label: "개인정보관리책임자",
    needs: "Named privacy officer — PIPA requires a person, not a role inbox",
    value: "",
    required: true,
  },
];

/** True only when every REQUIRED field has a real value. */
export const disclosureIsComplete = (
  fields: readonly DisclosureField[] = KO_BUSINESS_DISCLOSURE,
): boolean => fields.every((f) => !f.required || f.value.trim().length > 0);

/** The required fields still missing a value, for reporting. */
export const missingDisclosureFields = (
  fields: readonly DisclosureField[] = KO_BUSINESS_DISCLOSURE,
): readonly DisclosureField[] => fields.filter((f) => f.required && f.value.trim().length === 0);
