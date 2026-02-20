import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardClient } from "@/components/dashboard-client";

export default async function ProtectedPage() {
  const supabase = await createClient();
  const { data: authData, error } = await supabase.auth.getUser();

  if (error || !authData?.user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, room_number")
    .eq("user_id", authData.user.id)
    .single();

  return (
    <DashboardClient
      username={profile?.username || authData.user.email || "User"}
      roomNumber={profile?.room_number || "—"}
    />
  );
}
