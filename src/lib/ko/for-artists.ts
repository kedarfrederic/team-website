import type { CopyMap } from "../koLocalize";
import { KO_ICP_COMMON } from "./icpCommon";

/**
 * Korean copy for /for-artists.
 *
 * The page's whole argument is that an independent artist is three roles at
 * once, so the Korean keeps that structure literally — 아티스트 / 레이블 /
 * 매니저 as three separate hats rather than smoothing them into one phrase.
 *
 * Filenames, fictional figures and tool names stay as they are. Numbers in the
 * outcome band ("0 hrs") are placeholders in the English too — left alone.
 */
const PAGE: CopyMap = {
  // ── hero ──
  "A label-grade rollout,": "레이블 수준의 롤아웃을,",
  "solo.": "혼자서.",
  "Independent means you're the artist, the label, and the project manager all at once.":
    "독립적으로 활동한다는 건 아티스트이자 레이블이자 프로젝트 매니저를 동시에 맡는다는 뜻입니다.",
  "Team holds the whole release in one place, remembers every version and every deadline, and does the busywork, so you run like you have a team when it's just you.":
    "Team은 릴리스 전체를 한곳에 담고, 모든 버전과 마감을 기억하며, 잡무를 대신합니다. 혼자여도 팀이 있는 것처럼 움직일 수 있습니다.",

  // ── overnight strip ──
  "Locked": "확정",
  "as the approved master and flagged the old file.":
    "를 승인된 마스터로 지정하고 이전 파일을 표시했습니다.",
  "Drafted next week's content calendar for your approval.":
    "다음 주 콘텐츠 캘린더를 작성했습니다. 승인해 주세요.",
  "Distributor cutoff is in": "유통사 마감이",
  "6 days": "6일",
  "and metadata is incomplete.": "남았는데 메타데이터가 아직 미완성입니다.",

  // ── you're the whole team ──
  "You're the whole team,": "당신이 팀 전체이고,",
  "and it's a lot.": "그건 벅찬 일입니다.",
  "The music, the visuals, the rollout, the deadlines. Nobody's tracking it but you, and you're also the one making it.":
    "음악, 비주얼, 롤아웃, 마감. 이걸 챙기는 사람은 당신뿐인데, 만드는 사람도 당신입니다.",
  "You, the artist": "아티스트로서의 당신",
  "making the music": "음악을 만드는",
  "Juggling": "동시에 챙기는 것",
  "Masters": "마스터",
  "Stems": "스템",
  "Features": "피처링",
  "Mixes": "믹스",
  "You, the label": "레이블로서의 당신",
  "running the release": "릴리스를 운영하는",
  "Distributor": "유통사",
  "Splits": "분배",
  "Playlist pitches": "플레이리스트 피칭",
  "Socials": "소셜",
  "You, the manager": "매니저로서의 당신",
  "keeping it on track": "일정을 지키는",
  "Deadlines": "마감은",
  "in your head": "머릿속에",
  "A cutoff is slipping while you're in the studio": "스튜디오에 있는 사이 마감이 밀리고 있습니다",
  "The creative work is the part you love. The other ninety percent is":
    "창작은 당신이 사랑하는 일입니다. 나머지 90%가",
  "why releases slip.": "릴리스를 밀리게 합니다.",

  // ── rollout timeline ──
  "Your rollout,": "당신의 롤아웃이,",
  "running seamlessly.": "막힘없이 굴러갑니다.",
  "Team holds the whole release and moves it forward while you make the music, so every phase is handled and only the calls that are yours reach you.":
    "당신이 음악을 만드는 동안 Team이 릴리스 전체를 붙잡고 앞으로 나아갑니다. 모든 단계가 처리되고, 당신이 내려야 할 결정만 전달됩니다.",
  "Announce": "공지",
  "this week": "이번 주",
  "On track": "정상 진행",
  "Pre-save": "프리세이브",
  "next week": "다음 주",
  "Release week": "발매 주간",
  "in 3 weeks": "3주 후",
  "Post-release": "발매 이후",
  "after launch": "발매 후",
  "Teaser scheduled": "티저 예약 완료",
  "Press one-sheet drafted": "프레스 원시트 초안 작성",
  "Pre-save link created": "프리세이브 링크 생성",
  "Announcement post, ready to approve": "공지 게시물, 승인 대기",
  "All set. The announcement goes out Thursday.": "준비됐습니다. 공지는 목요일에 나갑니다.",
  "Pre-save live": "프리세이브 오픈",
  "Playlist pitches sent": "플레이리스트 피칭 발송",
  "Fan email, drafted for you": "팬 이메일 초안 작성 완료",
  "Content calendar, ready to approve": "콘텐츠 캘린더, 승인 대기",
  "Pitches are out, awaiting playlist replies.": "피칭을 보냈고, 플레이리스트 회신을 기다리는 중입니다.",
  "Master delivered": "마스터 전달 완료",
  "Distributor metadata, needs you": "유통사 메타데이터, 확인 필요",
  "Video cut in review": "영상 편집본 검토 중",
  "Launch posts scheduled": "발매 게시물 예약 완료",
  "Finish the distributor metadata, the cutoff is in 6 days.":
    "유통사 메타데이터를 마무리해 주세요. 마감이 6일 남았습니다.",
  "Thank-you post, drafted": "감사 게시물 초안 작성",
  "Streaming report, compiling": "스트리밍 리포트 집계 중",
  "Pitch to bigger playlists": "더 큰 플레이리스트에 피칭",
  "Plan the next single": "다음 싱글 계획",
  "Team will run the recap the day after release.": "발매 다음 날 Team이 리캡을 정리합니다.",

  // ── see your release ──
  "See your release": "Team이 보는 방식으로",
  "the way Team does.": "릴리스를 보세요.",
  "One place that actually knows your release. Scan it, ask it, and never send the wrong file again.":
    "당신의 릴리스를 실제로 아는 한곳입니다. 훑어보고, 물어보고, 다시는 잘못된 파일을 보내지 마세요.",
  "Never miss a deadline": "마감을 놓치지 않습니다",
  "Every date on your release in one live view, ranked by what needs you first.":
    "릴리스의 모든 날짜를 하나의 실시간 화면에, 당신이 먼저 봐야 할 순서로.",
  "Always the right version": "언제나 올바른 버전",
  "Every file tracked and tagged, so the approved master is the only one that can go out.":
    "모든 파일을 추적하고 태그해, 승인된 마스터만 나갈 수 있습니다.",
  "Ask it anything": "무엇이든 물어보세요",
  "A straight answer on your release, drawn from your files and threads, not your memory.":
    "당신의 기억이 아니라 파일과 대화에서 끌어낸, 릴리스에 대한 분명한 답.",
  "The busywork, done": "잡무는 처리 완료",
  "The admin that steals studio time, drafted and filed while you make the music.":
    "스튜디오 시간을 빼앗는 관리 업무를, 당신이 음악을 만드는 동안 작성하고 정리합니다.",

  // ── dates / files / ask panel ──
  "Your dates": "당신의 일정",
  "Distributor cutoff": "유통사 마감",
  ", Friday": ", 금요일",
  "· metadata due": "· 메타데이터 마감",
  "Now": "지금",
  "Video final": "영상 최종본",
  ", due in 3 days": ", 3일 후 마감",
  "Soon": "곧",
  "Pre-save link": "프리세이브 링크",
  "is live": "오픈됨",
  "Launch": "발매",
  ", in 2 weeks": ", 2주 후",
  "Watching": "주시 중",
  "Files": "파일",
  "approved, tagged final": "승인됨, 최종으로 태그",
  "Current": "현재",
  "archived": "보관됨",
  "Old": "이전",
  "approved": "승인됨",
  "rendering": "렌더링 중",
  "Ask TeamMate": "TeamMate에게 물어보기",
  "Which master is the final?": "어느 마스터가 최종인가요?",
  ", approved and tagged. The old v9 is archived so it cannot go out by mistake.":
    ", 승인되어 태그된 버전입니다. 이전 v9는 보관 처리되어 실수로 나갈 수 없습니다.",
  "What did the distributor say about metadata?": "유통사가 메타데이터에 대해 뭐라고 했나요?",
  "They flagged a": "누락된",
  "missing ISRC": "ISRC를 지적했습니다",
  ". I have drafted the fix for your OK.": ". 수정안을 작성해 두었으니 확인해 주세요.",

  // ── this week ──
  "This week,": "이번 주는,",
  "handled.": "처리했습니다.",
  "while you were in the studio": "스튜디오에 있는 동안",
  "Content calendar drafted": "콘텐츠 캘린더 초안 작성",
  "Feature stem chased and filed": "피처링 스템 확보 및 정리",
  "Credits kept straight": "크레딧 정리 유지",
  "Metadata fix, needs your OK": "메타데이터 수정, 확인 필요",
  "The admin that steals studio time, off your plate.":
    "스튜디오 시간을 빼앗던 관리 업무를 덜어드립니다.",

  // ── while you were in the studio ──
  "While you were in the studio,": "스튜디오에 있는 동안,",
  "Team continued running your rollout.": "Team이 롤아웃을 계속 운영했습니다.",
  "The release does not stop moving while you are writing. Team keeps it on track and feedbacks the calls that are yours.":
    "당신이 곡을 쓰는 동안에도 릴리스는 멈추지 않습니다. Team이 일정을 지키고, 당신이 내려야 할 결정을 전달합니다.",
  "New master landed. Confirmed it is the approved version and flagged the old one.":
    "새 마스터가 도착했습니다. 승인된 버전임을 확인하고 이전 버전을 표시했습니다.",
  "Drafted next week's content calendar from your plan and the release date.":
    "계획과 발매일을 바탕으로 다음 주 콘텐츠 캘린더를 작성했습니다.",
  "Chased your featured artist for their verse. The stem is now in the folder.":
    "피처링 아티스트에게 벌스를 요청했고, 스템이 폴더에 들어왔습니다.",
  "The distributor cutoff is in 6 days and metadata is incomplete. Needs 10 minutes from you.":
    "유통사 마감이 6일 남았고 메타데이터가 미완성입니다. 10분만 내주세요.",
  "Your morning:": "오늘 아침:",
  "master locked, content ready to approve, feature in. One thing due, finish the distributor metadata.":
    "마스터 확정, 콘텐츠 승인 대기, 피처링 확보. 남은 하나는 유통사 메타데이터 마무리입니다.",

  // ── outcome band ──
  "What a release on Team": "Team에서의 릴리스가",
  "You stay independent and keep all of it. Team just makes sure the rollout runs like there's a whole team behind it.":
    "당신은 계속 독립적으로 활동하고, 모든 것을 그대로 갖습니다. Team은 뒤에 팀이 있는 것처럼 롤아웃이 굴러가게 할 뿐입니다.",
  "back every week": "매주 되찾는 시간",
  "missed cutoffs": "놓친 마감",
  "The deadlines that sink indie releases, caught early, every time.":
    "인디 릴리스를 무너뜨리는 마감을, 매번 미리 잡아냅니다.",
  "yours": "당신의 것",
  "Your masters, your data, your rollout. Team works for you, and no one else.":
    "당신의 마스터, 당신의 데이터, 당신의 롤아웃. Team은 오직 당신을 위해 일합니다.",

  // ── final CTA ──
  "Discover the brain behind": "다음 릴리스 뒤의",
  "your next release.": "브레인을 만나보세요.",
  "Team is in early access with independent artists, managers and labels shaping what it becomes. Connect the tools you already use and let Team run the rollout with you from day one.":
    "Team은 독립 아티스트와 매니저, 레이블이 함께 만들어가는 얼리 액세스 단계입니다. 이미 쓰는 도구를 연결하고, 첫날부터 Team과 함께 롤아웃을 운영해 보세요.",
};

/** Shared switcher first so the page's own copy wins any collision. */
export const KO_FOR_ARTISTS: CopyMap = { ...KO_ICP_COMMON, ...PAGE };
