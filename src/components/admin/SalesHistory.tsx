import { Session } from "@/types/pos";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SalesHistoryProps {
  session: Session;
}

export function SalesHistory({ session }: SalesHistoryProps) {
  return (
    <div className="rounded-md border">
      <ScrollArea className="w-full overflow-auto">
        {session.sales && session.sales.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[100px]">ID</TableHead>
                <TableHead className="min-w-[180px]">Date & Time</TableHead>
                <TableHead className="min-w-[80px]">Items</TableHead>
                <TableHead className="min-w-[100px]">Total</TableHead>
                <TableHead className="min-w-[120px]">Payment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {session.sales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="font-medium">{sale.id}</TableCell>
                  <TableCell>
                    {new Date(sale.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell>{sale.products.length}</TableCell>
                  <TableCell>${sale.total.toFixed(2)}</TableCell>
                  <TableCell>{sale.paymentMethod}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="p-4 text-center text-muted-foreground">
            No sales records found for this session
          </div>
        )}
      </ScrollArea>
    </div>
  );
}