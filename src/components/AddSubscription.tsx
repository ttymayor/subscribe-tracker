
import { useState } from "react";
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

export function AddSubscription() {
  const { addSubscription } = useSubscriptions();
  const [name, setName] = useState("");
  const [cost, setCost] = useState("");
  const [cycle, setCycle] = useState("月");
  const [currency, setCurrency] = useState("TWD");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [isOpen, setIsOpen] = useState(false);

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

    const newSub: Subscription = {
      name,
      cost: parsedCost,
      cycle,
      currency,
      startDate: new Date(startDate),
    };
    addSubscription(newSub);
    // Reset form
    setName("");
    setCost("");
    setCycle("月");
    setCurrency("TWD");
    setStartDate(new Date().toISOString().split("T")[0]);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">新增訂閱</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>新增訂閱</DialogTitle>
          <DialogDescription>
            在這裡新增你的訂閱，點擊儲存後完成。
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
              min={0}
              onChange={(e) => setCost(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="cycle" className="text-right">
              週期
            </Label>
            <Select onValueChange={setCycle} value={cycle || "月"}>
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
            <Select onValueChange={setCurrency} value={currency || "TWD"}>
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
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            儲存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
