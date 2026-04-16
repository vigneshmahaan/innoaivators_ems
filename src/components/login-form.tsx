"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/actions";
import { Button, Input } from "@/components/ui";

const initialState: { error?: string } = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">Employee ID or Email</label>
        <Input name="identifier" required />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Password</label>
        <Input name="password" type="password" required />
      </div>
      {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
      <Button disabled={pending} type="submit" className="w-full">
        {pending ? "Signing in..." : "Login"}
      </Button>
    </form>
  );
}
