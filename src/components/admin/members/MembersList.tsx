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
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
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

  const handleDeleteUser = async (userId: string) => {
    try {
      // Delete from auth.users (this will cascade to profiles due to FK constraint)
      const { error: deleteError } = await supabase.auth.admin.deleteUser(userId);

      if (deleteError) throw deleteError;

      toast({
        title: "User deleted",
        description: "The user has been deleted successfully.",
      });

      // Refresh the page to update the list
      window.location.reload();
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error deleting user",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-left">Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Actions</TableHead>
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
            <TableCell>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteUser(profile.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}