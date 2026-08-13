import type { CopyMap } from "../koLocalize";

/**
 * Korean copy for the 404 page.
 *
 * This one is not like the other page maps. Every other Korean page is a route
 * that exists; 404.astro renders for any path that DOESN'T, including paths
 * under /ko that were never real. So the reader arriving here is, by
 * definition, already somewhere unexpected — the copy's job is to say what
 * happened and give them a way out, not to be clever.
 *
 * The English headline is a pun ("took a different rollout"). The Korean keeps
 * the shape — the <em> falls on the second half either way — without forcing
 * the wordplay, which in Korean would land as a translation of a joke rather
 * than a joke.
 *
 * The link list is deliberately NOT translated here for /insights: that page
 * has no Korean version, so localizeHrefs leaves the href English and the label
 * follows it. Same rule as the nav and footer.
 */
export const KO_NOT_FOUND: CopyMap = {
  "Error 404": "404 오류",

  // <h1>This page took a <em>different rollout.</em></h1>
  "This page took a": "이 페이지는",
  "different rollout.": "다른 롤아웃을 탔습니다.",

  "The link's broken or the page has moved. Let's get you back to something that ships.":
    "링크가 깨졌거나 페이지가 옮겨졌습니다. 실제로 출시되는 곳으로 다시 안내해 드릴게요.",

  "Back to home": "홈으로 돌아가기",
  "See pricing": "가격 보기",

  /* These match the nav and footer labels for the same destinations — see
     src/lib/ko/chrome.ts. A reader who has just hit a dead end should not also
     have to work out that "롤아웃" here and "Rollouts" in the nav above are the
     same place. "Insights" stays English because /insights does. */
  Rollouts: "Rollouts",
  TeamMate: "TeamMate",
  Pricing: "가격",
  Insights: "Insights",
  About: "회사 소개",
  Contact: "문의하기",
};

/** aria-label on the popular-pages nav — an attribute, so the text pass cannot reach it. */
export const KO_NOT_FOUND_ATTRS: CopyMap = {
  "Popular pages": "많이 찾는 페이지",
};
