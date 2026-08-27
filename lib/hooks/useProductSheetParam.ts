"use client";

import { useCallback, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const PARAM = "producto";

export function useProductSheetParam() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const productId = searchParams.get(PARAM);
  const openedInApp = useRef(false);

  const open = useCallback(
    (id: string) => {
      openedInApp.current = true;
      const params = new URLSearchParams(searchParams.toString());
      params.set(PARAM, id);
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const close = useCallback(() => {
    if (openedInApp.current) {
      router.back();
    } else {
      const params = new URLSearchParams(searchParams.toString());
      params.delete(PARAM);
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    }
    openedInApp.current = false;
  }, [pathname, router, searchParams]);

  return { productId, open, close };
}
