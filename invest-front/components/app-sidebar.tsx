"use client"

import * as React from "react"
import {
  Settings2,
  Users,
  Wallet,
  Building2,
  ShieldCheck,
  TrendingUp,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useAuth } from "@/contexts/auth-context"

const data = {
  user: {
    name: "Dr. Roberto",
    email: "roberto@invest.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    { name: "OnClickInvest", logo: ShieldCheck, plan: "SaaS Admin" },
    { name: "Alpha Capital", logo: Building2, plan: "Tenant Demo" },
  ],
  navMain: [
    {
      title: "Governança",
      url: "#",
      icon: ShieldCheck,
      isActive: true,
      visibleTo: ['SUPER_ADMIN'], 
      items: [
        { title: "Dashboard Global", url: "/dashboard/global" },
        { title: "Tenants & Gestoras", url: "/dashboard/tenants" },
      ],
    },
    {
      title: "Gestão",
      url: "#",
      icon: Users,
      isActive: true,
      visibleTo: ['SUPER_ADMIN', 'ADMIN'],
      items: [
        { title: "Visão Geral", url: "/dashboard/overview" },
        { title: "Carteira de Clientes", url: "/dashboard/clients" },
      ],
    },
    {
      title: "Investidor",
      url: "#",
      icon: TrendingUp,
      visibleTo: ['SUPER_ADMIN', 'ADMIN', 'INVESTOR'],
      items: [
        { title: "Meu Patrimônio", url: "/dashboard/my-wealth" },
        { title: "Simulação", url: "/dashboard/simulation" },
      ],
    },
    {
      title: "Configurações",
      url: "#",
      icon: Settings2,
      visibleTo: ['SUPER_ADMIN', 'ADMIN', 'INVESTOR'],
      items: [
        { title: "Perfil", url: "/settings/profile" },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { role } = useAuth(); 

  const filteredNavMain = data.navMain.filter(item => 
    !item.visibleTo || item.visibleTo.includes(role)
  );

  return (
    <Sidebar collapsible="icon" className="border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950" {...props}>
      <SidebarHeader className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      
      <SidebarContent className="bg-white dark:bg-slate-950">
        <NavMain items={filteredNavMain} />
      </SidebarContent>

      <SidebarFooter className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 p-4">
        {/* Apenas o nome do usuário/perfil, sem botão de tema */}
        <NavUser user={data.user} />
        <div className="mt-2 text-[10px] text-slate-500 font-mono text-center group-data-[collapsible=icon]:hidden uppercase tracking-widest">
             {role.replace('_', ' ')}
         </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}