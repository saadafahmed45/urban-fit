'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';

export default function AuthGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [status, router, pathname]);

  if (status === 'loading') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-tan" />
        <p className="text-xs font-mono uppercase tracking-widest text-ink/60">
          Verifying Account Session...
        </p>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  const user = {
    ...session.user,
    uid: session.user.id,
    displayName: session.user.name,
  };

  return typeof children === 'function' ? children({ user }) : children;
}
