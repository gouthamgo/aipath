import { routes } from "wasp/client/router";
import type { NavigationItem } from "./NavBar";

export const marketingNavigationItems: NavigationItem[] = [
  { name: "Features", to: "/#features" },
  { name: "Curriculum", to: "/#curriculum" },
  { name: "Pricing", to: routes.PricingPageRoute.to },
] as const;

export const demoNavigationitems: NavigationItem[] = [
  { name: "Dashboard", to: routes.DashboardRoute.to },
  { name: "Projects", to: routes.ProjectsRoute.to },
  { name: "Account", to: routes.AccountRoute.to },
] as const;
