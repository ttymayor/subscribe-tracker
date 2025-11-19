
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import type { Subscription } from "@/lib/subscription";

interface EditSubscriptionProps {
  sub: Subscription;
  children?: React.ReactNode;
}

export function EditSubscription({ sub, children }: EditSubscriptionProps) {
  const { updateSubscription, deleteSubscription } = useSubscriptions();
  const [name, setName] = useState(sub.name);
  const [cost, setCost] = useState(sub.cost.toString());
  const [cycle, setCycle] = useState(sub.cycle);
  const [currency, setCurrency] = useState(sub.currency);
  const [startDate, setStartDate] = useState(
    sub.startDate instanceof Date
      ? sub.startDate.toISOString().split("T")[0]
      : new Date(sub.startDate).toISOString().split("T")[0],
  );
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setName(sub.name);
    setCost(sub.cost.toString());
    setCycle(sub.cycle);
    setCurrency(sub.currency);
    setStartDate(
      sub.startDate instanceof Date
        ? sub.startDate.toISOString().split("T")[0]
        : new Date(sub.startDate).toISOString().split("T")[0],
    );
  }, [sub]);

  const handleSubmit = () => {
    if (!name || !cost || !cycle || !currency || !startDate) {
      alert("請填寫所有欄位");
      return;
    }

    const parsedCost = parseFloat(cost);
    if (isNaN(parsedCost)) {
      alert("費用必須是數字");
      return;
    }

    const updatedSub: Subscription = {
      name,
      cost: parsedCost,
      cycle,
      currency,
      startDate: new Date(startDate),
      image: sub.image,
    };
    updateSubscription(sub.name, updatedSub);
    setIsOpen(false);
  };

  const handleDelete = () => {
    if (confirm("確定要刪除這個訂閱嗎？")) {
      deleteSubscription(sub.name);
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children ? (
          children
        ) : (
          <Button variant="outline" size="sm" className="mr-2 cursor-pointer">
            編輯
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>編輯訂閱</DialogTitle>
          <DialogDescription>
            在這裡編輯你的訂閱，點擊儲存後完成。
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              名稱
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="cost" className="text-right">
              費用
            </Label>
            <Input
              id="cost"
              type="number"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="cycle" className="text-right">
              週期
            </Label>
            <Select onValueChange={setCycle} value={cycle}>
              <SelectTrigger className="col-span-3 w-full cursor-pointer">
                <SelectValue placeholder="選擇週期" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="月">月</SelectItem>
                <SelectItem value="年">年</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="currency" className="text-right">
              貨幣
            </Label>
            <Select onValueChange={setCurrency} value={currency}>
              <SelectTrigger className="col-span-3 w-full cursor-pointer">
                <SelectValue placeholder="選擇貨幣" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TWD">TWD</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="startDate" className="text-right">
              開始日期
            </Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter className="flex justify-between sm:justify-between">
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="cursor-pointer"
          >
            刪除
          </Button>
          <Button type="submit" onClick={handleSubmit} className="cursor-pointer">
            儲存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
