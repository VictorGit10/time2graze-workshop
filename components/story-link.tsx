'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';

/** Next's same-route navigation need not emit hashchange; notify the disclosures explicitly. */
export function StoryLink({ href, className, children }: { href: string; className?: string; children: ReactNode }) {
  return <Link href={href} className={className} onClick={(event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    const target = new URL(event.currentTarget.href);
    if (target.pathname !== window.location.pathname || !target.hash.startsWith('#about-')) return;
    event.preventDefault();
    if (window.location.hash !== target.hash) window.history.pushState(null, '', target.hash);
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  }}>{children}</Link>;
}
