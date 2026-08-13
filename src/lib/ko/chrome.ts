/**
 * The site chrome — nav and footer — in Korean.
 *
 * This lives in one module because V2Nav and V2Footer each had their own
 * `LINK_LABELS` table, and each held exactly one entry: `"Pricing": "가격"`.
 * Every other string in both — 57 of them, including the whole mega-menu —
 * rendered in English on a fully Korean page. The rule was right and the table
 * was one entry deep, which is the same enumeration failure that shipped
 * English units in the stat tiles and English `<em>` styling on Hangul. Two
 * tables would have drifted again, so there is now one.
 *
 * THREE KINDS OF STRING, three different rules:
 *
 *  - UI (`CHROME_UI`) — group headings, panel blurbs, controls. These are
 *    interface, not a promise about a destination, so they always follow the
 *    page language. Previously these went through the link rule and so were
 *    gated on `hasTranslation(href)` — but a group heading has no href, so the
 *    gate was permanently false and "Platform" stayed English despite having a
 *    Korean value sitting right there in the table.
 *
 *  - LINKS (`CHROME_LINK`) — titles and descriptions of things you can click.
 *    Translated ONLY where the destination has a Korean version. A Korean label
 *    on an English page promises Korean and delivers English, which is worse
 *    than an obviously-English label. /insights, /changelog, /privacy, /terms,
 *    /sms-terms and /cookies are deliberately absent for that reason: they have
 *    no Korean page yet, so they must keep English labels. When those pages
 *    land, adding them here is the whole change — the gate is `hasTranslation`,
 *    so the chrome localises itself further as translations arrive.
 *
 *  - KEPT (`CHROME_KEEP_EN`) — product module names that stay English on
 *    purpose. This is not an oversight and not laziness: the Korean pages
 *    themselves title their own modules in English ("Rollouts — 브레인이 함께하는
 *    릴리스 관리", "Assets — 발매 준비가 끝난 크리에이티브 라이브러리"). Translating
 *    them in the nav only would mean the nav and the page it opens disagree
 *    about what the product is called.
 *
 * NAMES MATCH THE PAGES THEY OPEN. Every value here was taken from the Korean
 * page's own title or copy rather than translated fresh — "유통사 & 파트너" from
 * /ko/for-partners, "보안 & 신뢰" from /ko/security, the audience names from
 * KO_ICP_COMMON. Before this, /ko/for-labels showed "레이블" in its own audience
 * switcher and "Labels" in the nav directly above it: the same word in two
 * languages on one screen.
 *
 * The Korean partner should confirm the module-name decision — see the naming
 * question in docs/korea-partner-questions-DRAFT.md.
 */

export const CHROME_UI: Record<string, Record<string, string>> = {
  ko: {
    // ── nav group headings ──
    Platform: "플랫폼",
    Solutions: "솔루션",
    Resources: "자료",

    // ── mega-menu panel blurbs ──
    "One platform, one brain": "하나의 플랫폼, 하나의 브레인",
    "One brain, for how you work": "당신의 방식에 맞는 하나의 브레인",
    "Learn & keep up": "배우고, 따라잡기",

    // ── footer column headings ──
    Company: "회사",
    Legal: "약관",

    // ── controls ──
    "Cookie preferences": "쿠키 설정",
  },
};

export const CHROME_LINK: Record<string, Record<string, string>> = {
  ko: {
    // ── link titles ──
    Pricing: "가격",
    "Security & trust": "보안 & 신뢰",
    Security: "보안",
    About: "회사 소개",
    Contact: "문의하기",

    /* Audience names are taken verbatim from KO_ICP_COMMON, which is the map the
       audience switcher on those same pages already uses. The nav and the
       switcher sit on one screen; two renderings of "Labels" would read as two
       different destinations. */
    "Solo artists": "솔로 아티스트",
    "Artist managers": "아티스트 매니저",
    Managers: "매니저",
    Labels: "레이블",
    "Distributors & partners": "유통사 & 파트너",
    Distributors: "유통사",
    Enterprise: "엔터프라이즈",

    // ── mega-menu row descriptions ──
    "Run a release like a campaign": "릴리스를 캠페인처럼 운영하세요",
    "The intelligence across every module": "모든 모듈을 아우르는 지성",
    "The creative library, release-ready": "발매 준비가 끝난 크리에이티브 라이브러리",
    "Bring the tools you already use": "이미 쓰는 도구를 그대로",
    "Take the release to the road": "릴리스를 투어로",
    "Why it's safe on your whole stack": "전체 스택에서 안전한 이유",
    "A label-grade rollout, solo": "혼자서도 레이블 수준의 롤아웃",
    "The whole roster, in one mind": "로스터 전체를 하나의 지성으로",
    "Every release, one living picture": "모든 릴리스를 살아 있는 하나의 그림으로",
    "Risk across the whole slate": "전체 물량의 리스크를 한눈에",
    "Controls, deployment, scale": "통제, 배포, 확장",
    "Why we built Team": "Team을 만든 이유",
  },
};

/**
 * Product module names that stay English in every locale, deliberately.
 *
 * Listed rather than merely omitted so the coverage check can tell "decided to
 * keep" apart from "forgot" — an absent key would otherwise be indistinguishable
 * from an oversight, which is how the one-entry table survived this long.
 */
export const CHROME_KEEP_EN: ReadonlySet<string> = new Set([
  "Rollouts",
  "TeamMate",
  "Assets",
  "Connections",
  "Tours",
  "Pro", // plan name, matches the pricing page
]);
