import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InvitationForm } from "@/components/admin/members/InvitationForm";
import { MembersList } from "@/components/admin/members/MembersList";

const Members = () => {
  const { data: profiles, isLoading, refetch } = useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*");
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Team Members</h1>
      
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">Add New Member</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <InvitationForm onInvite={refetch} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">Members List</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <MembersList profiles={profiles || []} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Members;