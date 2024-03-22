import Image from 'next/image';

export function CordLogo() {
  return (
    <a
      href="https://cord.com/"
      title="Cord makes the most complete SDK for chat, commenting, and AI integrations"
      target="_blank"
    >
      <Image src="/cord-logo.svg" width={70} height={23} alt="Cord Logo" />
    </a>
  );
}
