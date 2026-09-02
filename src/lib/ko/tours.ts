import type { CopyMap } from "../koLocalize";

/**
 * Korean copy for /tours. See ../koLocalize.ts for how it is applied.
 *
 * City names are translated (London → 런던) because a Korean reader reads them
 * as words, but VENUE names are not — O2 Academy Brixton and Paradiso are
 * proper nouns that a Korean touring professional would recognise in the
 * original and would struggle to place transliterated. Dates, figures and
 * status stamps in the mock stay as they are.
 */
export const KO_TOURS: CopyMap = {
  // ── hero ──
  "Take the rollout": "릴리스의 흐름을",
  "to the road.": "투어까지 이어가세요.",
  "Tours is where a release becomes a run of shows — build the routing, advance every date, run the day sheets, and hold the whole tour's holds, on-sales, guarantees and settlement in one place, with the same brain across all of it.":
    "Tours는 릴리스 운영을 공연 일정까지 이어주는 공간입니다. 이동 경로를 짜고, 각 공연의 사전 준비를 진행하고, 데이시트를 만들며, 홀드·티켓 오픈·개런티·정산을 한곳에서 관리합니다. 모든 과정에는 같은 브레인이 연결됩니다.",
  "Plan a tour": "투어 계획하기",
  "See the tour board": "투어 보드 살펴보기",
  "Available on Pro — plan your next run": "Pro에서 이용 가능 — 다음 투어를 계획하세요",

  // ── a hundred details ──
  "A tour is a hundred details": "투어에는 수많은 세부사항이",
  "that all move at once.": "동시에 움직입니다.",
  "Holds and offers, routing that has to make geographic sense, advances with every venue, day sheets the crew actually reads, guarantees and settlement. Tours holds all of it in one run — so a change in one place updates everywhere it touches.":
    "홀드와 오퍼, 지리적으로 말이 되어야 하는 라우팅, 공연장마다의 어드밴싱, 크루가 실제로 읽는 데이시트, 개런티와 정산. Tours는 이 모두를 하나의 투어로 묶어, 한 곳의 변경이 관련된 모든 곳에 반영되게 합니다.",
  "Route the run and see the efficiency score move": "라우팅을 짜면 효율 점수가 함께 움직입니다",
  "Advance a show and the day sheet writes itself": "공연을 어드밴싱하면 데이시트가 자동으로 작성됩니다",
  "The brain watches holds, on-sales and settlement": "브레인이 홀드와 티켓 오픈, 정산을 지켜봅니다",

  // ── board mock ──
  "Touring": "투어",
  "Planning": "계획 중",
  "Routing efficiency": "라우팅 효율",
  "Tightening the Berlin → Paris leg would cut 400 miles of backtracking and save a day off.":
    "베를린 → 파리 구간을 조정하면 640km의 우회를 줄이고 하루를 절약할 수 있습니다.",
  "Reroute?": "경로를 다시 짤까요?",
  "The whole run,": "투어 전체를",
  "one board.": "하나의 보드에서.",
  "Every show, its status, and the numbers that matter — confirmed, on-sale, sold, guaranteed. Open the builder to route it, advance a date, or pull a day sheet. The brain keeps the totals honest as the run fills in.":
    "모든 공연의 상태와 핵심 수치를 한눈에 확인합니다 — 확정 여부, 티켓 오픈, 판매 현황, 개런티까지. 빌더에서 경로를 조정하고, 공연 준비를 진행하고, 데이시트를 만들 수 있습니다. 투어 일정이 채워지는 동안 브레인이 전체 합계를 최신 상태로 유지합니다.",
  "Meet the brain behind it": "그 뒤의 브레인 만나보기",
  "On sale": "티켓 판매 중",
  "On sale · Autumn 2026": "티켓 판매 중 · 2026년 가을",
  "Tour": "투어",
  "Sep 12 — Nov 08, 2026 · 8 shows": "2026년 9월 12일 — 11월 8일 · 공연 8회",
  "Confirmed": "확정",
  "Tickets sold": "판매된 티켓",
  "Capacity": "수용 인원",
  "Guaranteed": "개런티",
  "Routing": "라우팅",
  "Open builder": "빌더 열기",
  "Advance": "어드밴싱",
  "Day sheets": "데이시트",
  "The routing": "라우팅",
  "London": "런던",
  "Paris": "파리",
  "Berlin": "베를린",
  "Offer out": "오퍼 발송",
  "Amsterdam": "암스테르담",
  "Lagos": "라고스",
  "Hold": "홀드",

  // ── every side ──
  "Every side of the run,": "투어의 모든 면을,",
  "in one workspace.": "하나의 작업 공간에.",
  "From the first hold to the final settlement — joined up, and feeding the same brain that ran the release.":
    "첫 홀드부터 최종 정산까지 하나로 이어지고, 릴리스를 운영한 그 브레인으로 모입니다.",
  "Build a run that makes geographic and financial sense. A routing-efficiency score flags backtracking and dead days before they cost you a guarantee.":
    "지리적·재무적으로 효율적인 투어 경로를 만드세요. 라우팅 효율 점수가 불필요한 우회와 휴식일을 찾아 비용 손실이 생기기 전에 알려줍니다.",
  "Every venue's details, tech, hospitality and timings in one advance — so nothing gets asked twice and nothing shows up as a surprise on the day.":
    "공연장별 세부사항, 기술 요구사항, 호스피탈리티, 진행 시간을 하나의 사전 준비 화면에서 관리합니다. 같은 질문을 반복하지 않고 공연 당일의 돌발 상황을 줄일 수 있습니다.",
  "The crew's daily plan, generated from the advance — load-in, sound check, doors, set time, contacts — and always current when the plan changes.":
    "공연 사전 준비 내용을 바탕으로 크루의 일일 계획을 자동 생성합니다. 로드인, 사운드체크, 관객 입장, 공연 시작 시간, 연락처가 포함되며 계획이 바뀌면 바로 업데이트됩니다.",
  "Shows &amp; on-sales": "공연 &amp; 티켓 오픈",
  "Holds, offers, confirms and on-sales in one pipeline. Watch tickets and capacity fill in across the run, date by date.":
    "홀드와 오퍼, 확정, 티켓 오픈을 하나의 파이프라인에서 관리합니다. 투어 전체의 티켓과 수용 인원이 날짜별로 채워지는 것을 확인하세요.",
  "Guarantees &amp; settlement": "개런티 &amp; 정산",
  "Guarantees, expenses and settlement tracked per show and across the tour — so the money is as clear as the calendar.":
    "공연별 개런티, 비용, 정산 내역을 투어 전체와 함께 추적해 수익과 비용을 일정만큼 명확하게 관리합니다.",
  "A brain on the road": "투어를 함께 관리하는 브레인",
  "TeamMate watches the run overnight — a soft on-sale, a routing gap, a settlement that's late — and hands you the calls that need a human.":
    "TeamMate가 밤사이 투어를 지켜봅니다. 부진한 티켓 판매, 라우팅의 공백, 늦어지는 정산 — 그리고 사람의 판단이 필요한 결정만 전달합니다.",

  // ── same story ──
  "The road is part of": "투어도 결국",
  "the same story.": "같은 이야기입니다.",
  "The tour isn't a separate tool bolted on. It's the same brain that ran the release — it already knows the catalog, the audience and the markets, so the run starts from everything the rollout learned.":
    "투어는 따로 붙인 별개의 도구가 아닙니다. 릴리스를 운영한 그 브레인 그대로이며, 이미 카탈로그와 관객, 시장을 알고 있습니다. 그래서 투어는 롤아웃이 배운 모든 것에서 시작합니다.",
  "On Pro, for every tour you run": "Pro에서 운영하는 모든 투어를 관리하세요.",

  // ── related ──
  "Where the release campaign comes together first": "릴리스 캠페인이 처음 모이는 곳",
  "The intelligence working the run overnight": "밤사이 투어를 살피는 인텔리전스",
  "Ticketing, calendars and the tools you already use": "티켓팅, 캘린더 등 이미 쓰는 도구들",

  // ── final CTA ──
  "Put your next tour": "다음 투어를 하나의",
  "on the board.": "보드에서 관리하세요.",
  "Start a Pro free trial": "Pro 무료 체험 시작하기",
  "Get a demo": "데모 요청하기",
};
