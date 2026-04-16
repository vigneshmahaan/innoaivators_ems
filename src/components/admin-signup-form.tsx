"use client";

import { useActionState, useState } from "react";
import { adminSignupAction } from "@/app/actions";
import { Button, Input } from "@/components/ui";

const initialState: { error?: string } = {};

export function AdminSignupForm() {
  const [state, formAction, pending] = useActionState(adminSignupAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">Name</label>
        <Input name="name" placeholder="Admin Name" required />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Email</label>
        <Input name="email" type="email" placeholder="Admin Email" required />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Password</label>
        <Input name="password" type="password" placeholder="Password (min 6 characters)" required />
      </div>
      {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
      <Button disabled={pending} type="submit" className="w-full">
        {pending ? "Creating..." : "Create Admin Account"}
      </Button>
    </form>
  );
}
