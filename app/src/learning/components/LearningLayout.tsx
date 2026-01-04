import { Link } from "react-router-dom";
import { Home, LayoutGrid, BookOpen, LogOut } from "lucide-react";
import { useAuth, logout } from "wasp/client/auth";
import { routes } from "wasp/client/router";
import { AiPathLogo } from "../../client/components/AiPathLogo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../client/components/ui/dropdown-menu";

interface LearningLayoutProps {
  children: React.ReactNode;
  currentPage?: "dashboard" | "projects" | "project" | "lesson";
}

export default function LearningLayout({ children, currentPage }: LearningLayoutProps) {
  const { data: user } = useAuth();

  return (
    <div className="min-h-screen bg-[#09090b]">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-[#09090b]/95 backdrop-blur-sm">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Left: Logo & Nav */}
            <div className="flex items-center gap-6">
              {/* Logo */}
              <Link to="/">
                <AiPathLogo size="sm" variant="violet" />
              </Link>

              {/* Nav Links */}
              <nav className="hidden sm:flex items-center gap-1">
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    currentPage === "dashboard"
                      ? "bg-violet-500/10 text-violet-400"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                  }`}
                >
                  <Home className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
                  to="/projects"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    currentPage === "projects" || currentPage === "project"
                      ? "bg-violet-500/10 text-violet-400"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                  Projects
                </Link>
              </nav>
            </div>

            {/* Right: User */}
            <div className="flex items-center gap-3">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-all">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                        {user.email?.[0]?.toUpperCase() || "U"}
                      </div>
                      <span className="hidden sm:inline">{user.email?.split("@")[0]}</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to="/account" className="flex items-center gap-2 w-full">
                        <BookOpen className="w-4 h-4" />
                        Account
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => logout()} className="flex items-center gap-2 cursor-pointer">
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  to={routes.LoginRoute.to}
                  className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-all"
                >
                  Log in
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Nav */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-800/80 bg-[#09090b]/95 backdrop-blur-sm">
        <div className="flex items-center justify-around h-14">
          <Link
            to="/dashboard"
            className={`flex flex-col items-center gap-1 px-4 py-2 ${
              currentPage === "dashboard" ? "text-violet-400" : "text-zinc-500"
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs">Home</span>
          </Link>
          <Link
            to="/projects"
            className={`flex flex-col items-center gap-1 px-4 py-2 ${
              currentPage === "projects" || currentPage === "project" ? "text-violet-400" : "text-zinc-500"
            }`}
          >
            <LayoutGrid className="w-5 h-5" />
            <span className="text-xs">Projects</span>
          </Link>
          <Link
            to="/account"
            className="flex flex-col items-center gap-1 px-4 py-2 text-zinc-500"
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-xs">Account</span>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pb-16 sm:pb-0">
        {children}
      </main>
    </div>
  );
}
