import { redirect } from "next/navigation";

// v4 is now the site homepage; keep the old path working.
export default function V4Redirect() {
  redirect("/");
}
