"use client";

import { useActionState } from "react";
import { createEmployeeAction } from "@/app/actions";
import { Button, Input, Select } from "@/components/ui";

const initialState: { error?: string } = {};

export function AddEmployeeForm() {
  const [state, formAction, pending] = useActionState(createEmployeeAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        <Input name="employee_id" placeholder="Employee ID" required />
        <Input name="name" placeholder="Name" required />
        <Input name="email" type="email" placeholder="Email" required />
        <Input name="password" type="password" placeholder="Temporary Password (min 6 chars)" required />
        <Select name="department" required>
          <option value="">Select Department</option>
          <option value="HR">HR</option>
          <option value="Finance">Finance</option>
          <option value="IT">IT</option>
          <option value="Sales">Sales</option>
          <option value="Marketing">Marketing</option>
          <option value="Operations">Operations</option>
          <option value="Customer Service">Customer Service</option>
          <option value="Legal">Legal</option>
          <option value="Product">Product</option>
          <option value="Design">Design</option>
        </Select>
        <input type="hidden" name="role" value="employee" />
      </div>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <Button disabled={pending} type="submit" className="w-full">
        {pending ? "Creating..." : "Create Account"}
      </Button>
    </form>
  );
}
