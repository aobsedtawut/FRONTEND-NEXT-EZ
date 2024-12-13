import Link from "next/link";

interface BalanceDisplayProps {
  balance: number;
}

export default function BalanceDisplay({ balance }: BalanceDisplayProps) {
  return (
    <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 p-8 rounded-2xl shadow-xl mb-8">
      <div className="flex justify-between items-center">
        <div className="space-y-4">
          <h2 className="text-emerald-100 text-xl font-semibold">
            Available Balance
          </h2>
          <div className="flex items-baseline">
            <span className="text-emerald-200 text-2xl">฿</span>
            <p className="text-white text-5xl font-bold ml-2">
              {balance.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Link href="/orders">
            <button className="bg-emerald-300 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-full text-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105">
              My Orders
            </button>
          </Link>

          <div className="bg-emerald-900/40 p-4 rounded-full">
            <svg
              className="w-8 h-8 text-emerald-100"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
