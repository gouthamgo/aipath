import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { Link as ReactRouterLink, useLocation } from "react-router-dom";
import { useAuth } from "wasp/client/auth";
import { Link as WaspRouterLink, routes } from "wasp/client/router";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../../client/components/ui/sheet";
import { throttleWithTrailingInvocation } from "../../../shared/utils";
import { UserDropdown } from "../../../user/UserDropdown";
import { UserMenuItems } from "../../../user/UserMenuItems";
import { useIsLandingPage } from "../../hooks/useIsLandingPage";
import { cn } from "../../utils";
import { AiPathLogo } from "../AiPathLogo";

export interface NavigationItem {
  name: string;
  to: string;
}

export default function NavBar({
  navigationItems,
}: {
  navigationItems: NavigationItem[];
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const isLandingPage = useIsLandingPage();

  useEffect(() => {
    const throttledHandler = throttleWithTrailingInvocation(() => {
      setIsScrolled(window.scrollY > 20);
    }, 50);

    window.addEventListener("scroll", throttledHandler);

    return () => {
      window.removeEventListener("scroll", throttledHandler);
      throttledHandler.cancel();
    };
  }, []);

  return (
    <header
      className={cn(
        "absolute top-0 left-0 right-0 z-50 transition-all duration-300",
        "bg-transparent py-5"
      )}
    >
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Global"
      >
        {/* Left: Logo */}
        <WaspRouterLink
          to={routes.LandingPageRoute.to}
          className="flex items-center transition-opacity duration-200 hover:opacity-80"
        >
          <AiPathLogo size={isScrolled ? "sm" : "md"} />
        </WaspRouterLink>

        {/* Center: Navigation Links (Desktop) */}
        <ul className="hidden items-center gap-1 lg:flex">
          {navigationItems.map((item) => (
            <NavLink key={item.name} item={item} />
          ))}
        </ul>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <NavBarDesktopActions isScrolled={isScrolled} />
          <NavBarMobileMenu
            isScrolled={isScrolled}
            navigationItems={navigationItems}
          />
        </div>
      </nav>
    </header>
  );
}

function NavLink({ item }: { item: NavigationItem }) {
  const location = useLocation();
  const isActive =
    location.pathname === item.to ||
    (item.to.includes("#") && location.hash === item.to.split("#")[1]);

  return (
    <li>
      <ReactRouterLink
        to={item.to}
        className={cn(
          "relative px-4 py-2 text-sm font-medium transition-colors duration-200",
          isActive
            ? "text-orange-500"
            : "text-white/70 hover:text-white"
        )}
      >
        {item.name}
        {isActive && (
          <span className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500" />
        )}
      </ReactRouterLink>
    </li>
  );
}

function NavBarDesktopActions({ isScrolled }: { isScrolled: boolean }) {
  const { data: user, isLoading: isUserLoading } = useAuth();

  return (
    <div className="hidden items-center gap-3 lg:flex">
      {isUserLoading ? (
        <div className="h-9 w-20 animate-pulse rounded-lg bg-white/5" />
      ) : !user ? (
        <>
          <WaspRouterLink
            to={routes.LoginRoute.to}
            className="px-4 py-2 text-sm font-medium text-white/70 transition-colors duration-200 hover:text-white"
          >
            Log in
          </WaspRouterLink>
          <WaspRouterLink
            to={routes.SignupRoute.to}
            className="btn-primary rounded-lg px-5 py-2.5 text-sm"
          >
            Start Free
          </WaspRouterLink>
        </>
      ) : (
        <UserDropdown user={user} />
      )}
    </div>
  );
}

function NavBarMobileMenu({
  isScrolled,
  navigationItems,
}: {
  isScrolled: boolean;
  navigationItems: NavigationItem[];
}) {
  const { data: user, isLoading: isUserLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex lg:hidden">
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetTrigger asChild>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-white/70 transition-colors hover:bg-white/5 hover:text-white"
          >
            <span className="sr-only">Open menu</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="w-full max-w-sm border-l border-white/5 bg-[#0a0e14] p-0"
        >
          <div className="flex h-full flex-col">
            {/* Header */}
            <SheetHeader className="border-b border-white/5 px-6 py-4">
              <SheetTitle className="flex items-center justify-between">
                <WaspRouterLink
                  to={routes.LandingPageRoute.to}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <AiPathLogo size="sm" />
                </WaspRouterLink>
              </SheetTitle>
            </SheetHeader>

            {/* Navigation Links */}
            <nav className="flex-1 overflow-y-auto px-4 py-6">
              <ul className="space-y-1">
                {navigationItems.map((item) => (
                  <li key={item.name}>
                    <ReactRouterLink
                      to={item.to}
                      className="flex items-center rounded-lg px-4 py-3 text-base font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </ReactRouterLink>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Footer Actions */}
            <div className="border-t border-white/5 p-4">
              {isUserLoading ? null : !user ? (
                <div className="space-y-3">
                  <WaspRouterLink
                    to={routes.SignupRoute.to}
                    className="btn-primary flex w-full items-center justify-center rounded-lg py-3 text-sm font-semibold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Start Free
                  </WaspRouterLink>
                  <WaspRouterLink
                    to={routes.LoginRoute.to}
                    className="btn-secondary flex w-full items-center justify-center rounded-lg py-3 text-sm font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Log in
                  </WaspRouterLink>
                </div>
              ) : (
                <ul className="space-y-1">
                  <UserMenuItems
                    user={user}
                    onItemClick={() => setMobileMenuOpen(false)}
                  />
                </ul>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
