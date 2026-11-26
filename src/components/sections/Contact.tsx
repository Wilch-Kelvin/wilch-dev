import { Icon } from '@/components/ui/Icon';
import { Shape } from '@/components/ui/Shape';
import { contact } from '@/content/site';
import { EmailActions } from './EmailActions';
import { revealProps } from '@/lib/reveal';

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="pb-6">
      <div className="container-page">
        <div {...revealProps()} className="flex">
          <div className="card bg-inverse text-on-inverse relative flex flex-1 flex-col items-start gap-7 overflow-hidden !p-[clamp(28px,6vw,88px)]">
            <div
              aria-hidden="true"
              className="absolute -top-[60px] -right-[60px] aspect-square w-[clamp(150px,24vw,320px)]"
            >
              <Shape name="clover4" color="var(--ia)" className="spin-r h-full w-full" />
            </div>
            <div
              aria-hidden="true"
              className="absolute top-[clamp(90px,16vw,230px)] hidden md:block right-[clamp(40px,18vw,250px)] aspect-square w-[clamp(44px,7vw,96px)]"
            >
              <Shape name="cookie9" color="var(--primary-c)" className="spin h-full w-full" />
            </div>
            <h2
              id="contact-title"
              className="relative m-0 max-w-[calc(100%-clamp(60px,14vw,280px))] text-[clamp(56px,11vw,128px)] leading-[0.9] font-extrabold tracking-[-0.01em]"
            >
              {contact.title}
            </h2>
            <p className="text-on-inverse-var relative m-0 max-w-[46ch] text-[clamp(19px,1.6vw,22px)] leading-relaxed">
              {contact.body}
            </p>
            <div className="relative flex flex-wrap items-center gap-3">
              <a className="btn state-layer bg-ia text-on-ia" href={contact.github.href}>
                <Icon name="github" />
                {contact.github.label}
              </a>
              <a
                className="btn state-layer bg-inverse-raised text-on-inverse"
                href={contact.linkedin.href}
              >
                <Icon name="linkedin" />
                {contact.linkedin.label}
              </a>
              <EmailActions />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
