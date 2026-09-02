import type { CopyMap } from "../koLocalize";
import { KO_ICP_COMMON } from "./icpCommon";

/**
 * Korean copy for /for-partners (distributors).
 *
 * Delivery-ops vocabulary stays English where that is the working term in
 * Korean distribution: ISRC, DSP, WAV, EP, LP. A Korean delivery operator reads
 * and writes these daily; translating ISRC would make the page unusable for the
 * person it is aimed at.
 *
 * "Book" — the full set of releases in flight — has no direct Korean
 * equivalent. Rendered 전체 물량 ("the whole volume/load"), which is how Korean
 * distribution staff describe it. 장부 is the literal "book" and means an
 * accounting ledger; 목록 loses the sense of scale that is the page's argument.
 *
 * "Pre-flight" is rendered 사전 점검 rather than transliterated: it is a
 * borrowed aviation metaphor in English too, and the Korean term is plain.
 */
const PAGE: CopyMap = {
  // ── hero ──
  "Risk across": "전체 물량에 걸친",
  "the": "",
  "whole book.": "리스크.",
  "You deliver hundreds of releases at once, each with its own assets, metadata and deadline.":
    "수백 건의 릴리스를 동시에 납품하며, 각각이 저마다의 에셋과 메타데이터, 마감을 갖고 있습니다.",
  "Team reasons across the entire book, catches the missing master or the wrong metadata before it reaches the DSP, and shows you where the real risk is, not just where the noise is.":
    "Team은 전체 물량을 종합해 추론하고, 누락된 마스터나 잘못된 메타데이터를 DSP에 닿기 전에 잡아내며, 소음이 아니라 실제 리스크가 어디에 있는지 보여줍니다.",

  // ── overnight strip ──
  "Pre-flighted": "사전 점검했습니다 —",
  "releases due this week.": "건이 이번 주 마감입니다.",
  "cleared.": "건 정리 완료.",
  "Fixed": "수정했습니다 —",
  "metadata mismatches against DSP spec.": "건의 메타데이터가 DSP 규격과 불일치했습니다.",
  "releases at risk of missing Friday's cutoff.": "건이 금요일 마감을 놓칠 위험이 있습니다.",

  // ── the problem finds you last ──
  "At this volume, the problem": "이 규모에서는 문제가",
  "finds you last.": "가장 늦게 발견됩니다.",
  "A wrong ISRC, a missing master, a delivery that misses cutoff. You cannot hand-check every release, so most issues get caught by the DSP rejection, not by you.":
    "잘못된 ISRC, 누락된 마스터, 마감을 놓친 납품. 모든 릴리스를 손으로 확인할 수는 없으니, 대부분의 문제는 당신이 아니라 DSP의 반려로 드러납니다.",
  "Label A": "레이블 A",
  "24 releases in flight": "진행 중인 릴리스 24건",
  "Delivering via": "납품 경로",
  "Sheet": "시트",
  "Emails": "이메일",
  "Label B": "레이블 B",
  "60 releases in flight": "진행 중인 릴리스 60건",
  "DSP portal": "DSP 포털",
  "Label C": "레이블 C",
  "18 releases in flight": "진행 중인 릴리스 18건",
  "Metadata gaps": "메타데이터 누락",
  "A release will bounce tomorrow, and you'll hear it from the DSP":
    "내일 릴리스가 반려될 텐데, 그 사실은 DSP를 통해 알게 됩니다",
  "The problem you find is the one that": "당신이 발견하는 문제는 이미",
  "already shipped.": "나가버린 문제입니다.",

  // ── pre-flight ──
  "The whole book,": "전체 물량을,",
  "pre-flighted before it ships.": "나가기 전에 사전 점검합니다.",
  "Team checks every release against delivery spec the moment it lands, ranks what is most exposed, and clears the queue while your team sleeps.":
    "Team은 릴리스가 들어오는 즉시 납품 규격과 대조하고, 가장 위험한 순서로 정렬하며, 팀이 잠든 사이 대기열을 처리합니다.",
  "Today": "오늘",
  "48 due": "48건 마감",
  "Clear": "정리됨",
  "Tomorrow": "내일",
  "62 due": "62건 마감",
  "Friday cutoff": "금요일 마감",
  "142 due": "142건 마감",
  "4 flagged": "4건 표시됨",
  "Next week": "다음 주",
  "90 due": "90건 마감",
  "delivery pre-flight": "납품 사전 점검",
  "Checked": "점검됨",
  "Clean": "이상 없음",
  "Flagged": "표시됨",
  "Aurora, single": "Aurora, 싱글",
  "— missing WAV, requested from client": "— WAV 누락, 클라이언트에 요청함",
  "Blocked": "막힘",
  "Cedar EP": "Cedar EP",
  "— cleared": "— 정리됨",
  "Scheduled": "예약됨",
  "Mono single": "Mono 싱글",
  "Vale LP": "Vale LP",
  "— artwork below spec, fix drafted": "— 아트워크 규격 미달, 수정안 작성됨",
  "Reef single": "Reef 싱글",
  "Halo EP": "Halo EP",
  "Nova LP": "Nova LP",
  "— master not delivered · Fri": "— 마스터 미전달 · 금",
  "Atlas EP": "Atlas EP",
  "— invalid ISRC, fix drafted · Fri": "— 유효하지 않은 ISRC, 수정안 작성됨 · 금",
  "Kite single": "Kite 싱글",
  "— missing WAV from client · Fri": "— 클라이언트 WAV 누락 · 금",
  "134 others": "나머지 134건",
  "cleared and scheduled": "정리 및 예약 완료",
  "Whole batch": "배치 전체",
  "clean and cleared": "이상 없음, 정리 완료",
  "Metadata": "메타데이터",
  "validated against spec": "규격 대조 검증됨",
  "Ranked": "정렬 및",
  "and scheduled": "예약 완료",

  // ── see the book ──
  "See the book": "Team이 보는 방식으로",
  "the way Team does.": "전체 물량을 보세요.",
  "One connected brain across every delivery. Check it, rank it, and catch it before the DSP does.":
    "모든 납품을 잇는 하나의 브레인입니다. 점검하고, 정렬하고, DSP보다 먼저 잡아내세요.",
  "Every delivery pre-flighted": "모든 납품을 사전 점검",
  "Every release checked against DSP spec the moment it lands, so nothing ships broken.":
    "릴리스가 들어오는 즉시 DSP 규격과 대조하므로, 결함이 있는 채로 나가지 않습니다.",
  "Risk, ranked": "리스크를 순서대로",
  "What's about to miss cutoff, across the whole book, ranked by what's most exposed.":
    "전체 물량에서 마감을 놓칠 것들을, 가장 위험한 순서로.",
  "Ask the book": "물량에 물어보기",
  "A straight answer on any batch or release, drawn from your trackers, not your recall.":
    "당신의 기억이 아니라 트래커에서 끌어낸, 어느 배치나 릴리스에 대해서든 분명한 답.",
  "The client chase, automated": "클라이언트 독촉을 자동으로",
  "Missing assets requested from the client with the cutoff attached, so nothing stalls on you.":
    "누락된 에셋을 마감일과 함께 클라이언트에 요청하므로, 당신 쪽에서 멈추는 일이 없습니다.",

  // ── pre-flight detail ──
  "Pre-flight · Nova LP": "사전 점검 · Nova LP",
  "Ready to deliver?": "납품 준비가 됐나요?",
  "Not yet.": "아직입니다.",
  "checked against DSP spec": "DSP 규격 대조 완료",
  "Master present and correct": "마스터 존재 및 정상",
  "Artwork meets spec": "아트워크 규격 충족",
  "Metadata, missing ISRC": "메타데이터, ISRC 누락",
  "Territories set": "지역 설정 완료",
  "Caught before it goes out, not after it bounces.": "반려된 뒤가 아니라, 나가기 전에 잡아냅니다.",
  "Ranked by cutoff": "마감 순 정렬",
  "— master not delivered": "— 마스터 미전달",
  "· Fri": "· 금",
  "Now": "지금",
  "— invalid ISRC": "— 유효하지 않은 ISRC",
  "Soon": "곧",
  "134 releases": "릴리스 134건",
  "clean this week": "이번 주 이상 없음",
  "On track": "정상 진행",
  "Ask TeamMate": "TeamMate에게 물어보기",
  "What is at risk for Friday?": "금요일에 위험한 건 무엇인가요?",
  "Four releases.": "네 건입니다.",
  "Two waiting on masters from Label C, one invalid ISRC with a fix drafted, one artwork below spec. Ranked by cutoff.":
    "두 건은 레이블 C의 마스터를 기다리는 중, 한 건은 유효하지 않은 ISRC로 수정안이 작성됐고, 한 건은 아트워크가 규격 미달입니다. 마감 순으로 정렬했습니다.",
  "Delivery tracker": "납품 트래커",
  "How is delivery tracking this week?": "이번 주 납품은 어떻게 진행되고 있나요?",
  "142 due,": "142건 마감 중",
  "138 clean and scheduled": "138건이 이상 없이 예약 완료",
  ". Four flagged, all blocked on client assets.":
    ". 네 건이 표시됐고, 모두 클라이언트 에셋 때문에 막혀 있습니다.",

  // ── client chase ──
  "Client chase": "클라이언트 독촉",
  "Chased,": "독촉했습니다,",
  "with deadlines.": "마감일과 함께.",
  "so delivery never stalls on you": "그래서 납품이 당신 쪽에서 멈추지 않습니다",
  "Label C, missing WAV, requested": "레이블 C, WAV 누락, 요청함",
  "Label A, artwork fix, sent": "레이블 A, 아트워크 수정본 발송",
  "Label B, all assets in": "레이블 B, 모든 에셋 수령",
  "Label C, awaiting reply": "레이블 C, 회신 대기",
  "Missing assets requested with the cutoff attached.": "누락된 에셋을 마감일과 함께 요청했습니다.",

  // ── after hours ──
  "While the queue was quiet,": "대기열이 조용한 사이,",
  "Team checked the whole book.": "Team이 전체 물량을 점검했습니다.",
  "You cannot hand-inspect a book this size. Team works the pipeline after hours, clears what it can, and surfaces only what is genuinely at risk of missing cutoff.":
    "이 규모의 물량을 손으로 검수할 수는 없습니다. Team은 업무 시간 외에 파이프라인을 처리하고, 가능한 것은 정리하며, 정말로 마감을 놓칠 위험이 있는 것만 드러냅니다.",
  "TeamMate · across the book": "TeamMate · 전체 물량",
  "142 releases": "릴리스 142건",
  "due this week. 138 clean and cleared for delivery.":
    "이 이번 주 마감입니다. 138건은 이상 없이 납품 준비를 마쳤습니다.",
  "3 metadata mismatches": "메타데이터 불일치 3건",
  "against DSP spec and re-checked.": "을 DSP 규격에 맞춰 재확인했습니다.",
  "Re-ranked the queue": "대기열을 다시 정렬해",
  "by cutoff so the team opens on what is most exposed.":
    "마감 순으로 두었고, 팀이 가장 위험한 것부터 보게 됩니다.",
  "4 releases": "릴리스",
  "at risk of missing Friday's cutoff, waiting on masters from two clients. Needs a nudge.":
    "4건이 금요일 마감을 놓칠 위험이 있으며, 두 클라이언트의 마스터를 기다리고 있습니다. 추가 요청이 필요합니다.",
  "Ops brief:": "운영 브리프:",
  "142 checked, 138 clear, 3 fixed overnight. Four at risk for Friday, all blocked on client assets.":
    "142건 점검, 138건 이상 없음, 밤사이 3건 수정. 금요일 위험 4건은 모두 클라이언트 에셋 때문에 막혀 있습니다.",

  // ── outcome band ──
  "What a week on Team": "Team에서의 한 주가",
  "Team does not replace your delivery ops. It gives them a brain that reads every release, so problems get caught upstream and your people spend their time on the ones that need judgement.":
    "Team은 납품 운영 조직을 대체하지 않습니다. 모든 릴리스를 읽는 브레인을 더해, 문제가 상류에서 잡히고 사람은 판단이 필요한 건에만 시간을 쓰게 합니다.",
  "fewer DSP rejections": "줄어드는 DSP 반려",
  "Metadata and asset errors caught before the bounce, not after.":
    "메타데이터와 에셋 오류를 반려된 뒤가 아니라 그전에 잡아냅니다.",
  "of the book checked": "점검되는 물량 비율",
  "Every release pre-flighted against spec, not a hand-picked sample.":
    "표본이 아니라 모든 릴리스를 규격 대조로 사전 점검합니다.",
  "throughput per ops head": "운영 인력당 처리량",
  "Your team works the real risk, ranked, not a flat queue.":
    "평평한 대기열이 아니라, 정렬된 실제 리스크부터 처리합니다.",

  // ── final CTA ──
  "Discover the brain behind": "모든 납품 뒤의",
  "every delivery.": "브레인을 만나보세요.",
  "Team is in early access with distributors and partners shaping what it becomes. Connect your delivery pipeline and let Team pre-flight the whole book before it ever reaches a DSP.":
    "Team은 유통사와 파트너가 함께 만들어가는 얼리 액세스 단계입니다. 납품 파이프라인을 연결하고, DSP에 닿기 전에 Team이 전체 물량을 사전 점검하게 하세요.",
};

export const KO_FOR_PARTNERS: CopyMap = { ...KO_ICP_COMMON, ...PAGE };
