import type { CopyMap } from "../koLocalize";

/**
 * Copy shared by all five ICP pages (/for-artists, /for-managers, /for-labels,
 * /for-partners, /enterprise).
 *
 * Only 11 nodes are common to all five — these pages are otherwise genuinely
 * distinct content, so this is not an attempt to factor out the bulk. It exists
 * because these particular strings are the AUDIENCE SWITCHER that appears on
 * every one of them: if "Solo artists" reads one way on /for-artists and
 * another on /for-labels, the switcher looks like it leads somewhere else.
 *
 * The audience names deliberately match the nav and footer labels for the same
 * pages, so a reader sees one name for one destination wherever they meet it.
 */
export const KO_ICP_COMMON: CopyMap = {
  // ── audience switcher ──
  "Team for": "Team —",
  "Solo artists": "솔로 아티스트",
  "Managers": "매니저",
  "Labels": "레이블",
  "Distributors": "유통사",
  "Enterprise": "엔터프라이즈",

  // ── shared CTA / status vocabulary ──
  "Sign up free": "무료로 시작하기",
  "Get a demo": "데모 요청하기",
  "Done": "완료",
  "Needs you": "확인 필요",
  "live": "실시간",
  "looks like.": "어떤 모습인지.",
  "Early access · in beta": "얼리 액세스 · 베타",
  "TeamMate": "TeamMate",
};
