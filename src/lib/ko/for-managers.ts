import type { CopyMap } from "../koLocalize";
import { KO_ICP_COMMON } from "./icpCommon";

/**
 * Korean copy for /for-managers.
 *
 * Artist names (Maya Sol, Theo Grant, Nova, Kite) are fictional and stay as
 * they are — transliterating them would make the mock read as a translation of
 * a screenshot rather than as a screenshot.
 *
 * Genre and format tags (alt-pop, indie, EP, LP) also stay: those are the words
 * a Korean music professional uses, and 확장 재생 for "EP" would be actively
 * confusing.
 *
 * The page's argument is about ATTENTION — the release that slips is the one
 * you weren't watching. The Korean keeps that as the through-line rather than
 * flattening it into "manage everything in one place", which is what a literal
 * pass produces and which loses the whole point.
 */
const PAGE: CopyMap = {
  // ── hero ──
  "Your whole roster,": "로스터 전체를,",
  "in one place.": "한곳에.",
  "Every artist you manage is a release, a team, and a tool stack of their own, and you're the thread between all of them.":
    "관리하는 아티스트 한 명 한 명이 각자의 릴리스이자 팀이자 도구 모음이고, 당신은 그 사이를 잇는 실입니다.",
  "Team gives each artist their own brain and keeps the whole roster in one view, so nothing slips while you're focused on someone else.":
    "Team은 아티스트마다 각자의 브레인을 두고 로스터 전체를 한 화면에 유지합니다. 다른 아티스트에 집중하는 동안에도 놓치는 일이 없도록.",

  // ── overnight strip ──
  "Re-briefed the distributor on": "유통사에 다시 안내했습니다 —",
  "Maya's": "Maya의",
  "new master.": "새 마스터.",
  "Pushed": "미뤘습니다 —",
  "Theo's": "Theo의",
  "teaser two days to clear the video edit.": "티저를 이틀 미뤄 영상 편집 시간을 확보했습니다.",
  "Nova's": "Nova의",
  "vinyl PO needs your sign-off before Friday.": "바이닐 발주에 금요일 전 승인이 필요합니다.",

  // ── everyone lives somewhere else ──
  "Right now, every artist": "지금은 아티스트마다",
  "lives somewhere else.": "다른 곳에 흩어져 있습니다.",
  "Notion for one, a group chat for another, the third only ever in your head. Every switch between them costs you the thread.":
    "한 명은 Notion에, 다른 한 명은 단톡방에, 세 번째는 오직 당신의 머릿속에만. 그 사이를 오갈 때마다 흐름이 끊깁니다.",
  "alt-pop · single": "alt-pop · 싱글",
  "Context lives across": "맥락이 흩어진 곳",
  /* "Calendar" is NOT here, deliberately. I added it reading one row — "IG 계획 /
     Notion / Masters / Calendar" — and calling it a generic noun. It is not:
     every one of its six occurrences across four bodies sits among product
     names (Sheets, Airtable, Slack, Dropbox, Notion, Gmail). It is Google
     Calendar, and 캘린더 among four English product names was wrong in all six.
     "Masters" is the opposite and lives in KO_ICP_COMMON now: its row-mates are
     A&R notes, Stems, Splits sheet, Threads — never a product. */
  "IG plan": "IG 계획",
  "Splits sheet": "분배 시트",
  "Label email": "레이블 이메일",
  "indie · EP": "indie · EP",
  "Group chat": "단톡방",
  "PR list": "PR 리스트",
  "Sync notes": "싱크 메모",
  "electronic · LP": "electronic · LP",
  "Context lives": "맥락이 있는 곳",
  "In your head": "당신의 머릿속",
  "3 inboxes": "받은편지함 3개",
  "A deadline is slipping, and you can't see it": "마감이 밀리고 있는데, 보이지 않습니다",
  "When a release slips, it's never the one you were watching.":
    "릴리스가 밀릴 때, 그건 지켜보던 릴리스가 아닙니다.",
  "It's the one you weren't.": "지켜보지 않던 쪽입니다.",

  // ── one mind ──
  "One mind,": "하나의 지성이,",
  "on every artist at once.": "모든 아티스트를 동시에.",
  "Team keeps a live brain for each artist and moves between them the way you do, so the whole roster stays in view, always.":
    "Team은 아티스트마다 살아 있는 브레인을 유지하고 당신이 그러듯 그 사이를 오갑니다. 그래서 로스터 전체가 언제나 시야 안에 있습니다.",
  "On track": "정상 진행",
  "pop · single": "pop · 싱글",
  "Master": "마스터",
  "Artwork": "아트워크",
  "Video": "영상",
  "Pitches": "피칭",
  "Launch": "발매",
  "Video edit in review. Launch set for five weeks out.": "영상 편집 검토 중. 발매는 5주 후로 설정.",
  "Vinyl": "바이닐",
  "Vinyl proof approved. On schedule for the street date.": "바이닐 교정본 승인. 발매일 일정대로 진행 중.",
  "Assets": "에셋",
  "Vinyl PO needs your sign-off before Friday.": "바이닐 발주에 금요일 전 승인이 필요합니다.",
  "Playlist pitches are out. Awaiting replies.": "플레이리스트 피칭 발송 완료. 회신 대기 중.",

  // ── see the roster ──
  "See the roster": "Team이 보는 방식으로",
  "the way Team does.": "로스터를 보세요.",
  "One connected brain across every artist. Scan it, ask it, or give the artist their own slice.":
    "모든 아티스트를 잇는 하나의 브레인입니다. 훑어보고, 물어보고, 아티스트에게 각자의 화면을 열어주세요.",
  "Roster at a glance": "로스터 한눈에",
  "Every artist and what they're waiting on, in one live view. No rebuilding the picture each time you switch.":
    "모든 아티스트와 각자가 기다리는 것을 하나의 실시간 화면에. 옮겨 갈 때마다 상황을 다시 파악할 필요가 없습니다.",
  "Risk radar": "리스크 레이더",
  "What's about to slip, across the whole roster, ranked by what needs you first.":
    "로스터 전체에서 밀릴 조짐이 있는 것을, 당신이 먼저 봐야 할 순서로.",
  "Ask anything": "무엇이든 물어보세요",
  "A straight answer on any artist, drawn from their tools and threads, not your recall.":
    "당신의 기억이 아니라 각자의 도구와 대화에서 끌어낸, 어느 아티스트에 대해서든 분명한 답.",
  "The artist's view": "아티스트의 화면",
  "Give each artist their own slice of the picture, without handing over your inbox.":
    "받은편지함을 넘기지 않고도, 아티스트에게 각자의 화면을 열어줄 수 있습니다.",

  // ── roster / radar panel ──
  "Roster": "로스터",
  "Maya Sol · single": "Maya Sol · 싱글",
  "master approved · launch t–5w": "마스터 승인 · 발매 D-5주",
  "Theo Grant · EP": "Theo Grant · EP",
  "video export rendering": "영상 익스포트 렌더링 중",
  "Nova · LP": "Nova · LP",
  "vinyl PO awaiting your sign-off": "바이닐 발주 승인 대기",
  "Kite · single": "Kite · 싱글",
  "playlist pitches out": "플레이리스트 피칭 발송됨",
  "Risk radar · this week": "리스크 레이더 · 이번 주",
  "— vinyl PO due Friday": "— 바이닐 발주 금요일 마감",
  "· sign-off needed": "· 승인 필요",
  "Now": "지금",
  "— video won't clear the release date": "— 영상이 발매일을 맞추지 못합니다",
  "· 3 days": "· 3일",
  "Soon": "곧",
  "— master approved, one-sheet re-briefed": "— 마스터 승인, 원시트 재정리 완료",
  "Cleared": "정리됨",
  "— pitches sent, awaiting playlist replies": "— 피칭 발송, 플레이리스트 회신 대기",
  "Watching": "주시 중",
  "Ask TeamMate": "TeamMate에게 물어보기",
  "Where does Nova's release stand?": "Nova의 릴리스는 지금 어떤 상황인가요?",
  "Master approved and artwork final. The": "마스터 승인, 아트워크 최종본 완료.",
  "vinyl PO is waiting on your sign-off": "바이닐 발주가 승인을 기다리고 있으며",
  ", due Friday. Marketing is briefed, launch set for t–3w. On track, bar the PO.":
    ", 금요일 마감입니다. 마케팅은 안내됐고 발매는 D-3주입니다. 발주 건을 빼면 일정대로입니다.",
  "Who still owes me assets this week?": "이번 주에 아직 에셋을 안 준 사람은 누구인가요?",
  "Just": "한 명뿐입니다 —",
  "Theo's editor": "Theo의 편집자",
  "— the final video cut, chased twice. Everyone else is in.":
    "— 최종 영상 편집본이며 두 번 요청했습니다. 나머지는 모두 들어왔습니다.",

  // ── shared artist view ──
  "Nova · shared view": "Nova · 공유 화면",
  "Your release is": "당신의 릴리스는",
  "on track.": "일정대로입니다.",
  "LP · launch in 3 weeks": "LP · 3주 후 발매",
  "Master approved": "마스터 승인됨",
  "Artwork final": "아트워크 최종본",
  "Vinyl PO — with your manager": "바이닐 발주 — 매니저 확인 중",
  "Launch assets — next week": "발매 에셋 — 다음 주",
  "Everyone's working from the same picture.": "모두가 같은 그림을 보고 일합니다.",

  // ── while you were elsewhere ──
  "While you were with another artist,": "다른 아티스트와 있는 동안,",
  "Team kept working.": "Team은 계속 일했습니다.",
  "A manager's worst days come from the release nobody was looking at. Team keeps moving across the whole roster while your attention is elsewhere, then hands you a short brief with only the calls that need you.":
    "매니저의 최악의 하루는 아무도 보고 있지 않던 릴리스에서 시작됩니다. Team은 당신의 관심이 다른 곳에 있는 동안에도 로스터 전체를 움직이고, 당신이 내려야 할 결정만 담은 짧은 브리프를 건넵니다.",
  "TeamMate · across the roster": "TeamMate · 로스터 전반",
  "— new master landed at 23:12. Re-briefed the one-sheet and distributor to match.":
    "— 23:12에 새 마스터가 도착했습니다. 원시트와 유통사에 맞춰 다시 안내했습니다.",
  "— pushed the IG teaser two days to clear the video edit. Calendar and label updated.":
    "— IG 티저를 이틀 미뤄 영상 편집 시간을 확보했습니다. 캘린더와 레이블도 업데이트했습니다.",
  "— chased the missing artwork export. Designer replied, files now filed.":
    "— 누락된 아트워크 익스포트를 요청했습니다. 디자이너가 회신했고 파일은 정리됐습니다.",
  "— the vinyl PO needs your sign-off before Friday or the street date slips. Left for you.":
    "— 바이닐 발주는 금요일 전에 승인하지 않으면 발매일이 밀립니다. 확인해 주세요.",
  "Your morning:": "오늘 아침:",
  "three releases moved forward overnight. One decision waiting — Nova's vinyl PO, due Friday.":
    "밤사이 릴리스 세 건이 진행됐습니다. 기다리는 결정은 하나 — Nova의 바이닐 발주, 금요일 마감입니다.",

  // ── outcome band ──
  "What a month on Team": "Team에서의 한 달이",
  "Team doesn't replace your judgement. It gives you the memory and the coverage to spend it where it counts, on the artists, not the admin.":
    "Team은 당신의 판단을 대신하지 않습니다. 그 판단을 정말 중요한 곳 — 관리 업무가 아니라 아티스트 — 에 쓸 수 있도록 기억과 커버리지를 제공할 뿐입니다.",
  "the roster, same hours": "같은 시간에 더 큰 로스터",
  "Carry more artists without more chaos, or more headcount.":
    "혼란도, 인력도 늘리지 않고 더 많은 아티스트를 맡으세요.",
  "less admin a week": "주당 줄어드는 관리 업무",
  "The recaps, chases and updates that ate your week, handled.":
    "한 주를 잡아먹던 정리와 독촉, 업데이트를 대신 처리합니다.",
  "releases dropped": "놓친 릴리스",
  "No release runs on memory or luck, however many you hold.":
    "몇 개를 맡든, 어떤 릴리스도 기억이나 운에 기대지 않습니다.",

  // ── final CTA ──
  "Discover the brain behind": "로스터 전체 뒤의",
  "your whole roster.": "브레인을 만나보세요.",
  "Team is in early access with managers, artists and labels shaping what it becomes. Connect your tools in minutes and help set the standard for how a roster runs.":
    "Team은 매니저와 아티스트, 레이블이 함께 만들어가는 얼리 액세스 단계입니다. 몇 분 만에 도구를 연결하고, 로스터 운영의 기준을 함께 세워 주세요.",
};

export const KO_FOR_MANAGERS: CopyMap = { ...KO_ICP_COMMON, ...PAGE };
