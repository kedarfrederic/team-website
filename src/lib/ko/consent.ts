/**
 * PIPA consent — the Korean consent flow is a different FLOW, not a translation.
 *
 * The existing banner is a competent GDPR banner: categories, toggles, reject as
 * prominent as accept, real withdrawal. Translating its words into Korean would
 * produce a Korean-language GDPR banner, which is not a PIPA consent. The Act
 * requires things the GDPR shape simply has nowhere to put:
 *
 *  1. ITEMISED CONSENT. Each purpose must state three specific things — what it
 *     is for (수집·이용 목적), exactly what is collected (수집 항목), and how long
 *     it is kept (보유·이용 기간). "Analytics — which pages get used" states the
 *     first and neither of the others.
 *
 *  2. OVERSEAS TRANSFER IS ITS OWN BASIS. Consent to analytics is not consent to
 *     send the data abroad; PIPA treats 국외 이전 as a separate disclosure and a
 *     separate agreement, naming the recipient, the country, what is sent, how,
 *     how long it is held, and the right to say no. This site sends to
 *     us.i.posthog.com — the United States — so the transfer is not incidental,
 *     it is the whole mechanism.
 *
 *  3. REFUSAL MUST BE FREE, AND SAID TO BE. Optional consent cannot be a
 *     condition of service, and the consequence of refusing has to be stated
 *     rather than implied by a greyed-out button.
 *
 * WHAT IS ASSERTED HERE IS WHAT THE CODE ACTUALLY DOES. The recipient, endpoint
 * and collected items were read out of the PostHog init in BaseLayout.astro
 * (autocapture, capture_pageview, capture_pageleave, api_host us.i.posthog.com),
 * not assumed from what a marketing site usually does. A consent notice
 * describing collection that does not happen is as wrong as one omitting
 * collection that does — and this one is shown to people who can act on it.
 *
 * The retention figures are the cookie lifetimes this repo sets, stated as such.
 * PostHog's own server-side retention is a setting in their project console
 * that I cannot read from here; it is an owner item, flagged in check:i18n and
 * in the partner questions rather than guessed at.
 *
 * NOT A SUBSTITUTE FOR THE PRIVACY POLICY. PIPA requires a 개인정보처리방침
 * drafted for Korea; a translated global policy is explicitly insufficient.
 * That is counsel work (task #15). This covers the consent moment only.
 */

export type ConsentItem = {
  /** Cookie key. `necessary` has no toggle. */
  readonly key: "necessary" | "analytics" | "marketing";
  readonly title: string;
  /** 수집·이용 목적 */
  readonly purpose: string;
  /** 수집 항목 */
  readonly items: string;
  /** 보유·이용 기간 */
  readonly retention: string;
  /** Optional consent may be refused with no loss of service. */
  readonly optional: boolean;
};

export const KO_CONSENT_ITEMS: readonly ConsentItem[] = [
  {
    key: "necessary",
    title: "필수",
    purpose: "로그인 세션 유지 및 보안(CSRF 방지), 동의 내역 저장",
    items: "세션 식별자, CSRF 토큰, 동의 기록",
    retention: "세션 종료 시까지(동의 기록은 180일)",
    optional: false,
  },
  {
    key: "analytics",
    title: "분석",
    purpose: "웹사이트 이용 현황 분석 및 개선",
    items: "IP 주소, 방문 페이지 주소, 브라우저·기기 정보, 사이트 내 클릭·이동 기록",
    retention: "쿠키 최대 180일 또는 동의 철회 시까지",
    optional: true,
  },
  {
    key: "marketing",
    title: "광고",
    purpose: "광고 성과 측정 (teamrollouts.com 도메인의 Team 서비스 전반에 적용)",
    items: "IP 주소, 방문 페이지 주소, 광고 식별자",
    retention: "쿠키 최대 180일 또는 동의 철회 시까지",
    optional: true,
  },
];

/**
 * 개인정보 국외 이전 — PIPA 제28조의8.
 *
 * A separate agreement, not a footnote under analytics. Every field below is
 * required by the Act, which is why they are named individually rather than
 * summarised into a sentence.
 *
 * Google and Meta appear under 광고 rather than as current recipients from this
 * site: nothing marketing-related loads on these pages today (only PostHog
 * does). But the consent record is one cookie on .teamrollouts.com that the
 * Team app also reads, so agreeing here does govern them there. Saying so is
 * more accurate than either listing them as if this page loaded them or
 * omitting them as if consent stopped at the domain boundary.
 */
export const KO_OVERSEAS_TRANSFER = {
  title: "개인정보 국외 이전",
  recipients: [
    { name: "PostHog, Inc.", country: "미국", endpoint: "us.i.posthog.com", scope: "분석" },
    { name: "Google LLC", country: "미국", endpoint: "google-analytics.com", scope: "광고" },
    { name: "Meta Platforms, Inc.", country: "미국", endpoint: "facebook.com", scope: "광고" },
  ],
  method: "이용자가 동의한 시점부터, 서비스 이용 중 HTTPS를 통해 실시간 전송",
  items: "위 각 항목에 기재된 정보",
  retention: "각 항목의 보유 기간과 동일하며, 동의 철회 시 파기",
  /* Stated, not implied. Refusing here switches the optional items off and
     keeps them off — which is why the checkbox gates them in the UI rather than
     sitting beside them as a fourth independent choice. Analytics that cannot
     leave the country is analytics that cannot run at all here. */
  refusal:
    "국외 이전에 동의하지 않으실 수 있습니다. 동의하지 않으면 분석·광고 항목은 사용되지 않으며, 웹사이트 이용에는 아무런 제한이 없습니다.",
} as const;

export const KO_CONSENT_UI = {
  title: "개인정보 수집 및 이용 동의",
  intro:
    "Team은 서비스 운영에 필요한 최소한의 정보와, 동의하신 경우에 한해 분석·광고 정보를 수집합니다. 선택 항목은 동의하지 않으셔도 웹사이트를 그대로 이용하실 수 있습니다.",
  purposeLabel: "수집·이용 목적",
  itemsLabel: "수집 항목",
  retentionLabel: "보유·이용 기간",
  alwaysOn: "필수 항목 (동의 없이 처리)",
  acceptAll: "전체 동의",
  rejectAll: "선택 항목 거부",
  customise: "항목별 선택",
  save: "선택 저장",
  privacyLink: "개인정보처리방침",
  cookiesLink: "쿠키 안내",
} as const;
