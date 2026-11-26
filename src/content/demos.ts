export const demosIntro = {
  eyebrow: 'Try it live',
} as const;

export const buttonDemo = {
  meta: 'Live code · edit me',
  title: 'Build an expressive button',
  body: 'Change the label, corner radius and fill. The preview and the code update as you go.',
  defaultLabel: 'Ping me',
  emptyLabel: 'Button',
  maxLabel: 24,
  labelField: 'Label',
  radiusField: 'Corner radius',
  fillLegend: 'Fill',
  codeLabel: 'Generated code',
  copy: 'Copy code',
  copied: 'Copied',
  reset: 'Reset',
} as const;

export const skillDemo = {
  meta: 'Skill file · from Skills4u',
  title: 'Read a real SKILL.md',
  body: 'Every Skills4u plugin is built around a file like this. The description is what tells Claude when to load it.',
  pickLabel: 'Pick a plugin',
  fileLabel: 'SKILL.md contents',
  extras: 'Also in this plugin:',
  excerptNote: 'First lines of the file',
  cta: { label: 'Open the repo', href: 'https://github.com/Wilch-Kelvin/skills4u' },
} as const;
