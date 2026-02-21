import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SecurityDashboard } from "@/components/security-dashboard";

export default async function SecurityPage() {
    const supabase = await createClient();
    const { data: authData, error } = await supabase.auth.getUser();

    if (error || !authData?.user) {
        redirect("/auth/login");
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("user_id", authData.user.id)
        .single();

    if (!profile || profile.role !== "security") {
        redirect("/protected");
    }

    return <SecurityDashboard />;
}
