"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Coins,
  FileText,
  LayoutDashboard,
  ListChecks,
  Users,
  Wallet,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

const navItems = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "Members", href: "/members", icon: Users },
  { title: "Contributions", href: "/contributions", icon: Coins },
  { title: "Expenses", href: "/expenses", icon: Wallet },
  { title: "Tasks", href: "/tasks", icon: ListChecks },
  { title: "Reports", href: "/reports", icon: FileText },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="border-r border-sidebar-border/60">
      <SidebarHeader className="relative overflow-hidden border-b border-sidebar-border/60 p-3">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-8 -top-10 size-32 rounded-full bg-chart-2/10 blur-2xl"
        />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="h-auto gap-3 px-2 py-2"
            >
              <Link href="/">
                <div className="relative flex aspect-square size-10 shrink-0 items-center justify-center">
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 rounded-xl bg-gradient-to-br from-chart-2 via-chart-1 to-[color-mix(in_oklch,var(--chart-1),black_30%)]"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute -inset-1 rounded-xl bg-chart-1/30 blur-md"
                  />
                  <span className="relative font-heading text-xl italic leading-none text-primary-foreground">
                    ॐ
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-0.5 leading-none">
                  <span className="truncate font-heading text-lg font-semibold tracking-tight">
                    Ganesh
                  </span>
                  <span className="truncate bg-gradient-to-r from-chart-2/90 to-chart-1/70 bg-clip-text text-xs font-medium text-transparent">
                    Vinayaka Chavithi 2026
                  </span>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-chart-2/30 bg-chart-2/10 px-2 py-0.5 text-[10px] font-medium text-chart-2">
                  <span className="relative flex size-1.5">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-chart-2 opacity-75" />
                    <span className="relative inline-flex size-1.5 rounded-full bg-chart-2" />
                  </span>
                  Live
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-[11px] font-medium uppercase tracking-widest text-muted-foreground/60">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1 px-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={cn(
                        "group/menu-item relative gap-3 rounded-lg px-3 py-2 transition-all duration-200",
                        isActive
                          ? "bg-gradient-to-r from-primary/20 via-primary/10 to-transparent font-medium text-primary shadow-[inset_2px_0_0_0_var(--primary)]"
                          : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                      )}
                    >
                      <Link href={item.href}>
                        <Icon
                          className={cn(
                            "transition-transform duration-200 group-hover/menu-item:scale-110",
                            isActive && "text-primary"
                          )}
                        />
                        <span>{item.title}</span>
                        {isActive ? (
                          <span className="ml-auto flex size-1.5 rounded-full bg-chart-2 shadow-[0_0_6px_1px_rgb(255_200_80/0.6)]" />
                        ) : null}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-3">
        <div className="relative overflow-hidden rounded-xl border border-chart-1/20 bg-gradient-to-br from-primary/10 to-chart-2/5 p-3">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-4 -right-2 select-none font-heading text-5xl font-black leading-none text-chart-1/10"
          >
            ॐ
          </span>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-6 -top-6 size-20 rounded-full bg-chart-2/10 blur-2xl"
          />
          <div className="relative flex items-start gap-2.5">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-chart-2/25 to-chart-1/20 text-chart-1 ring-1 ring-inset ring-chart-1/25">
              <Users className="size-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">Shri Ganesh Committee</p>
              <p className="truncate text-xs text-muted-foreground">
                FY 2026-27 &middot; Donate with ❤
              </p>
            </div>
          </div>
          <p className="relative mt-2.5 border-t border-white/10 pt-2 font-heading text-xs italic text-chart-2">
            ॥ श्री गणेशाय नमः ॥
          </p>
        </div>
        <p className="px-2 pt-1 text-[10px] text-muted-foreground/70">
          Society Management &middot; v0.1.0
        </p>
      </SidebarFooter>
    </Sidebar>
  )
}
