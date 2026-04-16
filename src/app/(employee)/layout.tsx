import { requireRole } from "@/lib/auth";
import { EmployeeLayoutClient } from "@/components/employee-layout-client";

export default async function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireRole("employee");

  return (
    <EmployeeLayoutClient user={{ name: user.name, email: user.email ?? "" }}>
      {children}
    </EmployeeLayoutClient>
  );
}
