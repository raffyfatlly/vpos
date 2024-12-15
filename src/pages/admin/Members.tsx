import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { UserRole } from "@/types/pos";
import { useState } from "react";

const Members = () => {
  const { toast } = useToast();
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<UserRole>("both");
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
    
    refetch();
  };

  const handleAddUser = async () => {
    if (!newUserEmail) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    const { error: signUpError } = await supabase.auth.signUp({
      email: newUserEmail,
      password: Math.random().toString(36).slice(-8), // Generate a random password
      options: {
        data: {
          email_confirm: true
        }
      }
    });

    if (signUpError) {
      toast({
        title: "Error creating user",
        description: signUpError.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "User created",
      description: "An invitation email has been sent to the user.",
    });

    setNewUserEmail("");
    refetch();
  };

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
        <CardContent className="flex gap-4">
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Members List</CardTitle>
        </CardHeader>
        <CardContent>
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
                      defaultValue={profile.role}
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
                    {new Date(profile.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Members;