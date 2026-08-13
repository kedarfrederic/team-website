import type { CopyMap } from "../koLocalize";
import { KO_ICP_COMMON } from "./icpCommon";

/**
 * Korean copy for /for-labels.
 *
 * A&R stays "A&R" — it is the standard term in Korean label operations and
 * spelling it out would read as explaining the industry to someone who works
 * in it. Same for DSP. Orchard is a distributor name, not a word.
 *
 * "Slate" is the load-bearing concept on this page and has no single Korean
 * equivalent: it means the full portfolio of releases in flight, not a
 * schedule. Rendered as 릴리스 슬레이트 on first use and 슬레이트 thereafter,
 * which is what Korean label staff actually say, rather than 일정 (schedule) or
 * 목록 (list), both of which lose the sense of a portfolio being managed.
 */
const PAGE: CopyMap = {
  // ── hero ──
  "Every release,": "모든 릴리스를,",
  "one living picture.": "살아 있는 하나의 그림으로.",
  "A label runs a slate, not a single release. A&R, marketing, production and distribution each live in their own tools and their own heads.":
    "레이블은 하나의 릴리스가 아니라 릴리스 슬레이트를 운영합니다. A&R, 마케팅, 제작, 유통이 각자의 도구와 각자의 머릿속에 흩어져 있습니다.",
  "Team reasons across all of it, tracks how one release affects the next, and keeps the whole slate in one living picture.":
    "Team은 그 전부를 종합해 추론하고, 한 릴리스가 다음 릴리스에 미치는 영향을 추적하며, 슬레이트 전체를 살아 있는 하나의 그림으로 유지합니다.",

  // ── overnight strip ──
  "Re-briefed marketing on": "마케팅에 다시 안내했습니다 —",
  "Nova LP's": "Nova LP의",
  "approved master.": "승인된 마스터.",
  "Delivered": "전달했습니다 —",
  "Kite's": "Kite의",
  "single to the distributor ahead of cutoff.": "싱글을 마감 전에 유통사로 전달했습니다.",
  "Two": "두 건의",
  "Q3 releases": "3분기 릴리스가",
  "now land the same week.": "같은 주에 겹치게 됐습니다.",

  // ── the slate lives everywhere ──
  "Right now, the slate lives": "지금 슬레이트는",
  "in a dozen places.": "열 곳이 넘는 데 흩어져 있습니다.",
  "A&R in Notion, marketing in a sheet, distribution in the DSP portals. To know where the slate stands, someone rebuilds the picture by hand, and it's stale by the meeting.":
    "A&R은 Notion에, 마케팅은 시트에, 유통은 DSP 포털에. 슬레이트가 어디쯤인지 알려면 누군가 손으로 그림을 다시 그려야 하고, 회의 시작 전에 이미 낡습니다.",
  "Nova · LP": "Nova · LP",
  "alt-pop · flagship": "alt-pop · 플래그십",
  "Tracked across": "흩어진 곳",
  "A&R notes": "A&R 메모",
  "Marketing plan": "마케팅 계획",
  "Masters": "마스터",
  "Distro portal": "유통 포털",
  "Kite · single": "Kite · 싱글",
  "pop · Q3": "pop · 3분기",
  "Group chat": "단톡방",
  "Assets": "에셋",
  "Atlas · EP": "Atlas · EP",
  "electronic · Q3": "electronic · 3분기",
  "3 trackers": "트래커 3개",
  "It clashes with another release, and no one caught it":
    "다른 릴리스와 겹쳤는데, 아무도 알아채지 못했습니다",
  "The whole picture exists. It's just never": "전체 그림은 존재합니다. 다만 한 번도",
  "in one place at the same time.": "같은 시점에 한곳에 모인 적이 없을 뿐입니다.",

  // ── slate management ──
  "Your whole slate,": "슬레이트 전체가,",
  "continually managed.": "끊임없이 관리됩니다.",
  "Team holds every release in one model and moves across the slate the way your teams can't, catching what falls between them.":
    "Team은 모든 릴리스를 하나의 모델에 담고, 팀들이 할 수 없는 방식으로 슬레이트를 가로지르며 그 사이로 빠지는 것을 잡아냅니다.",
  "Nova LP": "Nova LP",
  "alt-pop · Q3": "alt-pop · 3분기",
  "On track": "정상 진행",
  "Kite single": "Kite 싱글",
  "Atlas EP": "Atlas EP",
  "Vega LP": "Vega LP",
  "indie · Q4": "indie · 4분기",
  "Signed off": "승인 완료",
  "Marketing": "마케팅",
  "On plan": "계획대로",
  "Production": "제작",
  "Vinyl set": "바이닐 확정",
  "Distribution": "유통",
  "On track across every team. Delivering in five weeks.":
    "모든 팀에서 정상 진행 중. 5주 후 납품.",
  "In draft": "초안 단계",
  "Locked": "확정됨",
  "Everything is locked bar the marketing plan, in draft now.":
    "마케팅 계획을 제외한 모든 것이 확정됐고, 계획은 현재 초안 단계입니다.",
  "Clash": "충돌",
  "Same week as Kite": "Kite와 같은 주",
  "Clashes with Kite for the same release week. Pick one to move.":
    "Kite와 발매 주간이 겹칩니다. 하나를 옮겨야 합니다.",
  "In review": "검토 중",
  "Scoped": "범위 확정",
  "Not started": "시작 전",
  "Early in the pipeline, on schedule.": "파이프라인 초기 단계, 일정대로입니다.",

  // ── see the slate ──
  "See the slate": "Team이 보는 방식으로",
  "the way Team does.": "슬레이트를 보세요.",
  "One connected brain across every release. Scan it, ask it, and let no handoff fall through.":
    "모든 릴리스를 잇는 하나의 브레인입니다. 훑어보고, 물어보고, 어떤 인계도 놓치지 마세요.",
  "The whole slate, one view": "슬레이트 전체를 한 화면에",
  "Every release and what it's waiting on, in one live picture. No one rebuilds the deck before the meeting.":
    "모든 릴리스와 각자가 기다리는 것을 하나의 실시간 화면에. 회의 전에 자료를 다시 만들 필요가 없습니다.",
  "Clashes caught early": "충돌을 미리 포착",
  "Where two releases collide across the slate, surfaced before either one is a fire.":
    "슬레이트에서 두 릴리스가 부딪히는 지점을, 어느 쪽도 급한 불이 되기 전에 드러냅니다.",
  "Ask the slate": "슬레이트에 물어보기",
  "A straight answer on any release, drawn from every team's tools, not someone's recall.":
    "누군가의 기억이 아니라 모든 팀의 도구에서 끌어낸, 어느 릴리스에 대해서든 분명한 답.",
  "Handoffs kept straight": "인계는 어긋나지 않게",
  "Every team working from the same final, so nothing falls in the gap between them.":
    "모든 팀이 같은 최종본으로 일하므로, 팀 사이의 틈으로 빠지는 것이 없습니다.",

  // ── slate / risk panel ──
  "Slate": "슬레이트",
  "delivering in 5 weeks": "5주 후 납품",
  "delivered, marketing in draft": "납품 완료, 마케팅 초안 단계",
  "clashes with Kite": "Kite와 충돌",
  "Vega · LP": "Vega · LP",
  "in A&R review": "A&R 검토 중",
  "Slate risks · this week": "슬레이트 리스크 · 이번 주",
  "Atlas & Kite": "Atlas & Kite",
  "land the same week, both need radio push": "같은 주에 겹치며, 둘 다 라디오 푸시가 필요합니다",
  "Now": "지금",
  "Vega": "Vega",
  "marketing beat is booked before the master is locked":
    "마스터가 확정되기 전에 마케팅 일정이 잡혀 있습니다",
  "Soon": "곧",
  "Nova": "Nova",
  "cleared across every team": "모든 팀에서 정리 완료",
  "Cleared": "정리됨",
  "Kite": "Kite",
  "delivered, metadata clean": "납품 완료, 메타데이터 정상",
  "Watching": "주시 중",
  "Ask TeamMate": "TeamMate에게 물어보기",
  "How is Q3 tracking?": "3분기는 어떻게 진행되고 있나요?",
  "Nine releases, seven on track.": "릴리스 9건 중 7건이 정상 진행 중입니다.",
  "Atlas and Kite clash in week three": "Atlas와 Kite가 3주차에 충돌하며",
  ", flagged for a call. Everything else is clear.": ", 논의가 필요해 표시해 두었습니다. 나머지는 문제없습니다.",
  "What is blocked on approvals?": "승인 때문에 막혀 있는 건 무엇인가요?",
  "Just": "하나뿐입니다 —",
  "Vega's masters": "Vega의 마스터",
  ", waiting on A&R sign-off.": ", A&R 승인을 기다리고 있습니다.",

  // ── handoff ──
  "Nova · handoff": "Nova · 인계",
  "Nova is": "Nova는",
  "ready to ship.": "출고 준비가 끝났습니다.",
  "LP · delivering in 5 weeks": "LP · 5주 후 납품",
  "A&R signed off": "A&R 승인 완료",
  "Marketing briefed on the final": "마케팅에 최종본 안내 완료",
  "Assets delivered to the distributor": "에셋 유통사 전달 완료",
  "Distribution, delivering now": "유통, 진행 중",
  "Every team works from the same final.": "모든 팀이 같은 최종본으로 일합니다.",

  // ── after hours ──
  "While your teams were offline,": "팀들이 자리를 비운 사이,",
  "Team kept the slate moving.": "Team이 슬레이트를 계속 움직였습니다.",
  "The releases that slip are the ones between two teams. Team reasons across the whole slate after hours and hands leadership a short brief with only what needs a decision.":
    "밀리는 릴리스는 두 팀 사이에 놓인 것들입니다. Team은 업무 시간 외에도 슬레이트 전체를 추론하고, 결정이 필요한 것만 담은 짧은 브리프를 경영진에 전달합니다.",
  "TeamMate · across the slate": "TeamMate · 슬레이트 전반",
  "master approved by A&R. Re-briefed marketing and the distributor to match.":
    "마스터가 A&R 승인을 받았습니다. 마케팅과 유통사에 맞춰 다시 안내했습니다.",
  "delivered ahead of cutoff. Metadata checked against the tracker, clean.":
    "마감 전에 납품했습니다. 트래커와 대조한 메타데이터도 정상입니다.",
  "Resynced the release calendar after two dates moved. Flagged marketing.":
    "날짜 두 건이 옮겨져 릴리스 캘린더를 다시 맞췄습니다. 마케팅에 표시해 두었습니다.",
  "now land the same week, both need radio and playlist push. Needs a call.":
    "가 같은 주에 겹치며, 둘 다 라디오와 플레이리스트 푸시가 필요합니다. 논의가 필요합니다.",
  "Leadership brief:": "경영진 브리프:",
  "two releases delivered, one calendar resynced. One decision, a Q3 clash between Atlas and Kite.":
    "릴리스 2건 납품, 캘린더 1건 재조정. 결정이 필요한 것은 하나 — Atlas와 Kite의 3분기 충돌입니다.",

  // ── outcome band ──
  "What a quarter on Team": "Team에서의 한 분기가",
  "Team does not replace your A&R, your marketers, or their tools. It connects them into one intelligence so the label moves as one operation.":
    "Team은 A&R도, 마케터도, 그들의 도구도 대체하지 않습니다. 그것들을 하나의 인텔리전스로 연결해, 레이블이 하나의 조직처럼 움직이게 합니다.",
  "fewer status meetings": "줄어드는 상황 공유 회의",
  "The slate stays current without anyone building a deck.":
    "누구도 자료를 만들지 않아도 슬레이트가 최신 상태로 유지됩니다.",
  "earlier risk warnings": "더 빠른 리스크 경고",
  "Clashes and blockers surface before they are fires.":
    "충돌과 병목이 급한 불이 되기 전에 드러납니다.",
  "of reporting saved a week": "주당 절약되는 보고 시간",
  "The check-ins and decks that ran the label, answered on demand.":
    "레이블을 굴리던 점검과 자료를, 필요할 때 바로 답합니다.",

  // ── final CTA ──
  "Discover the brain behind": "슬레이트 전체 뒤의",
  "your whole slate.": "브레인을 만나보세요.",
  "Team is in early access with labels, managers and artists shaping what it becomes. Connect every team's tools in minutes and give leadership one living picture from day one.":
    "Team은 레이블과 매니저, 아티스트가 함께 만들어가는 얼리 액세스 단계입니다. 몇 분 만에 모든 팀의 도구를 연결하고, 첫날부터 경영진에게 살아 있는 하나의 그림을 제공하세요.",
};

export const KO_FOR_LABELS: CopyMap = { ...KO_ICP_COMMON, ...PAGE };
