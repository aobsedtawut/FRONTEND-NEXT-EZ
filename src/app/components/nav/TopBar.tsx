import { useEffect } from "react";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRef } from "react";
import Link from "next/link";

const DesktopTopBar: React.FC = () => {
  const { data: session, status } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  const renderUserDropdown = () => {
    if (status === "authenticated" && session?.user) {
      return (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-3 focus:outline-none"
          >
            <span className="text-white">{session.user.name}</span>
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              {/* If you have user avatar, replace this with an image */}
              <span className="text-sm">
                {session.user.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <svg
              className={`w-4 h-4 text-white transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
              <div className="py-1">
                <div className="px-4 py-2 border-b">
                  <p className="text-sm font-medium text-gray-900">
                    {session.user.name}
                  </p>
                  <p className="text-sm text-gray-500">{session.user.email}</p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }

    if (status === "unauthenticated") {
      return (
        <Link href="/">
          <button
            type="button"
            className="bg-gray-200 text-white py-2 px-6 rounded-md hover:bg-opacity-90 transition-colors"
          >
            Sign In
          </button>
        </Link>
      );
    }

    return null;
  };

  return (
    <div className="bg-gray-300 text-brand-white py-4 px-6 flex justify-between items-center">
      <h1 className="text-2xl font-bold font-mono">EZ GAMES</h1>
      {renderUserDropdown()}
    </div>
  );
};

export default DesktopTopBar;
