import type { CopyMap } from "../koLocalize";

/**
 * Korean copy for /contact.
 *
 * The only page so far with a real form, so it needs the attribute map as well
 * as the text-node one — a placeholder left in English is as visible as a
 * heading, and `aria-label` more so to anyone using a screen reader.
 *
 * Placeholder NAMES are localised: "Jane"/"Doe" are examples of what to type,
 * and a Korean form asking for a first name should show a Korean given name.
 * The email placeholder keeps its Latin form, since an email address is Latin
 * regardless of locale.
 */
export const KO_CONTACT: CopyMap = {
  "Let's": "이야기",
  "talk.": "나눠요.",
  "A question, a walkthrough, or bringing your whole roster onto Team, tell us what you're after and the right person will get back to you.":
    "제품 문의, 데모 요청 또는 로스터 전체에 Team을 도입하려는 경우 필요한 내용을 알려주세요. 담당자가 확인 후 회신드립니다.",
  "Email us": "이메일 보내기",
  "Prefer to write?": "글로 남기고 싶으신가요?",
  "Book a demo": "데모 예약하기",
  "See Team run a release, live.": "Team이 릴리스를 운영하는 모습을 직접 확인하세요.",
  "Grab a slot": "시간 예약하기",
  "Already a customer?": "이미 고객이신가요?",
  "Reach support from inside your workspace, we answer fast.":
    "워크스페이스 안에서 바로 문의해 주세요. 빠르게 답변드립니다.",

  // ── form ──
  "First name": "이름",
  "Last name": "성",
  "Email address": "이메일 주소",
  "Label or company": "레이블 또는 회사",
  "I'm here about": "문의 유형",
  "Artists": "아티스트",
  "Managers": "매니저",
  "Labels": "레이블",
  "Distributors": "유통사",
  "Enterprise": "엔터프라이즈",
  "Message": "메시지",
  "Send message": "메시지 보내기",

  // ── success state ──
  "Message sent.": "메시지를 보냈습니다.",
  "Thanks for reaching out. The right person on the team will be in touch shortly, usually within a business day.":
    "문의해 주셔서 감사합니다. 담당자가 곧 연락드리며, 보통 영업일 기준 하루 안에 회신드립니다.",
};

/** Placeholders and labels carried on attributes rather than text nodes. */
export const KO_CONTACT_ATTRS: CopyMap = {
  "Jane": "길동",
  "Doe": "홍",
  "you@yourlabel.com": "you@yourlabel.com",
  "Your label, company, or team": "레이블, 회사 또는 팀",
  "Tell us what you're looking for...": "무엇을 찾고 계신지 알려주세요...",
};

/** The one string v2-contact.js writes, supplied via a data attribute. */
export const KO_CONTACT_SENDING = "보내는 중…";
