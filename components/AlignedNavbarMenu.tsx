'use client';

import Link from 'fumadocs-core/link';
import {
  NavbarMenu,
  NavbarMenuContent,
  NavbarMenuTrigger,
} from 'fumadocs-ui/layouts/home/navbar';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';


type AlignedNavbarMenuProps = {
  children: ReactNode;
  contentClassName: string;
  href?: string;
  label: string;
  maxWidth: number;
};


export function AlignedNavbarMenu({
  children,
  contentClassName,
  href,
  label,
  maxWidth,
}: AlignedNavbarMenuProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ left: 16, width: maxWidth });

  const measure = useCallback((trigger = triggerRef.current) => {
    if (!trigger) return;

    const nav = trigger.closest('nav');
    const triggerRect = trigger.getBoundingClientRect();
    const navRect = nav?.getBoundingClientRect() ?? {
      left: 0,
      width: window.innerWidth,
    };
    const left = Math.max(0, triggerRect.left - navRect.left);
    const width = Math.max(0, Math.min(maxWidth, navRect.width - left - 16));
    setPosition({ left, width });
  }, [maxWidth]);

  const updateFromTrigger = useCallback((trigger: HTMLButtonElement) => {
    triggerRef.current = trigger;
    measure(trigger);
  }, [measure]);

  useLayoutEffect(() => {
    const handleResize = () => measure();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [measure]);

  const style = {
    '--zvec-nav-menu-left': `${position.left}px`,
    '--zvec-nav-menu-width': `${position.width}px`,
  } as CSSProperties;

  return (
    <NavbarMenu>
      <NavbarMenuTrigger
        onClick={(event) => updateFromTrigger(event.currentTarget)}
        onFocus={(event) => updateFromTrigger(event.currentTarget)}
        onPointerEnter={(event) => updateFromTrigger(event.currentTarget)}
      >
        {href ? (
          <Link href={href} prefetch={false}>
            <p className="text-base">{label}</p>
          </Link>
        ) : (
          <p className="text-base">{label}</p>
        )}
      </NavbarMenuTrigger>
      <NavbarMenuContent
        className={`zvec-docs-nav-menu zvec-aligned-nav-menu ${contentClassName}`}
        style={style}
      >
        {children}
      </NavbarMenuContent>
    </NavbarMenu>
  );
}
