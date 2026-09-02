import type { CopyMap } from "../koLocalize";

/**
 * Korean copy for /connections.
 *
 * This page needs TWO sources, unlike the other product pages: the body map
 * below, and KO_CONNECTIONS_JS for the connector directory, which
 * v2-connections.js renders at runtime and which therefore appears nowhere in
 * the body HTML. Translating only the body would leave a fully Korean page
 * wrapped around an English directory of 24 connectors.
 */
export const KO_CONNECTIONS: CopyMap = {
  // ── hero ──
  "Available on": "이용 가능 플랜:",
  "Connect the stack": "이미 쓰고 있는 스택을",
  "you already run on.": "그대로 연결하세요.",
  "Connections feed every file, message, plan and data point from the tools you already use into Team's brain — read across all of them, and written back. Nothing to migrate, nothing to rip out.":
    "Connections는 이미 사용 중인 도구의 파일, 메시지, 계획, 데이터를 Team의 브레인에 연결합니다. 모든 정보를 함께 읽고, 필요한 변경사항을 원래 도구에 다시 반영합니다. 데이터를 옮기거나 기존 도구를 제거할 필요가 없습니다.",
  "Get started": "시작하기",
  "See the catalog": "카탈로그 보기",

  // ── live wire ──
  "A connector isn't a checkbox.": "커넥터는 체크박스가 아니라,",
  "It's a live wire.": "살아 있는 회선입니다.",
  "Most tools let you export. Team stays connected. It watches each source in real time, reasons over what changed, and acts back inside your stack, with receipts.":
    "대부분의 도구는 내보내기를 제공합니다. Team은 연결된 상태를 유지합니다. 각 소스를 실시간으로 지켜보고, 무엇이 달라졌는지 추론하며, 근거와 함께 당신의 스택 안에서 다시 실행합니다.",
  "It reads, live.": "실시간으로 읽습니다.",
  "New file, new thread, new number, Team sees it the moment it lands.":
    "새 파일, 새 대화, 새 수치 — 도착하는 순간 Team이 봅니다.",
  "It writes back.": "다시 써 넣습니다.",
  "Two-way, not read-only. Team updates the doc, syncs the budget, re-briefs the partner.":
    "읽기 전용이 아닌 양방향입니다. Team이 문서를 업데이트하고, 예산을 동기화하고, 파트너에게 다시 안내합니다.",
  "You stay in control.": "통제권은 당신에게.",
  "Every connection is permissioned, scoped, and revocable in a click.":
    "모든 연동은 권한 기반이고, 범위가 지정되며, 클릭 한 번으로 해제할 수 있습니다.",

  // ── the live example ──
  "Connected": "연결됨",
  "Read": "읽음",
  "New file in /Masters": "/Masters에 새 파일",
  "Reason": "추론",
  "Recognized as the new master, supersedes v9. The one-sheet and distributor brief both reference v9.":
    "새 마스터로 인식했으며 v9를 대체합니다. 원시트와 유통사 브리프가 모두 v9를 참조하고 있습니다.",
  "Wrote back": "다시 씀",
  "Updated the one-sheet to reference v10": "원시트가 v10을 참조하도록 업데이트했습니다",
  "Re-briefed the distributor on the change": "변경 사항을 유통사에 다시 안내했습니다",

  // ── catalogue ──
  "The whole catalog,": "전체 카탈로그를,",
  "one brain.": "하나의 브레인으로.",
  "Filter by what your operation runs on. Green means live today.":
    "운영에 쓰는 도구로 필터링하세요. 초록색은 오늘 바로 사용할 수 있다는 뜻입니다.",
  "Live today": "현재 사용 가능",
  "Coming soon": "출시 예정",
  "Weekly": "매주",
  "New connectors": "신규 커넥터",
  "Don't see the one you need?": "필요한 커넥터가 없나요?",
  "We add connectors constantly, and we prioritize by what beta users ask for. Tell us what your operation runs on and we'll wire it up.":
    "커넥터는 계속 추가되고 있으며, 베타 사용자의 요청을 우선으로 반영합니다. 어떤 도구를 쓰시는지 알려주시면 연결해 드리겠습니다.",
  "Request an integration": "연동 요청하기",
  "See how Team reasons across it": "Team이 어떻게 추론하는지 보기",

  // ── final CTA ──
  "Put your whole stack": "스택 전체를",
  "in one mind.": "하나의 지성 안에.",
  "Get a demo": "데모 요청하기",
};

/**
 * Korean copy for the connector directory that v2-connections.js renders.
 *
 * Keyed by slug, matching the COPY block in that file. Connector NAMES are
 * absent on purpose — Notion, Slack and Google Drive are third-party product
 * names and stay as they are. Anything omitted here falls back to the English
 * default inline in that file, per item.
 */
export const KO_CONNECTIONS_JS = {
  cats: {
    productivity: "생산성",
    files: "파일",
    social: "소셜",
    commerce: "커머스 & 이벤트",
  },
  ui: {
    all: "전체",
    live: "사용 가능",
    coming: "예정",
    soon: "출시 예정",
    availableNow: "현재 사용 가능",
  },
  desc: {
    notion: "페이지와 데이터베이스를 브레인으로 가져옵니다.",
    slack: "채널의 맥락을 브레인으로 가져옵니다.",
    gmail: "릴리스 관련 이메일과 첨부파일을 가져옵니다.",
    googlecalendar: "예정된 일정을 브레인이 파악하도록 유지합니다.",
    airtable: "베이스의 레코드를 브레인과 동기화합니다.",
    linear: "이슈와 프로젝트를 브레인으로 가져옵니다.",
    asana: "작업과 프로젝트를 브레인으로.",
    trello: "보드와 카드를 브레인으로.",
    clickup: "문서와 작업을 브레인으로.",
    discord: "커뮤니티 채널의 맥락.",
    outlook: "이메일과 캘린더를 브레인으로.",
    googledrive: "Drive 폴더의 문서가 바뀔 때마다 반영합니다.",
    googlesheets: "스프레드시트의 행을 릴리스 브레인과 동기화합니다.",
    dropbox: "폴더의 파일을 가져오고, 파일을 다시 추가합니다.",
    googledocs: "어시스턴트를 통해 문서를 읽고 씁니다.",
    box: "엔터프라이즈 파일을 브레인으로.",
    instagram: "게시물과 인사이트를 브레인으로.",
    youtube: "채널, 영상, 댓글 인텔리전스.",
    facebook: "페이지 인사이트를 브레인으로.",
    reddit: "커뮤니티 반응.",
    eventbrite: "티켓 판매와 참석자.",
    ticketmaster: "이벤트 및 티켓 데이터.",
  },
} as const;
