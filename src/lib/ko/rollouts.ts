import type { CopyMap } from "../koLocalize";

/**
 * Korean copy for /rollouts, as a text-node map. See ../koLocalize.ts for how
 * it is applied and why the English body stays the source of structure.
 *
 * Terminology is deliberately consistent with the homepage and pricing maps:
 * product/module names (Rollouts, TeamMate, Tours, Connections, Assets, Pro)
 * stay English, while the in-product sidebar labels that are generic UI —
 * Timeline, Strategy, Budget and so on — are translated the same way they are
 * on the homepage. Two pages disagreeing about what "Timeline" is called reads
 * as two products.
 *
 * Fictional names (Midnight Static) and figures stay as they are.
 */
export const KO_ROLLOUTS: CopyMap = {
  // ── hero ──
  "Every release,": "모든 릴리스를",
  "run like": "캠페인처럼",
  "a campaign.": "운영하세요.",
  "Rollouts is the workspace where a release goes from idea to live — timeline, budget, tracks, artwork, territories and DSP pitches in one place, with a brain watching every moving part and handing you only the calls that need you.":
    "Rollouts는 아이디어에서 발매까지 릴리스가 완성되는 작업 공간입니다. 일정, 예산, 트랙, 아트워크, 지역, DSP 피칭을 한곳에 모으고, 브레인이 모든 움직임을 지켜보며 당신의 판단이 필요한 결정만 전달합니다.",
  "Start a release": "릴리스 시작하기",
  "See a rollout": "롤아웃 살펴보기",
  "Rollouts is free — bring your next release": "Rollouts는 무료입니다 — 다음 릴리스를 가져오세요",

  // ── one shape ──
  "A release is a dozen moving parts.": "릴리스는 수십 개의 움직이는 조각입니다.",
  "Give it one shape.": "하나의 형태로 만드세요.",
  "Masters, artwork, budget, the timeline, the pitch, the territories, the people. On most releases they live in ten tools and one person's head. A rollout puts every part in one workspace — so the whole release has a shape you can actually see.":
    "마스터, 아트워크, 예산, 일정, 피칭, 지역, 그리고 사람. 대부분의 릴리스에서 이 모든 것은 열 개의 도구와 한 사람의 머릿속에 흩어져 있습니다. 롤아웃은 모든 조각을 하나의 작업 공간에 모아, 릴리스 전체를 눈으로 볼 수 있는 형태로 만듭니다.",
  "Open a rollout and the whole release is right there": "롤아웃을 열면 릴리스 전체가 그 자리에",
  "Every task has a date, an owner and a dependency": "모든 작업에 날짜와 담당자, 선행 관계가",
  "The brain reads across all of it, all the time": "브레인이 그 모두를 언제나 읽고 있습니다",

  // ── product mock ──
  "Release workspace": "릴리스 작업 공간",
  "Live": "라이브",
  "The rollout": "롤아웃",
  "Home": "홈",
  "condensed": "요약",
  "Timeline": "타임라인",
  "Strategy": "전략",
  "Research": "리서치",
  "Tracks": "트랙",
  "Territories": "지역",
  "DSP Priorities": "DSP 우선순위",
  "Budget": "예산",
  "Ready to Roll": "준비 완료",

  // ── overnight ──
  "Your rollout,": "당신의 롤아웃을,",
  "condensed.": "한눈에.",
  "Open a rollout and TeamMate has already read the whole thing overnight. It handles what it safely can, flags what's slipping, and hands you the few decisions only you can make — like a release manager who never sleeps and never drops a thread.":
    "롤아웃을 열면 TeamMate가 밤사이 이미 전체를 읽어두었습니다. 안전하게 처리할 수 있는 일은 처리하고, 밀리고 있는 일은 표시하며, 오직 당신만 내릴 수 있는 몇 가지 결정만 전달합니다. 잠들지 않고, 어떤 흐름도 놓치지 않는 릴리스 매니저처럼.",
  "Meet the brain behind it": "그 뒤의 브레인 만나보기",
  "TeamMate reviewed the brain overnight —": "TeamMate가 밤사이 브레인을 검토했습니다 —",
  "1 thing needs your eyes today": "오늘 확인이 필요한 항목 1건",
  ", 6 are quietly slipping.": ", 6건이 조용히 밀리고 있습니다.",
  "Rollout pulse": "롤아웃 현황",

  // ── proposal ──
  "Review first · 1 proposal to review": "우선 검토 · 검토할 제안 1건",
  "Budget total: $0 → $200,000": "총예산: $0 → $200,000",
  "This budget change is material, so it needs your approval before it touches the plan — a 792% shift moves the baseline every guardrail measures against. Nothing has been applied. Approving runs the exact same verified write the agent would.":
    "이 예산 변경은 규모가 커서 계획에 반영되기 전에 승인이 필요합니다. 792% 변동은 모든 기준선을 함께 움직입니다. 아직 아무것도 적용되지 않았으며, 승인하시면 에이전트가 수행할 것과 동일한 검증된 작업이 실행됩니다.",
  "Update release": "릴리스 업데이트",
  "Dismiss": "닫기",
  "→ Timeline": "→ 타임라인",

  // ── what the brain noticed ──
  "What the brain noticed": "브레인이 발견한 것",
  "· Watch · sorted by urgency": "· 주시 중 · 시급도순",
  "99% of budget is in Advertising": "예산의 99%가 광고에 집중",
  "Most of your allocated spend sits in one category. Worth confirming that's intentional rather than spread across the full rollout — content, PR, distribution.":
    "배정된 지출 대부분이 한 항목에 몰려 있습니다. 콘텐츠, PR, 유통 등 롤아웃 전반에 분산하지 않고 이렇게 두는 것이 의도한 바인지 확인해 보세요.",
  "— Heads up: \"Assign a day-to-day release manager\" is 13 days overdue, and 5 others are behind. Want to knock out the overdue ones first?":
    "— 알려드립니다: ‘일상 릴리스 매니저 지정’이 13일 지연되었고, 다른 5건도 밀려 있습니다. 지연된 항목부터 처리할까요?",

  // ── everything in one workspace ──
  "Everything a release needs,": "릴리스에 필요한 모든 것을,",
  "in one workspace.": "하나의 작업 공간에.",
  "Not ten browser tabs and a spreadsheet. Every side of a rollout, joined up — and every one of them feeding the same brain.":
    "브라우저 탭 열 개와 스프레드시트가 아닙니다. 롤아웃의 모든 면이 서로 연결되고, 그 모두가 같은 브레인으로 모입니다.",
  "A real plan, with dates. Every task, dependency and deadline from announce to live — and TeamMate re-cuts it the moment the launch date moves.":
    "날짜가 있는 진짜 계획입니다. 공지부터 발매까지 모든 작업과 선행 관계, 마감을 담고, 발매일이 움직이는 순간 TeamMate가 일정을 다시 짭니다.",
  "Spend by category, tracked live. Material changes get flagged for your approval before they touch the plan — no surprise six-figure shifts.":
    "항목별 지출을 실시간으로 추적합니다. 규모가 큰 변경은 계획에 반영되기 전에 승인 요청으로 표시되므로, 예기치 못한 대규모 변동이 생기지 않습니다.",
  "Every track, master and credit in one source of truth — the version DSPs, metadata and the one-sheet all pull from, so \"which master is final?\" stops being a question.":
    "모든 트랙과 마스터, 크레딧을 하나의 원본으로 관리합니다. DSP와 메타데이터, 원시트가 모두 같은 버전을 참조하므로 ‘어느 마스터가 최종인가’를 더는 묻지 않게 됩니다.",
  "The creative library for the release: artwork, audio, video and links — release-ready and shareable, wired straight into the rollout.":
    "릴리스를 위한 크리에이티브 라이브러리입니다. 아트워크, 오디오, 영상, 링크를 발매 가능한 상태로 공유하며, 롤아웃에 그대로 연결됩니다.",
  "Explore Assets →": "Assets 살펴보기 →",
  "Territories &amp; DSP priorities": "지역 &amp; DSP 우선순위",
  "Where it lands and where it's growing. Prioritise the markets that matter and line up the playlists and editorial that actually move the needle.":
    "어디에 닿고 어디에서 성장하는지 봅니다. 중요한 시장에 우선순위를 두고, 실제로 성과를 움직이는 플레이리스트와 에디토리얼을 준비하세요.",
  "The pre-flight check. Nothing ships until every box that matters is green — masters delivered, metadata clean, distributor confirmed, pitch out.":
    "최종 점검입니다. 마스터 전달, 메타데이터 정리, 유통사 확인, 피칭 발송 — 중요한 항목이 모두 초록불이 되기 전에는 아무것도 나가지 않습니다.",

  // ── beyond release ──
  "A rollout doesn't end": "롤아웃은 발매에서",
  "at release.": "끝나지 않습니다.",
  "The same brain that ran the campaign reads your whole catalog, remembers every decision, and carries into the road. One release becomes context for the next — and Rollouts is just where it starts.":
    "캠페인을 운영한 그 브레인이 카탈로그 전체를 읽고, 모든 결정을 기억하며, 투어까지 이어집니다. 하나의 릴리스가 다음 릴리스의 맥락이 되고, Rollouts는 그 시작점일 뿐입니다.",
  "Free, for every release you run": "당신이 운영하는 모든 릴리스에, 무료로",

  // ── related ──
  "Take the campaign to the road — routing, advancing, day sheets":
    "캠페인을 투어로 — 라우팅, 어드밴싱, 데이시트",
  "The intelligence working every rollout overnight": "밤사이 모든 롤아웃을 살피는 인텔리전스",
  "Bring the tools you already run on — the brain reads them":
    "이미 쓰는 도구를 그대로 — 브레인이 읽습니다",

  // ── final CTA ──
  "Run your next release": "다음 릴리스를",
  "on a rollout.": "롤아웃에서.",
  "Start a release — free": "릴리스 시작하기 — 무료",
  "Get a demo": "데모 요청하기",
};
