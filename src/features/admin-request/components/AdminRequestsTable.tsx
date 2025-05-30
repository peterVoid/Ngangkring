"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserRoles } from "@/db/schema";
import { promoteUserAsAdmin } from "../actions/admin-request";
import { actionToast } from "@/hooks/use-toast";

export function AdminRequestsTable({
  users,
}: {
  users: {
    id: string;
    name: string;
    role: UserRoles;
    email: string;
    clerkId: string;
  }[];
}) {
  const handlePromoteUser = async (id: string, clerkId: string) => {
    const responseAction = await promoteUserAsAdmin({ id, clerkId });
    actionToast({ responseAction });
  };

  return (
    <div className="neo-brutalist-table-container border-4 border-black p-1">
      <Table className="w-full">
        <TableHeader>
          <TableRow className="border-b-4 border-black">
            <TableHead className="bg-black p-3 text-center font-black uppercase text-white">
              No
            </TableHead>
            <TableHead className="bg-black p-3 font-black uppercase text-white">
              Name
            </TableHead>
            <TableHead className="bg-black p-3 text-center font-black uppercase text-white">
              Email
            </TableHead>
            <TableHead className="bg-black p-3 text-center font-black uppercase text-white">
              Role
            </TableHead>
            <TableHead className="bg-black p-3 text-center font-black uppercase text-white">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user, index) => (
            <TableRow
              key={user.id}
              className="border-b-2 border-black transition-colors hover:bg-amber-50"
            >
              <TableCell className="border-r-2 border-black p-3 text-center font-bold">
                {++index}
              </TableCell>
              <TableCell className="border-r-2 border-black p-3 font-bold">
                {user.name}
              </TableCell>
              <TableCell className="border-r-2 border-black p-3 text-center font-mono">
                {user.email}
              </TableCell>
              <TableCell className="border-r-2 border-black p-3 text-center font-mono">
                {user.role}
              </TableCell>
              <TableCell className="p-3">
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="default"
                    className="bg-white text-black"
                    onClick={() => handlePromoteUser(user.id, user.clerkId)}
                  >
                    Promote
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
