"use client";

import { useActionState } from "react";
import { Lock } from "lucide-react";
import { loginAction } from "@/app/admin/actions";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, null);

  return (
    <form action={formAction} className="w-full max-w-sm space-y-4">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink">
          Email
        </label>
        <Input id="email" name="email" type="email" required autoComplete="username" />
      </div>
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-ink">
          Contraseña
        </label>
        <Input id="password" name="password" type="password" required autoComplete="current-password" />
      </div>
      {state?.error && <p className="text-sm text-accent">{state.error}</p>}
      <Button type="submit" className="w-full" size="lg" disabled={pending}>
        <Lock className="h-4 w-4" /> {pending ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
}
