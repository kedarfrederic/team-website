import type { CopyMap } from "../koLocalize";
import { KO_HOMEPAGE_COPY } from "../koHomepageCopy";

/**
 * Korean copy for /about.
 *
 * The page embeds the SAME product mock as the homepage — roughly 70 of its
 * 110 text nodes are byte-identical, from "HOME / AVA NORTH / MIDNIGHT STATIC"
 * through the whole timeline board and TeamMate exchange. Those are composed in
 * from KO_HOMEPAGE_COPY rather than retyped, for the same reason
 * src/lib/ko/appPreview.ts exists: the identical mock must not acquire two
 * different Korean translations, which is what happens the first time someone
 * edits one page and not the other.
 *
 * Only the entries below are genuinely this page's own. Spread order matters —
 * page-specific keys come last so they win any collision.
 */
const ABOUT_ONLY: CopyMap = {
  // ── hero ──
  "Music runs on releases.": "음악은 릴리스로 움직입니다.",
  "And releases run on": "그리고 릴리스는",
  "chaos.": "혼돈으로 움직입니다.",
  "We started Team because the most important work in music, getting a release out into the world, still runs on a mess of tools, threads, and one person's memory. We think it deserves a brain.":
    "음악에서 가장 중요한 일 — 릴리스를 세상에 내보내는 일 — 이 여전히 뒤엉킨 도구와 대화, 그리고 한 사람의 기억에 의존하고 있었기에 Team을 시작했습니다. 그 일에는 브레인이 필요하다고 믿습니다.",
  "Read our story": "우리의 이야기 읽기",

  // ── the problem ──
  "Every release is": "모든 릴리스는",
  "a small operation.": "하나의 작은 프로젝트이자 운영 조직입니다.",
  "A dozen tools. Twice as many hands. Masters in one folder, approvals buried in a thread, the budget in a sheet, the plan in someone's head. The context that decides whether a release goes well lives everywhere, and nowhere at once.":
    "열 개가 넘는 도구, 그 두 배의 사람. 마스터는 한 폴더에, 승인은 대화 속에 묻혀 있고, 예산은 시트에, 계획은 누군가의 머릿속에 있습니다. 릴리스의 성패를 가르는 맥락이 어디에나 있으면서 동시에 어디에도 없습니다.",
  "And somehow, one person is expected to hold all of it together. Until they take a week off, and it turns out they were the system.":
    "그런데도 한 사람이 이 모든 흐름을 연결해야 합니다. 그 사람이 일주일 자리를 비우고 나서야, 실제로는 그 사람이 시스템 역할을 해왔다는 사실이 드러납니다.",
  "The tools were never the problem.": "문제는 도구가 아니었습니다.",
  "The gaps between them were.": "도구 사이의 틈이었습니다.",

  // ── beliefs ──
  "A few things": "우리가 믿는",
  "we believe.": "몇 가지.",
  "Your stack isn't broken. You shouldn't have to": "당신의 스택은 고장 나지 않았습니다. 정리하기 위해",
  "leave it": "그것을 떠날",
  "to get organized.": "필요는 없습니다.",
  "Holding the context should be the": "맥락을 붙잡는 일은",
  "software's job": "소프트웨어의 몫",
  ", not yours.": "이지, 당신의 몫이 아닙니다.",
  "AI should work": "AI는 당신을",
  "for you": "위해 일해야",
  ", and never train": "하며, 결코 당신을",
  "on": "학습해서는",
  "you.": "안 됩니다.",
  "The answer to \"where do we actually stand?\" should always be":
    "‘지금 우리는 어디쯤인가’에 대한 답은 언제나",
  "one question away.": "질문 하나 거리에 있어야 합니다.",

  // ── so we built team ──
  "So we built": "그래서 우리는",
  "Team.": "Team을 만들었습니다.",
  "One operational brain for a release. It connects the tools you already use, reasons across all of them, and does the work, so nothing falls through the cracks and nothing lives in one person's head. We're building the operating system for music releases, starting at the moment everything converges.":
    "릴리스를 위한 하나의 운영 브레인입니다. 이미 쓰는 도구를 연결하고, 그 전부를 종합해 추론하고, 실제로 실행합니다. 그래서 놓치는 것도, 한 사람의 머릿속에만 남는 것도 없습니다. 우리는 모든 것이 한데 모이는 그 지점에서 시작해, 음악 릴리스를 위한 운영 체제를 만들고 있습니다.",
  "See how it works": "작동 방식 보기",

  // ── built in the open ──
  "Built in the open,": "업계와 함께,",
  "with the industry.": "열린 방식으로.",
  "Team is early, and in beta with the artists, managers, and labels who live this every day. We're building it with them, not for a boardroom. The people shaping it now are setting how the next decade of releases will run.":
    "Team은 초기 단계이며, 이 일을 매일 겪는 아티스트와 매니저, 레이블과 함께 베타를 진행하고 있습니다. 회의실을 위해서가 아니라 그들과 함께 만들고 있습니다. 지금 참여하는 분들이 앞으로 10년의 릴리스 방식을 정하게 됩니다.",
  "If that sounds like you, come help build it.": "그런 분이라면, 함께 만들어 주세요.",
  "Early access · in beta": "얼리 액세스 · 베타",

  // ── final CTA ──
  "Discover your new brain": "음악 운영을 위한",
  "for music operations.": "새로운 브레인을 만나보세요.",
  "Start for free, shape the product, and set the standard for how releases run. We'd love to build it with you.":
    "무료로 시작해 제품을 함께 만들고, 릴리스 운영의 기준을 세워 주세요. 함께 만들고 싶습니다.",
  "Sign up free": "무료로 시작하기",
  "Get a demo": "데모 요청하기",
};

/**
 * The shared product mock first, this page's own copy second — so a key
 * defined in both resolves to the about-page version.
 */
export const KO_ABOUT: CopyMap = { ...KO_HOMEPAGE_COPY, ...ABOUT_ONLY };
