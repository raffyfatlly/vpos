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

  const filteredProfiles = profiles.filter(
    (profile) => profile.username !== 'sales@vanillicious.com'
  );

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
      const response = await fetch(`${process.env.VITE_SUPABASE_URL}/functions/v1/delete-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete user');
      }

      const data = await response.json();

      toast({
        title: "User deleted",
        description: "The user has been deleted successfully.",
      });

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
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <div className="min-w-full inline-block align-middle">
        <div className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left whitespace-nowrap px-2 sm:px-4">Email</TableHead>
                <TableHead className="whitespace-nowrap px-2 sm:px-4">Role</TableHead>
                <TableHead className="hidden sm:table-cell whitespace-nowrap px-2 sm:px-4">Created At</TableHead>
                <TableHead className="whitespace-nowrap px-2 sm:px-4">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProfiles?.map((profile) => (
                <TableRow key={profile.id}>
                  <TableCell className="text-left px-2 sm:px-4 max-w-[120px] sm:max-w-none truncate">
                    {profile.username}
                  </TableCell>
                  <TableCell className="px-2 sm:px-4">
                    <Select
                      defaultValue={profile.role || undefined}
                      onValueChange={(value: UserRole) => handleRoleChange(profile.id, value)}
                    >
                      <SelectTrigger className="w-[90px] sm:w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="both">Both</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="cashier">Cashier</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell px-2 sm:px-4">
                    {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell className="px-2 sm:px-4">
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
        </div>
      </div>
    </div>
  );
}