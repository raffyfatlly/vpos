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
      <ScrollArea className="h-[400px]">
        <div className="w-full">
          {session.sales && session.sales.length > 0 ? (
            <div className="w-full overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">ID</TableHead>
                    <TableHead className="w-[120px]">Date</TableHead>
                    <TableHead className="w-[60px]">Items</TableHead>
                    <TableHead className="w-[80px]">Total</TableHead>
                    <TableHead className="w-[100px]">Payment</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {session.sales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell className="font-medium">{sale.id}</TableCell>
                      <TableCell>
                        {new Date(sale.timestamp).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{sale.products.length}</TableCell>
                      <TableCell>${sale.total.toFixed(2)}</TableCell>
                      <TableCell>{sale.paymentMethod}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              No sales records found for this session
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}