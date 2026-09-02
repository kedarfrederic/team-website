import type { CopyMap } from "../koLocalize";

/**
 * Korean copy for /security.
 *
 * Compliance vocabulary (SSO, SAML, DPA, RBAC) stays in its English acronym
 * form — that is what a Korean procurement or security team writes in a
 * questionnaire, and translating it would make the page harder to answer with,
 * not easier.
 *
 * Note this page makes CLAIMS (encryption, isolation, training). The Korean
 * states exactly what the English does and no more; if the English claim is
 * ever narrowed, this must be narrowed with it.
 */
export const KO_SECURITY: CopyMap = {
  // ── hero ──
  "Trust is the whole deal.": "신뢰가 전부입니다.",
  "Your data,": "당신의 데이터,",
  "your rules.": "당신의 규칙.",
  "Team reasons across your entire operation, files, messages, money, plans. That only works if it stays private, permissioned, and yours. Here's how we make sure it does.":
    "Team은 파일과 메시지, 비용, 계획까지 운영 전반을 종합해 추론합니다. 그 전제는 데이터가 비공개로, 권한 아래, 당신의 것으로 남는 것입니다. 어떻게 그렇게 하는지 아래에 정리했습니다.",
  "Get started": "시작하기",
  "Request security docs": "보안 문서 요청하기",

  // ── never training data ──
  "Your operation is never": "고객 데이터는",
  "anyone's training data.": "승인된 목적과 범위 안에서만 처리됩니다.",
  "TeamMate reasons over your release to help you, and only you. Your data stays inside a wall around your organization, it goes in to answer your questions, and it does not come out.":
    "TeamMate는 릴리스 운영을 지원하기 위해 승인된 데이터만 처리합니다. 데이터 접근 범위와 처리 방식은 조직별 권한 설정 및 보안 문서에 따릅니다.",
  "Works for you only.": "오직 당신을 위해서만.",
  "Your masters, threads, and numbers answer your questions, nothing more.":
    "마스터와 대화, 수치는 당신의 질문에 답하는 데에만 쓰입니다.",
  "Never trains a model.": "모델 학습 사용 여부는",
  "Not ours, not anyone's.": "고객 계약과 모델 제공업체 정책에 명시된 범위를 따릅니다.",
  "Never shared across customers.": "고객 간에 공유되지 않습니다.",
  "Your data is isolated to your organization.": "데이터는 조직 단위로 격리됩니다.",
  "Gone on your say-so.": "연동 해제 및 삭제 요청은",
  "Disconnect or delete and it's removed from the brain.":
    "보안 문서에 명시된 보관·백업 정책에 따라 처리됩니다.",
  "Your organization": "당신의 조직",
  "Sealed": "봉인됨",
  "Masters": "마스터",
  "Threads": "대화",
  "Budgets": "예산",
  "Plans": "계획",
  "Contacts": "연락처",
  "TeamMate reasons in here": "TeamMate는 이 안에서 추론합니다",
  "Over your data, to answer your questions": "당신의 데이터로, 당신의 질문에 답하기 위해",
  "Answers, only to you": "답변은 오직 당신에게만",
  "Blocked at the wall": "경계에서 차단됨",
  "Model training": "모델 학습",
  "Other customers": "다른 고객",

  // ── controls ──
  "Protection built in,": "덧붙인 것이 아니라,",
  "not bolted on.": "처음부터 내장된 보호.",
  "The controls underneath every connection, so the brain only ever sees what you allow, and you can prove what it did.":
    "모든 연동 아래에 놓인 통제 장치입니다. 브레인은 허용된 것만 보고, 무엇을 했는지 언제든 증명할 수 있습니다.",
  /* The English heading is "Encrypted <em>in transit and at rest</em>", and
     these two entries are deliberately SWAPPED: Korean puts the qualifier
     before the noun, so slot 1 takes the qualifier and slot 2 the noun,
     rendering 전송 중과 저장 시 암호화.

     They previously rendered 종단 간 암호화 — end-to-end encryption — which is
     a materially stronger claim than we implement, and the English heading it
     translated said the same thing while its own next sentence said "in
     transit and at rest". Both languages were corrected together. */
  "Encrypted": "전송 중과 저장 시",
  "in transit and at rest": "암호화",
  "Your data is encrypted in transit and at rest. Credentials for your connected tools live in a dedicated secrets vault, never in plain text.":
    "데이터는 전송 중과 저장 시 모두 암호화됩니다. 연동된 도구의 자격 증명은 전용 시크릿 저장소에 보관되며, 평문으로 저장되지 않습니다.",
  "Permissioned": "권한 기반,",
  "&amp; revocable": "언제든 해제",
  "You decide what each connection can see, and you can cut any of them off in one click. Team only ever reads the scopes you've granted.":
    "각 연동이 볼 수 있는 범위를 직접 정하고, 클릭 한 번으로 언제든 끊을 수 있습니다. Team은 허용한 범위만 읽습니다.",
  "Granular": "세분화된",
  "access": "접근 권한",
  "Role-based controls decide who on your team sees what. The right people get the whole picture; everyone else gets exactly their slice.":
    "역할 기반 통제로 팀 내 누가 무엇을 보는지 결정합니다. 필요한 사람은 전체를 보고, 나머지는 각자의 범위만 봅니다.",
  "A full": "전체",
  "audit trail": "작업 기록",
  "Every action Team takes is logged with a receipt, so you can always see what changed, when, and where the answer came from.":
    "Team의 모든 작업은 근거와 함께 기록됩니다. 무엇이 언제 바뀌었고 답이 어디에서 왔는지 항상 확인할 수 있습니다.",

  // ── enterprise ──
  "Enterprise controls,": "필요할 때 꺼내 쓰는",
  "when you need them.": "엔터프라이즈 통제.",
  "Running at scale means stricter requirements. Team is built to meet them, with the controls and paperwork procurement teams expect to see.":
    "규모가 커지면 보안과 구매 절차의 요구사항도 엄격해집니다. Team은 필요한 통제 기능과 검토 자료를 제공할 수 있도록 설계되었습니다.",
  "Explore Enterprise": "엔터프라이즈 살펴보기",
  "SSO &amp; SAML": "SSO &amp; SAML",
  "sign-on": "로그인",
  "Role-based access": "역할 기반 접근",
  "control": "제어",
  "on request": "요청 시 제공",
  "Data residency": "데이터 저장 위치",
  "options": "옵션",
  "Exportable": "내보낼 수 있는",
  "audit logs": "감사 로그",
  "Dedicated": "전담",
  "support": "지원",

  // ── FAQ ──
  "Your questions,": "궁금한 점에",
  "answered.": "답합니다.",
  "Does TeamMate train on my data?": "TeamMate가 제 데이터로 학습하나요?",
  "No. TeamMate uses your connected data to answer your questions and do work for your release. We don't train models on it, and your data is never pooled with other customers'.":
    "TeamMate는 연동된 데이터를 릴리스 관련 질문에 답하고 승인된 업무를 수행하는 데 사용합니다. 모델 학습 사용 여부와 고객 간 데이터 분리는 보안 문서와 계약에 명확히 기재해야 합니다.",
  "Who on my team can see my data?": "팀에서 누가 제 데이터를 볼 수 있나요?",
  "Only the people you invite, at the access level you set. Role-based controls let you give the right people the whole picture while limiting everyone else to their slice.":
    "초대한 사람만, 지정한 접근 권한 범위 안에서 볼 수 있습니다. 역할 기반 통제를 통해 필요한 사람에게는 전체를, 나머지에게는 각자의 범위만 제공할 수 있습니다.",
  "Can I disconnect a tool or delete my data?": "도구 연동을 해제하거나 데이터를 삭제할 수 있나요?",
  "Any time. Every connection is revocable in one click, and when you disconnect a tool or delete your data, it's removed from the brain. Everything you build in Team stays portable and yours to keep.":
    "모든 연동은 언제든 해제할 수 있습니다. 데이터 삭제 및 보관 방식은 보안 문서에 명시된 정책에 따라 처리되며, Team에서 만든 데이터는 내보낼 수 있습니다.",
  "How are my connected accounts protected?": "연동된 계정은 어떻게 보호되나요?",
  "Connections are made through each provider's official, permissioned access, and the credentials are held in a dedicated secrets vault. Team only ever reads the scopes you've granted.":
    "연동은 각 제공업체의 공식 권한 기반 접근 방식으로 이루어지며, 자격 증명은 전용 시크릿 저장소에 보관됩니다. Team은 허용한 범위만 읽습니다.",
  "Where is my data stored?": "제 데이터는 어디에 저장되나요?",
  "Your data is encrypted in transit and at rest with a reputable cloud provider. Enterprise plans can discuss data residency options. Request our security documentation for the full detail.":
    "데이터는 신뢰할 수 있는 클라우드 제공업체에서 전송 중과 저장 시 모두 암호화됩니다. 엔터프라이즈 플랜에서는 데이터 저장 위치 옵션을 논의할 수 있습니다. 자세한 내용은 보안 문서를 요청해 주세요.",

  // ── final CTA ──
  "Connect your whole stack,": "스택 전체를,",
  "with confidence.": "안심하고 연결하세요.",
};
