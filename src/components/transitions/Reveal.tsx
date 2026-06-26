"use client";

import { useEffect, useRef, type ReactNode, type CSSProperties } from "react";

export function Reveal({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // entrou na zona (~60% da tela) → anima
            entry.target.classList.add("active");
          } else if (entry.boundingClientRect.top > 0) {
            // saiu por baixo (ou ainda não chegou) → reseta pra re-animar ao descer de novo
            entry.target.classList.remove("active");
          }
          // saiu por cima (top < 0): mantém visível, sem re-animar ao rolar pra cima
        });
      },
      // dispara quando o elemento sobe até ~60% da tela (não lá no rodapé)
      { threshold: 0, rootMargin: "0px 0px -40% 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal ${className}`} style={style}>
      {children}
    </div>
  );
}
