import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export function InvitationForm({ onInvite }: { onInvite: () => void }) {
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<UserRole>("both");
  const { toast } = useToast();

  const handleAddUser = async () => {
    if (!newUserEmail) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    try {
      // First check if user already exists in auth.users
      const { data: existingUser } = await supabase.auth.admin.getUserByEmail(newUserEmail);
      
      if (existingUser) {
        toast({
          title: "User exists",
          description: "This email is already registered.",
          variant: "destructive",
        });
        return;
      }

      // Then check if invitation already exists
      const { data: existingInvitation } = await supabase
        .from('pending_invitations')
        .select('*')
        .eq('email', newUserEmail)
        .single();

      if (existingInvitation && !existingInvitation.used) {
        toast({
          title: "Invitation exists",
          description: "An invitation has already been sent to this email.",
          variant: "destructive",
        });
        return;
      }

      // Create new invitation
      const { error: invitationError } = await supabase
        .from('pending_invitations')
        .insert({
          email: newUserEmail,
          role: newUserRole,
          used: false
        });

      if (invitationError) throw invitationError;

      toast({
        title: "Invitation created",
        description: "The user can now sign up with this email.",
      });

      setNewUserEmail("");
      onInvite();
    } catch (error: any) {
      toast({
        title: "Error creating invitation",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex gap-4">
      <Input
        type="email"
        placeholder="Enter email address"
        value={newUserEmail}
        onChange={(e) => setNewUserEmail(e.target.value)}
        className="max-w-sm"
      />
      <Select
        value={newUserRole}
        onValueChange={(value: UserRole) => setNewUserRole(value)}
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
      <Button onClick={handleAddUser}>Add Member</Button>
    </div>
  );
}