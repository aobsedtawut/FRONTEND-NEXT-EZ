"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import OrderForm from "./components/OrderForm";
import BalanceDisplay from "./components/BalanceDisplay";
import ProductList from "./components/ProductList";
import { redirect } from "next/navigation";
import { fetchBalance } from "./api/api";
import TopBar from "./components/nav/TopBar";
export default function Home() {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/signin");
    },
  });
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    if (session?.user) {
      fetchBalance().then((data) => setBalance(data.balance));
    }
  }, [session]);

  return (
    <div className="container mx-auto p-4">
      <TopBar />
      <OrderForm
        onOrderComplete={setBalance}
        customerId={session?.user?.id ?? ""}
      />
      <BalanceDisplay balance={balance} />
    </div>
  );
}
