"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"

export default function RegisterPage() {
  return (
    <Card className="w-full max-w-md bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 shadow-xl">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center text-slate-900 dark:text-white">Criar Conta</CardTitle>
        <CardDescription className="text-center text-slate-500 dark:text-slate-400">
          Comece a gerenciar seus investimentos hoje
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" placeholder="João" className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="surname">Sobrenome</Label>
            <Input id="surname" placeholder="Silva" className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">E-mail Corporativo</Label>
          <Input id="email" type="email" placeholder="nome@empresa.com" className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <Input id="password" type="password" className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700" />
        </div>
        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium">
          Criar Conta Grátis
        </Button>
      </CardContent>
      <CardFooter className="flex justify-center border-t border-slate-100 dark:border-slate-800 pt-4">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Já possui conta?{" "}
          <Link href="/login" className="text-blue-600 hover:text-blue-500 dark:text-blue-400 font-semibold">
            Fazer Login
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}