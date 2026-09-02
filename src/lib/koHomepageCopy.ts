/**
 * Korean copy for the v2 homepage, as a text-node map.
 *
 * WHY A MAP RATHER THAN A TRANSLATED COPY OF THE HTML.
 *
 * homepage-v2-body.html is 43KB of hand-tuned markup whose classes, ids and
 * data attributes are load-bearing for the scroll choreography — the animation
 * queries them. Duplicating it per locale would mean every future markup change
 * has to be made twice, correctly, forever, with nothing to catch it when the
 * two drift. Instead the English body stays the single source of structure and
 * this map supplies only the words. Anything absent from the map renders in
 * English, so a partial translation degrades to mixed rather than to blank.
 *
 * It is also the artifact a native reviewer actually wants: English and Korean
 * side by side, no markup in the way. Review this file, not the HTML.
 *
 * DELIBERATELY NOT TRANSLATED, so they are simply absent below:
 *  - Third-party product names (Dropbox, Slack, Notion, Sheets, Gmail, Drive,
 *    Trello, Docs, Monday, Asana, Zoom, Teams, Believe, BMI, Calendar).
 *  - Our own module names, matching the Korean pricing page, which keeps
 *    Rollouts / Assets / Connections / Tours / TeamMate / Pro in English.
 *  - Filenames, paths, channel names, dates, numbers and HTML entities
 *    (&middot;, &nbsp;, WED, JUN, d/h/m/s) — structure, not copy.
 *  - The {{V2_*}} Sanity tokens, which are substituted before this runs.
 *
 * Register a key exactly as it appears as a text node, trimmed. `localizeBody`
 * matches on the trimmed text between two tags, so a key that never appears is
 * silently inert — `pnpm check:i18n` reports orphans rather than letting them
 * accumulate.
 */

/* localizeBody / localizeHrefs moved to ./koLocalize when the product pages
   needed the same pair. Re-exported here so the homepage's call sites — and
   scripts/check-i18n.ts, which greps for a localizeHrefs CALL — keep working
   from one import. */
export { localizeBody, localizeHrefs, localizePage } from "./koLocalize";

