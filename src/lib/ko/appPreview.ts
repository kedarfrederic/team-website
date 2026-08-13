/**
 * Korean copy for the in-product app preview mock.
 *
 * ONE source for TWO scripts. homepage-v2.js and v2-app-preview.js carry
 * byte-identical POOL and CHAT arrays — the same mock, duplicated in the
 * codebase before this work started. That duplication is not ours to fix here,
 * but it must not become two diverging Korean translations of the same
 * on-screen text, which is what would happen if each page wrote its own.
 *
 * So both pages import from here and pass it under whichever global their
 * script reads: `__TEAM_HOMEPAGE_COPY` on / and `__TEAM_APP_PREVIEW_COPY` on
 * /about. If the English arrays ever diverge, the per-item fallback in each
 * script means the extra rows stay English rather than misaligning.
 *
 * `pool` is [title, tag]; the card's colour class stays in the script, being
 * structure rather than copy. `chat` is [side, header, message] where side 0 is
 * TeamMate and 1 is the user.
 */

export const KO_APP_PREVIEW = {
  labels: { activeNew: "진행 중 · 신규" },
  pool: [
    ["마스터 v10 QC 검수", "오디오"],
    ["프리세이브 링크 오픈", "DSP_활성화"],
    ["바이닐 발주 승인", "운영"],
    ["EPK 갱신 + 프레스 사진", "홍보"],
    ["리릭 비디오 티저 편집", "콘텐츠"],
    ["라디오 원시트 초안", "라디오"],
  ],
  chat: [
    [0, "TEAMMATE · 12:53", "지난 릴리스 3건을 확인했습니다. Ava의 프리세이브 푸시는 4주차보다 2주차에 31% 더 좋은 성과를 냈습니다."],
    [1, "12:54 · 나", "그럼 프리세이브 확산을 앞당겨 주세요."],
    [0, "TEAMMATE · 12:54", "완료했습니다. 25일 목요일로 옮기고 Maya에게 배정했습니다. 예산은 그대로입니다."],
    [1, "12:56 · 나", "이번 주에 아직 담당자가 없는 건 뭐가 있나요?"],
    [0, "TEAMMATE · 12:56", "두 건입니다. 컨트리 플레이리스트 피칭과 공연장 후보 선정. 둘 다 담당자를 지정할까요?"],
    [1, "12:57 · 나", "네, 배정해 주세요."],
    [0, "TEAMMATE · 12:57", "배정했습니다. 플레이리스트 피칭은 Sam, 공연장은 Maya. 타임라인도 업데이트했습니다."],
  ],
} as const;
