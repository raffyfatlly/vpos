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
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Team Members</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Add New Member</CardTitle>
        </CardHeader>
        <CardContent>
          <InvitationForm onInvite={refetch} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Members List</CardTitle>
        </CardHeader>
        <CardContent>
          <MembersList profiles={profiles || []} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Members;