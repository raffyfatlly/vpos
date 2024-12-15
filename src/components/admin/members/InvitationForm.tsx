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
      // Delete any existing invitations for this email
      await supabase
        .from('pending_invitations')
        .delete()
        .eq('email', newUserEmail);

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