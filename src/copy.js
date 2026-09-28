// All editable copy lives here. The homepage, the three interior pages,
// and the meta description are filled from this file at build time.
// Nav labels (waitlist, camera roll, now, github) and the contact
// handles are real and stay in the page chrome, not here.
//
// The hello line is locked: text, and the typing settings below it.

export const typing = { speed: 55, window: 4 };

const headlineLines = [
  "[headline line 1]",
  "[headline line 2]",
  "[headline line 3]",
];

export const copy = {
  hello: "hello, fellow human...",
  headline: headlineLines.join("\n"),
  headlineLabel: headlineLines.join(" "),
  subline: "[sub-line: one short sentence]",

  waitlistButton: "[waitlist button]",
  waitlistCardTitle: "[waitlist card title]",
  waitlistCardText: "[waitlist card text, one short line]",
  waitlistStatus: "[status]",
  waitlistCta: "[cta]",

  cameraRollTitle: "[camera roll title]",
  cameraRollDescription: "[camera roll description]",
  cameraRollMeta: "[meta]",
  cameraRollCta: "[cta]",

  nowTitle: "[title]",
  nowDescription: "[now description]",
  nowDate: "[date]",

  githubTitle: "[title]",
  githubDescription: "[github description]",

  contactLeadIn: "[contact lead-in]",
  footerLine: "[footer line]",

  waitlistPage: "[placeholder]",
  cameraRollPage: "[placeholder]",
  nowPage: "[placeholder]",

  metaDescription: "[placeholder]",
};
