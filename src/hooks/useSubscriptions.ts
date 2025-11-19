
import { useLocalStorage } from "foxact/use-local-storage";
import { useCallback } from "react";
import type { Subscription } from "@/lib/subscription";

export function useSubscriptions() {
  const [subs, setSubs] = useLocalStorage<Subscription[]>("subscriptions", []);

  const addSubscription = useCallback(
    (sub: Subscription) => {
      setSubs((prevSubs) => [...(prevSubs ?? []), sub]);
    },
    [setSubs],
  );

  const deleteSubscription = useCallback(
    (name: string) => {
      setSubs((prevSubs) => (prevSubs ?? []).filter((sub) => sub.name !== name));
    },
    [setSubs],
  );

  const updateSubscription = useCallback(
    (name: string, updatedSub: Subscription) => {
      setSubs((prevSubs) =>
        (prevSubs ?? []).map((sub) => (sub.name === name ? updatedSub : sub)),
      );
    },
    [setSubs],
  );

  return {
    subs,
    addSubscription,
    deleteSubscription,
    updateSubscription,
  };
}
