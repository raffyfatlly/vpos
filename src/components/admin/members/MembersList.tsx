import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { UserRole } from "@/types/pos";

interface Profile {
  id: string;
  username: string | null;
  role: UserRole | null;
  created_at: string | null;
}

export function MembersList({ profiles }: { profiles: Profile[] }) {
  const { toast } = useToast();

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId);

    if (error) {
      toast({
        title: "Error updating role",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Role updated",
      description: "The user's role has been updated successfully.",
    });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-left">Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Created At</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {profiles?.map((profile) => (
          <TableRow key={profile.id}>
            <TableCell className="text-left">{profile.username}</TableCell>
            <TableCell>
              <Select
                defaultValue={profile.role || undefined}
                onValueChange={(value: UserRole) => handleRoleChange(profile.id, value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="both">Both</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="cashier">Cashier</SelectItem>
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell>
              {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}