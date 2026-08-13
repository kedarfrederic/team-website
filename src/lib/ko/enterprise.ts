import type { CopyMap } from "../koLocalize";
import { KO_ICP_COMMON } from "./icpCommon";

/**
 * Korean copy for /enterprise.
 *
 * Identity and access vocabulary stays English — SSO, SAML, SCIM, RBAC, IdP.
 * These appear verbatim in Korean security questionnaires and procurement
 * checklists, which is the document this page has to survive contact with.
 *
 * "Imprint" is rendered 산하 레이블 (sub-label under a parent) rather than
 * transliterated, because 임프린트 reads as a printing term in Korean and the
 * page's whole structure is about a parent org containing several of them.
 *
 * Note this page makes procurement-facing CLAIMS (audit export, residency,
 * provisioning). The Korean states exactly what the English does — no more —
 * since a Korean buyer may hold us to it in a questionnaire.
 */
const PAGE: CopyMap = {
  // ── hero ──
  "The brain for your operation,": "당신의 조직을 위한 브레인,",
  "at your scale.": "당신의 규모에 맞게.",
  "Labels and distributors running at scale need more than a tool. They need deployment across a whole org, the controls procurement expects, and a partner on the other end.":
    "규모 있게 운영하는 레이블과 유통사에는 도구 이상이 필요합니다. 조직 전체에 걸친 배포, 구매 부서가 요구하는 통제 장치, 그리고 맞은편에 있어 줄 파트너가 필요합니다.",
  "Team is built to meet all three, with one brain per release and one administrative view over everything.":
    "Team은 그 셋을 모두 충족하도록 만들어졌습니다. 릴리스마다 하나의 브레인, 그리고 전체를 아우르는 하나의 관리 화면.",
  "Talk to us": "문의하기",

  // ── overnight strip ──
  "Provisioned workspaces for the": "워크스페이스를 프로비저닝했습니다 —",
  "new imprint's roster": "새 산하 레이블의 로스터",
  "Synced roles from your IdP.": "IdP에서 역할을 동기화했습니다.",
  "40 seats": "40석",
  "active.": "활성화됨.",
  "Compiled the quarter's": "분기 자료를 정리했습니다 —",
  "audit export": "감사 로그 내보내기",
  "for your security team.": "보안팀 전달용.",

  // ── the gaps ──
  "Every unit runs well alone.": "각 조직은 따로 보면 잘 돌아갑니다.",
  "The risk is the gaps.": "리스크는 그 사이의 틈입니다.",
  "Each imprint has its own tools, its own trackers, its own view. Nobody sees the whole operation, and the risk hides between the units.":
    "산하 레이블마다 각자의 도구와 트래커, 각자의 화면이 있습니다. 조직 전체를 보는 사람은 없고, 리스크는 그 사이에 숨습니다.",
  "Imprint A": "산하 레이블 A",
  "pop · 40 releases/yr": "pop · 연 40건",
  "Runs on": "사용 도구",
  "Own tools": "자체 도구",
  "Own trackers": "자체 트래커",
  "Own team": "자체 팀",
  "Imprint B": "산하 레이블 B",
  "electronic · global": "electronic · 글로벌",
  "Separate stack": "별도 스택",
  "Separate calendar": "별도 캘린더",
  "Distribution arm": "유통 부문",
  "1,000+ deliveries": "1,000건 이상 납품",
  "No shared view": "공유 화면 없음",
  "No one sees the whole operation, and risk hides between units":
    "조직 전체를 보는 사람이 없고, 리스크는 조직 사이에 숨습니다",
  "Every unit runs well alone. The risk is": "각 조직은 따로 보면 잘 돌아갑니다. 리스크는",
  "everything you can't see at once.": "한눈에 볼 수 없는 모든 것입니다.",

  // ── one console ──
  "One console,": "하나의 콘솔로,",
  "over the whole operation.": "조직 전체를.",
  "Deploy Team across every imprint, team and release, with a single administrative view, the controls procurement expects, and support that knows your rollout.":
    "모든 산하 레이블과 팀, 릴리스에 Team을 배포하세요. 하나의 관리 화면, 구매 부서가 요구하는 통제 장치, 그리고 당신의 롤아웃을 아는 지원과 함께.",
  "pop label": "pop 레이블",
  "Live": "운영 중",
  "electronic label": "electronic 레이블",
  "Distribution": "유통",
  "delivery arm": "납품 부문",
  "Rolling out": "도입 중",
  "Management": "매니지먼트",
  "artist mgmt": "아티스트 매니지먼트",
  "Deployment": "배포",
  "Access": "접근 권한",
  "SSO on": "SSO 적용",
  "Audit": "감사",
  "Logging": "로깅",
  "Support": "지원",
  "Named contact": "전담 담당자",
  "Fully deployed, one brain per release across the label.":
    "전면 배포 완료. 레이블 전체에서 릴리스마다 하나의 브레인.",
  "28 seats": "28석",
  "Live across the team, audit logging on.": "팀 전체 운영 중, 감사 로깅 활성화.",
  "Onboarding": "온보딩",
  "Rolling out this month, the delivery pipeline is connecting now.":
    "이번 달 도입 중이며, 납품 파이프라인을 연결하고 있습니다.",
  "12 seats": "12석",
  "Connected, one view across the whole roster.": "연결 완료, 로스터 전체를 하나의 화면으로.",

  // ── built for the org ──
  "Built for the whole org,": "조직 전체를 위해,",
  "on your terms.": "당신의 조건으로.",
  "One brain across every release, with the deployment, controls and paperwork a large operation runs on.":
    "모든 릴리스를 아우르는 하나의 브레인에, 대규모 조직이 필요로 하는 배포와 통제, 문서를 더했습니다.",
  "Deploy across the roster": "로스터 전체에 배포",
  "Stand Team up across every imprint, team and release, then manage it all from one administrative view.":
    "모든 산하 레이블과 팀, 릴리스에 Team을 구축하고, 하나의 관리 화면에서 전체를 관리하세요.",
  "Access on your terms": "당신의 조건에 맞는 접근 권한",
  "SSO, SAML, SCIM and role-based access, scoped per imprint, run through the systems you already have.":
    "SSO, SAML, SCIM, 역할 기반 접근 권한을 산하 레이블 단위로 적용하며, 이미 쓰는 시스템을 통해 운영합니다.",
  "Auditable by design": "설계부터 감사 가능하게",
  "Every action logged with a receipt, exportable for your security and compliance teams on demand.":
    "모든 작업이 근거와 함께 기록되며, 보안 및 컴플라이언스 팀이 필요할 때 내보낼 수 있습니다.",
  "A partner, not a portal": "포털이 아니라 파트너",
  "Dedicated onboarding, a named point of contact and hands-on rollout, with us alongside you.":
    "전담 온보딩과 지정된 담당자, 그리고 직접 함께하는 도입 과정.",

  // ── admin console ──
  "Organisation · admin": "조직 · 관리",
  "40 seats, live": "40석, 운영 중",
  "28 seats, live": "28석, 운영 중",
  "rolling out": "도입 중",
  "Rollout": "도입",
  "12 seats, live": "12석, 운영 중",
  "Access · role-based": "접근 권한 · 역할 기반",
  "Who sees": "누가 무엇을",
  "what.": "보는지.",
  "role-based, org-wide": "역할 기반, 조직 전체",
  "SSO and SAML sign-on": "SSO 및 SAML 로그인",
  "Role-based access control": "역할 기반 접근 제어",
  "SCIM provisioning from your IdP": "IdP를 통한 SCIM 프로비저닝",
  "Scoped access per imprint": "산하 레이블별 접근 범위 설정",
  "People join and leave through the systems you already run.":
    "입사와 퇴사가 이미 쓰는 시스템을 통해 반영됩니다.",
  "Audit log": "감사 로그",
  "Audit log · exportable": "감사 로그 · 내보내기 가능",
  "Master approved, Nova LP, by A. Rivera": "마스터 승인, Nova LP, A. Rivera",
  "Logged": "기록됨",
  "Distributor delivery, Kite single": "유통사 납품, Kite 싱글",
  "Role granted, Imprint B": "역할 부여, 산하 레이블 B",
  "Weekly export sent to security": "주간 내보내기 보안팀 전달 완료",
  "Ready": "준비됨",

  // ── rollout ──
  "Rollout · with you": "도입 · 함께",
  /* Renders as `Live in <em>weeks.</em>` — no number between them, so a
     literal split gives the fragment "가동까지 주." Korean puts the unit with
     the noun, so the whole phrase moves into the emphasised half. */
  "Live in": "몇",
  "weeks.": "주 만에 가동.",
  "with us alongside you": "저희가 함께합니다",
  "Connect, we map your stack with you": "연결 — 스택을 함께 정리합니다",
  "Configure, roles and access set up": "설정 — 역할과 접근 권한을 구성합니다",
  "Go live, dedicated support": "가동 — 전담 지원과 함께",
  "Quarterly review, ongoing": "분기 리뷰 — 지속적으로",
  "Dedicated onboarding and a named point of contact.": "전담 온보딩과 지정된 담당자.",

  // ── after hours ──
  "While your teams were offline,": "팀들이 자리를 비운 사이,",
  "Team ran the org.": "Team이 조직을 운영했습니다.",
  "At scale, the admin never stops. Team keeps the operation synced overnight and hands your admins a short brief with only what needs a decision.":
    "규모가 커지면 관리 업무는 멈추지 않습니다. Team은 밤사이 조직을 동기화하고, 결정이 필요한 것만 담은 짧은 브리프를 관리자에게 전달합니다.",
  "TeamMate · across the org": "TeamMate · 조직 전반",
  "Provisioned": "프로비저닝했습니다 —",
  "12 new workspaces": "새 워크스페이스 12개",
  "for Imprint A's incoming roster.": "산하 레이블 A의 신규 로스터용.",
  "Synced roles from your identity provider.": "아이덴티티 제공자에서 역할을 동기화했습니다.",
  "3 joiners, 1 leaver": "입사 3명, 퇴사 1명",
  "applied.": "반영 완료.",
  "Compiled the": "정리했습니다 —",
  "weekly audit export": "주간 감사 로그 내보내기",
  "data residency question": "데이터 저장 위치 관련 문의",
  "from procurement needs your legal team.": "가 구매 부서에서 접수되어 법무팀 확인이 필요합니다.",
  "Admin brief:": "관리 브리프:",
  "org synced, workspaces provisioned, audit exported. One item, a residency question for legal.":
    "조직 동기화, 워크스페이스 프로비저닝, 감사 로그 내보내기 완료. 남은 한 건은 법무팀에 전달할 데이터 저장 위치 문의입니다.",

  // ── outcome band ──
  "What Team at scale": "규모에 맞춘 Team이",
  "Team does not replace your teams or their tools. It connects them into one intelligence, with the controls and the single view an operation your size needs.":
    "Team은 팀도, 그들의 도구도 대체하지 않습니다. 그것들을 하나의 인텔리전스로 연결하고, 이 규모의 조직에 필요한 통제 장치와 단일 화면을 더합니다.",
  "view over the org": "조직 전체를 보는 화면",
  "Every imprint, team and release in a single administrative picture.":
    "모든 산하 레이블과 팀, 릴리스를 하나의 관리 화면에.",
  "auditable": "감사 가능",
  "Every action logged with a receipt, exportable for review.":
    "모든 작업이 근거와 함께 기록되며, 검토용으로 내보낼 수 있습니다.",
  "to go live": "가동까지",
  "Deployed across the org in weeks, with us alongside, not quarters.":
    "분기가 아니라 몇 주 만에, 저희가 함께하며 조직 전체에 배포합니다.",

  // ── final CTA ──
  "Design partner program": "디자인 파트너 프로그램",
  "Bring the brain to": "조직 전체에",
  "your whole operation.": "브레인을 도입하세요.",
  "We're onboarding a small group of labels and distributors as design partners, with early access, direct input on the roadmap, and hands-on rollout.":
    "소수의 레이블과 유통사를 디자인 파트너로 모시고 있습니다. 얼리 액세스와 로드맵에 대한 직접적인 의견 제시, 그리고 직접 함께하는 도입 과정을 제공합니다.",
};

export const KO_ENTERPRISE: CopyMap = { ...KO_ICP_COMMON, ...PAGE };
