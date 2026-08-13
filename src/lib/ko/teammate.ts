import type { CopyMap } from "../koLocalize";

/**
 * Korean copy for /teammate. See ../koLocalize.ts for how it is applied.
 *
 * Product names (TeamMate, Pro, Team) and third-party tools (Dropbox, Slack,
 * Notion, Gmail, Drive, Calendar, Sheets) stay English, matching every other
 * Korean page. Filenames and channel names are identifiers, not copy.
 */
export const KO_TEAMMATE: CopyMap = {
  // ── hero ──
  "Available on": "이용 가능 플랜:",
  "The mind inside": "당신의 운영 안에 있는",
  "your operation.": "지성.",
  "TeamMate remembers every version, thread, and decision across your whole release, and reasons across all of it, so the answer to \"where do we actually stand?\" is always one question away.":
    "TeamMate는 릴리스 전반의 모든 버전과 대화, 결정을 기억하고 그 전체를 종합해 추론합니다. 그래서 ‘지금 우리는 어디쯤인가’에 대한 답이 늘 질문 하나 거리에 있습니다.",
  "Get started": "시작하기",
  "Get a demo": "데모 요청하기",

  // ── context ──
  "The context that usually lives": "보통은 어디에나 있으면서",
  "everywhere and nowhere.": "어디에도 없는 맥락.",
  "Every master version, every Slack thread, every budget change, every approval, every deadline. TeamMate holds the whole history of a release in one place, so nothing has to live in someone's memory until they're on vacation.":
    "모든 마스터 버전, 모든 Slack 대화, 모든 예산 변경, 모든 승인, 모든 마감. TeamMate는 릴리스의 전체 기록을 한곳에 담아, 어떤 것도 누군가의 기억에만 의존하지 않게 합니다. 그 사람이 휴가를 떠나도 말이죠.",
  "TeamMate remembers · Midnight Static": "TeamMate가 기억합니다 · Midnight Static",
  "Masters": "마스터",
  "— every bounce, who approved which": "— 모든 바운스와 각 승인자",
  "9 versions": "버전 9개",
  "Conversations": "대화",
  "— decisions buried in threads": "— 스레드에 묻힌 결정들",
  "3 threads · 14 decisions": "스레드 3개 · 의사결정 14건",
  "People": "사람",
  "— who owns what, right now": "— 지금 누가 무엇을 맡고 있는지",
  "mix · a&amp;r · distro": "믹스 · a&amp;r · 유통",
  "Money": "비용",
  "— budget, POs, splits, changes": "— 예산, 발주, 분배, 변경",
  "tracked live": "실시간 추적",
  "Dates": "일정",
  "— embargo, launch, every dependency": "— 엠바고, 발매, 모든 선행 관계",
  "launch t–9w": "발매 D-9주",

  // ── ask it anything ──
  "Ask it anything.": "무엇이든 물어보세요.",
  "It already knows.": "이미 알고 있습니다.",
  "No blank session that forgets you the moment you close the tab. Ask TeamMate about a release and it answers from the whole operation, with the receipts to back it up.":
    "탭을 닫는 순간 당신을 잊어버리는 빈 세션이 아닙니다. 릴리스에 대해 물으면 TeamMate는 운영 전체를 근거로, 출처와 함께 답합니다.",
  "Where's the final master?": "최종 마스터는 어디에 있나요?",
  ", approved by Maya in #audio on Tuesday. The one-sheet and distributor brief already reference it.":
    ", 화요일 #audio에서 Maya가 승인했습니다. 원시트와 유통사 브리프에 이미 반영되어 있습니다.",
  "One-sheet": "원시트",
  "What's blocking Friday's release?": "금요일 발매를 막고 있는 건 무엇인가요?",
  "Two things. The": "두 가지입니다.",
  "vinyl PO needs your sign-off": "바이닐 발주에 승인이 필요하고",
  ", and the video export is still rendering. Everything else for Friday is cleared.":
    ", 영상 익스포트가 아직 렌더링 중입니다. 금요일에 필요한 나머지는 모두 정리됐습니다.",
  "Did we ever clear that sample?": "그 샘플 클리어는 처리됐나요?",
  "Yes,": "네,",
  "cleared on 12 May.": "5월 12일에 완료됐습니다.",
  "The license is in the release folder and the credit is already in the metadata.":
    "라이선스는 릴리스 폴더에 있고, 크레딧도 이미 메타데이터에 반영되어 있습니다.",
  "Metadata": "메타데이터",

  // ── overnight ──
  "While you slept,": "당신이 잠든 사이,",
  "TeamMate kept working.": "TeamMate는 계속 일했습니다.",
  "Re-cut the release timeline around the new launch date":
    "새 발매일에 맞춰 릴리스 일정을 다시 구성했습니다",
  "Done": "완료",
  "Updated the budget in Notion + the one-sheet": "Notion과 원시트의 예산을 업데이트했습니다",
  "source: Sheets": "출처: Sheets",
  "Re-briefed the press list on the new embargo date":
    "새 엠바고 날짜를 언론 리스트에 다시 안내했습니다",
  "Vinyl PO #1042 needs your sign-off before Friday":
    "바이닐 발주 #1042는 금요일 전에 승인이 필요합니다",
  "Needs you": "확인 필요",
  "Morning. Four things moved overnight. I handled three. The fourth needs a decision only you can make.":
    "좋은 아침입니다. 밤사이 네 가지가 진행됐고 그중 셋은 처리했습니다. 나머지 하나는 당신만 내릴 수 있는 결정이 필요합니다.",

  // ── trust ──
  "A brain on your stack,": "당신의 스택 위의 브레인,",
  "on your terms.": "당신의 조건으로.",
  "TeamMate reasons over your operation to help you, never to train on. Connections are permissioned and revocable, and everything you build in Team is yours to keep.":
    "TeamMate는 당신을 돕기 위해 운영을 추론할 뿐, 학습에 사용하지 않습니다. 연동은 권한 기반이며 언제든 해제할 수 있고, Team에서 만든 모든 것은 당신의 것입니다.",
  "See our security &amp; trust": "보안 &amp; 신뢰 살펴보기",
  "Works for you, only": "오직 당신을 위해",
  "Your data is never used to train models, full stop. TeamMate reasons over your operation to help you run it, and for nothing else.":
    "당신의 데이터는 어떤 경우에도 모델 학습에 사용되지 않습니다. TeamMate는 운영을 돕기 위해서만 추론하며, 그 외의 목적은 없습니다.",
  "Permissioned, and revocable": "권한 기반, 언제든 해제",
  "You choose what TeamMate can see, source by source, and you can cut off any connection the moment you decide to.":
    "TeamMate가 볼 수 있는 범위를 소스별로 직접 정하고, 원하는 순간에 어떤 연동이든 끊을 수 있습니다.",
  "Yours to keep": "당신의 것",
  "Everything you build in Team stays portable and exportable. No lock-in, no data held hostage if you ever leave.":
    "Team에서 만든 모든 것은 옮기고 내보낼 수 있습니다. 종속도, 떠날 때 붙잡히는 데이터도 없습니다.",

  // ── final CTA ──
  "Put a brain on your": "다음 릴리스에",
  "next release.": "브레인을 더하세요.",
};
