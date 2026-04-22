"use client";

import { useFormState, useFormStatus } from "react-dom";
import { signInAction } from "@/app/actions/auth.actions";
import { Button } from "@/components/ui/Button";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant="primary"
      className="h-12 w-full"
      disabled={pending}
    >
      {pending ? "Вход…" : "Войти"}
    </Button>
  );
}

export function LoginForm({
  redirectTo,
  initialError,
}: {
  redirectTo: string;
  initialError?: string;
}) {
  const [state, formAction] = useFormState(signInAction, {
    error: initialError,
  });

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="redirect" value={redirectTo} />
      {state.error ? (
        <p className="text-sm text-amber-200/90" role="alert">
          {state.error}
        </p>
      ) : null}
      <div>
        <label htmlFor="admin-email" className="mb-1 block text-sm text-neutral-400">
          Email
        </label>
        <input
          id="admin-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none focus:border-[color:var(--primary)]/50"
        />
      </div>
      <div>
        <label htmlFor="admin-password" className="mb-1 block text-sm text-neutral-400">
          Пароль
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none focus:border-[color:var(--primary)]/50"
        />
      </div>
      <SubmitButton />
    </form>
  );
}
