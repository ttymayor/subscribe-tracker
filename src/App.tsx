import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { EditSubscription } from "@/components/EditSubscription";
import { AddSubscription } from "@/components/AddSubscription";

import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  TableFooter,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { useState } from "react";
import { getSubscriptions, calculateTotalCost } from "@/lib/subscription";



function App() {
  const { subs } = useSubscriptions();
  // 追蹤哪些訂閱被選中（預設全部選中）
  const [selectedSubs, setSelectedSubs] = useState<Set<string>>(
    new Set(subs.map((sub) => sub.name)),
  );
  const [isListOpen, setIsListOpen] = useState(true);

  const toggleSub = (subName: string) => {
    setSelectedSubs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(subName)) {
        newSet.delete(subName);
      } else {
        newSet.add(subName);
      }
      return newSet;
    });
  };



  return (
    <div className="flex flex-col h-screen w-[90%] my-8 mx-auto p-4">
      <section id="subs" className="">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">訂閱追蹤</h2>
          <AddSubscription />
        </div>

        <div className="flex flex-col justify-center gap-4 md:flex-row">
          {/* 月曆 */}
          <Card>
            <Calendar
              mode="single"
              className="bg-transparent w-full rounded-lg [--cell-size:--spacing(11)] md:w-fit md:[--cell-size:--spacing(13)]"
              captionLayout="dropdown"
              formatters={{
                formatMonthDropdown: (date) => {
                  return date.toLocaleString("default", { month: "long" });
                },
              }}
              components={{
                DayButton: ({ children, modifiers, day, ...props }) => {
                  const subscriptions = !modifiers.outside
                    ? getSubscriptions(day.date, subs)
                    : [];
                  return (
                    <CalendarDayButton day={day} modifiers={modifiers} {...props}>
                      {children}

                      {/* 顯示訂閱名稱和價格 */}
                      {subscriptions.length > 0 ? (
                        <TooltipProvider>
                          <div className="mt-1 flex flex-col gap-0.5">
                            {subscriptions.map((sub) => (
                              <div
                                key={sub.name}
                                className="flex items-center gap-1"
                              >
                                {sub.image ? (
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <img
                                        src={sub.image}
                                        alt={sub.name}
                                        width={16}
                                        height={16}
                                      />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      {sub.name}: {sub.cost} {sub.currency} /{" "}
                                      {sub.cycle}
                                    </TooltipContent>
                                  </Tooltip>
                                ) : (
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <span className="text-xs truncate max-w-[3rem] block">{sub.name}</span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      {sub.name}: {sub.cost} {sub.currency} /{" "}
                                      {sub.cycle}
                                    </TooltipContent>
                                  </Tooltip>
                                )}
                              </div>
                            ))}
                          </div>
                        </TooltipProvider>
                      ) : (
                        <span className="text-muted-foreground text-xs">-</span>
                      )}
                    </CalendarDayButton>
                  );
                },
              }}
            />
          </Card>

          {/* 顯示訂閱列表 */}
          <Card className="w-full h-fit">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>訂閱列表</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="w-9 p-0 cursor-pointer"
                onClick={() => setIsListOpen(!isListOpen)}
              >
                {isListOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CardHeader>
            {isListOpen && (
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center w-8">
                        <Checkbox
                          className="cursor-pointer"
                          checked={selectedSubs.size === subs.length}
                          onCheckedChange={() => {
                            if (selectedSubs.size === subs.length) {
                              setSelectedSubs(new Set());
                            } else {
                              setSelectedSubs(new Set(subs.map((sub) => sub.name)));
                            }
                          }}
                        />
                      </TableHead>
                      <TableHead>訂閱名稱</TableHead>
                      <TableHead className="text-right">價格</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subs.map((sub) => (
                      <EditSubscription key={sub.name} sub={sub}>
                        <TableRow className="cursor-pointer hover:bg-muted/50">
                          <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                            <Checkbox
                              checked={selectedSubs.has(sub.name)}
                              onCheckedChange={() => toggleSub(sub.name)}
                              className="cursor-pointer"
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {sub.image && (
                                <img
                                  src={sub.image}
                                  alt={sub.name}
                                  width={16}
                                  height={16}
                                />
                              )}
                              <span className="text-sm">{sub.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            {sub.cost} {sub.currency} / {sub.cycle}
                          </TableCell>
                        </TableRow>
                      </EditSubscription>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={3} className="text-right">
                        （1 USD ≓ 30 TWD）換算約 {calculateTotalCost(subs, selectedSubs)} TWD / 月
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </CardContent>
            )}
          </Card>
        </div>
      </section>
    </div>
  );
}

export default App;