export const KO_HOMEPAGE_COPY: Readonly<Record<string, string>> = {
  // ── document + capsule narrator ──
  "Operational Intelligence for Music Releases": "음악 릴리스를 위한 운영 인텔리전스",
  "Overture": "서곡",
  "Sign up free": "무료로 시작하기",
  "The idea": "아이디어",
  "How it works": "작동 방식",
  "Who it's for": "누구를 위한 도구인가",
  "Intelligence for music releases": "음악 릴리스를 위한 인텔리전스",

  // ── hero ──
  "Meet Team.": "Team을 만나보세요.",
  "A": "음악 운영을 위한",
  "brain": "브레인",
  "for music operations.": "",
  "Team connects the systems your music operation already runs on,":
    "Team은 이미 사용 중인 음악 운영 시스템을 연결하여,",
  "turning every tool, file, message, plan, and data point into one living intelligence layer.":
    "모든 도구와 파일, 메시지, 계획, 데이터를 하나의 살아 있는 인텔리전스 레이어로 만듭니다.",
  "Book a walkthrough": "데모 예약하기",
  "Team remembers the history, reasons across everything your operation runs on,":
    "Team은 지난 기록을 기억하고, 운영 전반을 종합해 추론하며,",
  "and shows you what changed, what matters, and what to do next.":
    "무엇이 달라졌고, 무엇이 중요하며, 다음에 무엇을 해야 하는지 보여줍니다.",
  "just now": "방금 전",
  "Show me on the board": "보드에서 보기",

  // ── act: the problem ──
  "Music businesses don’t run on": "음악 비즈니스는 하나의 도구로",
  "one tool.": "돌아가지 않습니다.",
  "The master": "마스터",
  "The artwork": "아트워크",
  "The budget": "예산",
  "The plan": "계획",
  "The conversation": "대화",
  "And, somehow, one person who remembers everything…":
    "그리고 어쩐지, 모든 것을 기억하는 단 한 사람…",
  "until they’re on vacation.": "그 사람이 휴가를 떠나기 전까지는.",
  "The truth lives": "진실은",
  "everywhere": "어디에나 있고",
  "and": "동시에",
  "nowhere": "어디에도 없습니다",

  // ── the scatter: tool cards ──
  "3 versions older than the email thread": "이메일 스레드보다 3개 버전 뒤처짐",
  "“which master is final-final?”": "“진짜 최종 마스터가 어느 거죠?”",
  "Nobody is sure": "아무도 확신하지 못함",
  "A duplicate of the Dropbox file": "Dropbox 파일과 중복",
  "“is the v10 bounce in yet?”": "“v10 바운스 들어왔나요?”",
  "#audio · no reply": "#audio · 답변 없음",
  "Still unapproved": "아직 승인되지 않음",
  "“Wait, is that the final artwork?”": "“잠깐, 저게 최종 아트워크인가요?”",
  "#design · unanswered": "#design · 답변 없음",
  "Artwork — Awaiting approval": "아트워크 — 승인 대기 중",
  "Card untouched for 9 days": "9일째 변동 없음",
  "Re: cover art notes": "Re: 커버 아트 피드백",
  "Feedback was on v5, not v7": "피드백 대상은 v7이 아니라 v5",
  "Budget — $2,500 →": "예산 — $2,500 →",
  "Edited 14:02 · nobody was told": "14:02 수정 · 아무에게도 공유되지 않음",
  "One-sheet still shows $2,500": "원시트에는 아직 $2,500로 표시",
  "Out of date since 14:02": "14:02부터 최신 상태 아님",
  "Budget notes — video shoot": "예산 메모 — 비디오 촬영",
  "Contradicts the sheet by $600": "시트와 $600 차이",
  "Never added to the sheet": "시트에 반영된 적 없음",
  "Q3 royalty statement posted": "3분기 로열티 명세서 게시됨",
  "Splits don't match the sheet — 2 writers missing":
    "분배 비율이 시트와 불일치 — 작가 2명 누락",
  "Rollout plan / Week 3": "롤아웃 계획 / 3주차",
  "41 blocks · last synced never": "41개 블록 · 동기화된 적 없음",
  "Release board — 6 overdue": "릴리스 보드 — 6건 기한 초과",
  "3 duplicates of the Notion plan": "Notion 계획과 3건 중복",
  "Pitch playlists — due Fri": "플레이리스트 피칭 — 금요일 마감",
  "Unassigned": "담당자 없음",
  "Video shoot — Thu 14": "비디오 촬영 — 14일 목요일",
  "No call sheet attached": "콜시트 미첨부",
  "Delivery window closes Friday": "납품 마감 금요일",
  "Metadata incomplete · artwork still missing": "메타데이터 미완성 · 아트워크 누락",
  "“Who approved this?”": "“이건 누가 승인했나요?”",
  "#release-ops · 11:47pm": "#release-ops · 오후 11:47",
  "“Which deck has the DSP plan?”": "“DSP 계획은 어느 자료에 있나요?”",
  "Three decks say three things": "세 개의 자료가 각기 다른 내용",
  "Distributor call — 45:12": "유통사 미팅 — 45:12",
  "Actions live in someone's notebook": "결정 사항은 누군가의 노트에만 존재",
  "Re: Press embargo date?": "Re: 보도 엠바고 날짜?",
  "Unanswered · 3 days": "답변 없음 · 3일 경과",

  // ── the turn ──
  "Until now": "지금까지는",
  "Team is the": "Team은 음악 회사와 아티스트 팀, 그리고 현대 음악 비즈니스를 위한",
  "operational brain": "운영 브레인입니다.",
  "for music companies, artist teams, and modern music businesses.":
    "",

  // ── product mock chrome ──
  "+ RELEASE": "+ 릴리스",
  "1 ONLINE &middot; JUST YOU": "1명 접속 중 &middot; 나만",
  "SHARE": "공유",
  "RELEASE": "릴리스",
  "+ NEW RELEASE": "+ 새 릴리스",
  "ARTIST": "아티스트",
  "Home": "홈",
  "Artist DNA": "아티스트 DNA",
  /* Same sidebar, same mock. "홈 / 아티스트 DNA / Assets / Intelligence" had two
     of four in Korean — found by sweeping for text a sibling page already
     translates. In here rather than in a shared map because this is the app's
     own navigation in a product mock, not the marketing module names, which
     stay English in the site nav on purpose (CHROME_KEEP_EN). The mobile nav's
     "Assets" a few lines away in the same HTML is that other thing, and stays. */
  "Assets": "에셋",
  "Intelligence": "인텔리전스",
  "Connectors": "커넥터",
  "Touring": "투어",
  "Timeline": "타임라인",
  "Strategy": "전략",
  "Research": "리서치",
  "Tracks": "트랙",
  "Territories": "지역",
  "DSP Priorities": "DSP 우선순위",
  "Budget": "예산",
  "Ready to Roll": "준비 완료",
  "TIMELINE &middot; 3 TASKS &middot; RELEASE 18 SEPT":
    "타임라인 &middot; 작업 3건 &middot; 릴리스 9월 18일",
  "drops in": "출시까지",
  "SEARCH TASK": "작업 검색",
  "TODAY": "오늘",
  "RELEASE &middot; SEP 18": "릴리스 &middot; 9월 18일",
  "STACKS &middot; 1": "스택 &middot; 1",
  "ACTUAL": "실제",
  "STACKED WITH:": "함께 묶임:",
  "&middot; ACTUAL DATES": "&middot; 실제 날짜",
  "ACTIVE &middot; SOON": "진행 중 &middot; 임박",
  "Pitch to Country Editorial Playlists": "컨트리 에디토리얼 플레이리스트 피칭",
  "MARKETING": "마케팅",
  "Pitch to Faith Editorial Playlists": "종교 음악 에디토리얼 플레이리스트 피칭",
  "Final Pre-Save Push: Email + Social Blast (48 Hours&hellip;)":
    "최종 프리세이브 푸시: 이메일 + 소셜 확산 (48시간&hellip;)",
  "+ ADD TASK": "+ 작업 추가",
  "&#9679; RELEASE": "&#9679; 릴리스",
  "RELEASE DAY: Convert Pre-Save Link to Streaming&hellip;":
    "릴리스 당일: 프리세이브 링크를 스트리밍으로 전환&hellip;",
  "RELEASE DAY: Post Announcement Content&hellip;": "릴리스 당일: 공지 콘텐츠 게시&hellip;",
  "SOCIAL": "소셜",
  "Research &amp; Shortlist Intimate Venues (50&ndash;150&hellip;)":
    "소규모 공연장 리서치 및 후보 선정 (50&ndash;150&hellip;)",
  "OTHER": "기타",
  "on Timeline": "타임라인에서",
  "NEW": "신규",
  "Want me to build out a full task plan that assigns this $17,500 across the remaining categories with dates and owners?":
    "남은 항목에 $17,500를 배분하고 날짜와 담당자를 지정한 전체 작업 계획을 만들어 드릴까요?",
  "&#9638; SHOW ME ON THE BOARD": "&#9638; 보드에서 보기",
  "12:50 &middot; YOU": "12:50 &middot; 나",
  "What's worked for Ava on previous releases?": "이전 릴리스에서 Ava에게 효과적이었던 건 무엇인가요?",
  "Let me pull the remaining documents on Ava's history.":
    "Ava의 지난 기록에서 남은 문서를 불러오겠습니다.",
  "ASK ABOUT TIMELINE&hellip;": "타임라인에 대해 물어보세요&hellip;",
  "FEED THE BRAIN &middot; 7 DOCS &middot; 18 DONE TODAY":
    "브레인에 학습시키기 &middot; 문서 7건 &middot; 오늘 18건 완료",

  // ── act: the whole picture ──
  "Team holds": "Team은",
  "the whole picture.": "전체 그림을 파악합니다.",
  "It remembers the history, reads what’s happening now, and connects it across every tool you run on — so you see what changed, what matters, and what to do next. One picture, across every artist, release, budget and decision.":
    "지난 기록을 기억하고 지금 벌어지는 일을 읽어, 사용 중인 모든 도구의 정보를 연결합니다. 무엇이 달라졌고 무엇이 중요하며 다음에 무엇을 해야 하는지 한눈에 보여줍니다. 모든 아티스트와 릴리스, 예산과 의사결정을 하나의 화면에서 확인할 수 있습니다.",
  "Change detected": "변경 감지",
  "Marketing budget": "마케팅 예산",
  ". Your one-sheet and Notion plan still show the old figure.":
    ". 원시트와 Notion 계획에는 아직 이전 금액이 표시되어 있습니다.",
  "source · Sheets, row 14 — 14:02": "출처 · Sheets 14행 — 14:02",
  "Timeline risk": "일정 리스크",
  "Vinyl lead time is": "바이닐 제작 기간은",
  "11 weeks": "11주",
  ". Street date is 9 weeks out. Flagging before the PO is placed.":
    ". 발매일까지는 9주 남았습니다. 발주 전에 알려드립니다.",
  "source · PO #1042 + release timeline": "출처 · 발주 #1042 + 릴리스 일정",
  "Signal": "시그널",
  "Pre-save velocity": "티저 공개 후 프리세이브 증가 속도가",
  "doubled": "두 배가",
  "since the teaser posted. Worth moving the playlist pitch up.":
    "되었습니다. 플레이리스트 피칭을 앞당길 만합니다.",
  "source · DSP feed, last 48h": "출처 · DSP 피드, 최근 48시간",
  "Connected": "연결됨",
  "A distributor's Slack reply just cleared the metadata question":
    "유통사의 Slack 답변으로 금요일 납품을 막고 있던",
  "blocking Friday's delivery": "메타데이터 문제가 해결되었습니다",
  "— linked to the task automatically.": "— 해당 작업에 자동으로 연결했습니다.",
  "source · Slack #distro → Ready to Roll": "출처 · Slack #distro → 준비 완료",

  // ── act: it does the work ──
  "Then it": "그리고",
  "does the work.": "실행합니다.",
  "Timelines re-cut. Budgets synced everywhere. The missing master chased. Whatever the update, Team provides receipts for all of it, and makes sure only the actions that need a human reach you.":
    "일정을 다시 짜고, 예산을 모든 곳에 동기화하고, 빠진 마스터를 챙깁니다. 어떤 변경이든 Team은 근거를 함께 남기고, 사람의 판단이 필요한 일만 전달합니다.",
  "Overnight — while you slept": "밤사이 — 잠든 동안",
  "Re-cut release timeline around the new street date":
    "새 발매일에 맞춰 릴리스 일정을 다시 구성했습니다",
  "done": "완료",
  "Updated budget in Notion + one-sheet": "Notion과 원시트의 예산을 업데이트했습니다",
  "(source: Sheets)": "(출처: Sheets)",
  "Re-briefed press list on the new embargo date":
    "새 엠바고 날짜를 언론 리스트에 다시 안내했습니다",
  "Vinyl PO #1042 needs your sign-off before Friday":
    "바이닐 발주 #1042는 금요일 전에 승인이 필요합니다",
  "needs you": "확인 필요",
  "Morning. Four things moved overnight — I handled three. The vinyl PO needs your call before Friday.":
    "좋은 아침입니다. 밤사이 네 가지가 진행됐고 그중 셋은 처리했습니다. 바이닐 발주는 금요일 전에 결정이 필요합니다.",
  "Open the morning brief": "모닝 브리프 열기",

  // ── act: the difference ──
  "AI chat tools": "AI 채팅 도구는",
  "answer.": "답변합니다.",
  "understands.": "이해합니다.",
  "So instead of digging through six tools to prove something everyone vaguely remembers, you can just ask Team.":
    "모두가 어렴풋이 기억하는 사실을 확인하려고 여섯 개 도구를 뒤질 필요 없이, Team에 물어보면 됩니다.",
  "Generic AI chat": "일반 AI 채팅",
  "New session": "새 세션",
  "No memory · Resets every session · Sees only what you paste":
    "기억 없음 · 세션마다 초기화 · 붙여넣은 것만 인식",
  "Inside your operation": "운영 내부에서",
  "Tools": "도구",
  "History": "기록",
  "9 versions · 3 threads · 14 decisions": "버전 9개 · 스레드 3개 · 의사결정 14건",
  "People": "사람",
  "Mix: Maya · A&amp;R: Theo · Distro: Sam": "믹스: Maya · A&amp;R: Theo · 유통: Sam",
  "Money": "비용",
  "Vinyl PO · shoot budget · splits": "바이닐 발주 · 촬영 예산 · 분배",
  "Dates": "일정",
  "Embargo Fri · launch t–9w": "엠바고 금요일 · 발매 D-9주",
  "Approved by Maya in #audio on Tuesday.\n              The one-sheet and distributor brief already reference it. I re-briefed both when it landed at 23:41.":
    "화요일 #audio에서 Maya가 승인했습니다.\n              원시트와 유통사 브리프에 이미 반영되어 있으며, 23:41에 도착했을 때 두 문서 모두 다시 정리했습니다.",
  "One-sheet ✓": "원시트 ✓",
  "Distro brief ✓": "유통사 브리프 ✓",
  "Built-in memory · Whole-business context · Already working":
    "내장 메모리 · 비즈니스 전체 맥락 · 이미 작동 중",
  "TeamMate is available on": "TeamMate는 다음 플랜에서 제공됩니다:",

  // ── act: connect everything ──
  "Replace nothing.": "무엇도 교체하지 않고,",
  "Connect": "모두",
  "everything.": "연결합니다.",
  "Team brings together the context that usually lives everywhere and nowhere at the same time: artist strategy, campaign planning, release history, DSP priorities, budgets, approvals, performance data, partner conversations, and the decisions people swear they remember accurately.":
    "Team은 보통 어디에나 있으면서 동시에 어디에도 없는 맥락을 한데 모읍니다. 아티스트 전략, 캠페인 기획, 릴리스 기록, DSP 우선순위, 예산, 승인, 성과 데이터, 파트너와의 대화, 그리고 모두가 정확히 기억한다고 확신하는 의사결정까지.",
  "So you keep using all your existing tools, exactly like you do today.":
    "지금 쓰던 도구를 그대로, 지금처럼 계속 사용하면 됩니다.",
  "Nothing to migrate": "데이터를 옮길 필요 없음",
  "Nothing to rip out": "기존 툴을 제거할 필요 없음",
  "No new software to learn": "새로 배울 소프트웨어 없음",
  "View all connections": "모든 연동 보기",
  "DOCS": "문서",
  "PM TOOLS": "PM 도구",
  "EMAIL": "이메일",
  "DISTRIBUTORS": "유통사",
  "CHAT TOOLS": "채팅 도구",
  "CALENDARS": "캘린더",

  // ── act: while you slept ──
  "It's 02:43am.": "새벽 2시 43분입니다.",
  "The video budget doubles in Sheets.": "Sheets에서 비디오 예산이 두 배가 됩니다.",
  "Now the one-sheet, the plan and the PO are all wrong.":
    "이제 원시트도, 계획도, 발주서도 모두 어긋납니다.",
  "Team re-cuts everything.": "Team이 전부 다시 맞춥니다.",
  "All while you": "당신이 잠든",
  "slept.": "사이에.",

  // ── act: who it's for ──
  "Designed for the people": "릴리스를 실제로 운영하는",
  "who run releases.": "사람들을 위해.",
  "Music businesses don’t run on one tool. They run on ‘I think it’s in the deck.’":
    "음악 비즈니스는 하나의 도구로 돌아가지 않습니다. ‘아마 그 자료에 있을 거예요’로 돌아갑니다.",
  "Solo": "솔로",
  "Artists": "아티스트",
  "Make the record. Team runs the rollout.": "음악을 만드세요. 롤아웃은 Team이 운영합니다.",
  "Stay across every moving part of your release without living in the admin of it.":
    "관리 업무에 파묻히지 않고도 릴리스의 모든 흐름을 파악하세요.",
  "Artist": "아티스트",
  "managers": "매니저",
  "The roster runs while you're on the road.": "이동 중에도 로스터는 계속 굴러갑니다.",
  "Ops keep moving between flights, calls and shows. You get the three things that actually need you.":
    "비행과 통화, 공연 중에도 운영은 계속됩니다. 정말로 당신의 판단이 필요한 딱 세 가지만 전달합니다.",
  "Indie &amp;": "인디 &amp;",
  "major labels": "메이저 레이블",
  "Every artist, every release — one picture.": "모든 아티스트, 모든 릴리스를 하나의 그림으로.",
  "See how the whole slate ties together: what's working, what's slipping, where to double down next.":
    "전체 릴리스 라인업이 어떻게 맞물리는지 확인하세요. 잘 되고 있는 것, 지연 되는 것, 다음으로 어디에 더 집중할지 한눈에 볼 수 있습니다.",
  "Distributors &amp;": "유통사 &amp;",
  "partners": "파트너",
  "Scale without the spreadsheet sprawl.": "스프레드시트를 늘리지 않고 확장하세요.",
  "Hundreds of releases, one reasoning layer across every partner, pipeline and deadline.":
    "수백 건의 릴리스를 하나의 인텔리전스 레이어로 연결해, 모든 파트너와 파이프라인, 마감을 함께 관리합니다.",

  // ── act: the credo ──
  "Not another tool.": "또 하나의 도구가 아니라,",
  "The": "그 사이를 잇는",
  "intelligence": "인텔리전스",
  "between them.": "입니다.",
  "Everything you already use keeps working. Team is the layer underneath — watching, reasoning, acting — so the stack finally behaves like one system.":
    "지금 쓰는 모든 것이 그대로 작동합니다. Team은 그 아래에서 지켜보고, 추론하고, 실행하는 레이어입니다. 그래서 흩어진 도구들이 마침내 하나의 시스템처럼 움직입니다.",
  "by design": "의도적으로",
  "Another dashboard to check": "확인해야 할 또 하나의 대시보드",
  "Another tab to keep open": "열어둬야 할 또 하나의 탭",
  "Another system to migrate to": "옮겨가야 할 또 하나의 시스템",
  "Another login to forget": "잊어버릴 또 하나의 로그인",
  "One layer that connects them all —": "그 모두를 잇는 하나의 레이어 —",

  // ── footer ──
  "© 2026 Team Rollouts": "© 2026 Team Rollouts",
};

/** Attributes that carry user-visible text and therefore need translating. */
export const KO_HOMEPAGE_ATTRS: Readonly<Record<string, string>> = {
  "Page": "페이지",
  "Menu": "메뉴",
  "Team interface preview": "Team 인터페이스 미리보기",
  "Your tools connected to one core": "하나의 코어에 연결된 도구들",
};
