import { logoutAction } from "@/app/actions";
import { Button } from "@/components/ui";

export function LogoutForm() {
  return (
    <form
      action={async () => {
        "use server";
        await logoutAction();
      }}
    >
      <Button variant="outline" type="submit">
        Logout
      </Button>
    </form>
  );
}
