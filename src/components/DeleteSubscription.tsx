import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import type { Subscription } from "@/lib/subscription";
import { useState } from "react";

interface DeleteSubscriptionProps {
    sub: Subscription;
}

export function DeleteSubscription({ sub }: DeleteSubscriptionProps) {
    const { deleteSubscription } = useSubscriptions();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    return (
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="destructive" size="sm" className="cursor-pointer">
                    刪除
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>刪除訂閱</DialogTitle>
                    <DialogDescription>
                        確定要刪除這個訂閱嗎？
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button type="submit" onClick={() => { setDeleteDialogOpen(false); deleteSubscription(sub.name) }} className="cursor-pointer">
                        刪除
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}