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
    { name: "Alpha Capital", logo: Building2, plan: "Enterprise" },
    { name: "BlueStone Invest", logo: Wallet, plan: "Pro" },
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
  // Conectando ao mesmo cérebro da Página
  const { role } = useAuth(); 

  // Filtra o menu em tempo real
  const filteredNavMain = data.navMain.filter(item => 
    !item.visibleTo || item.visibleTo.includes(role)
  );

  return (
    <Sidebar collapsible="icon" className="border-r border-slate-800 bg-slate-950" {...props}>
      <SidebarHeader className="bg-slate-950 border-b border-slate-800">
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      
      <SidebarContent className="bg-slate-950">
        <NavMain items={filteredNavMain} />
      </SidebarContent>

      <SidebarFooter className="bg-slate-950 border-t border-slate-800">
        <NavUser user={data.user} />
        {/* Indicador visual de qual perfil está ativo na sidebar */}
        <div className="px-4 py-2 text-[10px] text-slate-600 font-mono text-center group-data-[collapsible=icon]:hidden">
          Perfil: {role}
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}