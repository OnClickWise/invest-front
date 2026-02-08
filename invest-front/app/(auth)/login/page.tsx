"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"

export default function LoginPage() {
  return (
    <Card className="w-full max-w-md bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 shadow-xl">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center text-slate-900 dark:text-white">Acessar Conta</CardTitle>
        <CardDescription className="text-center text-slate-500 dark:text-slate-400">
          Entre com seu e-mail e senha para continuar
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" placeholder="nome@exemplo.com" className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Senha</Label>
            <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400">
              Esqueceu a senha?
            </Link>
          </div>
          <Input id="password" type="password" className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700" />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="remember" />
          <label
            htmlFor="remember"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-600 dark:text-slate-400"
          >
            Lembrar-me neste dispositivo
          </label>
        </div>
        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium" onClick={() => window.location.href = '/dashboard'}>
          Entrar
        </Button>
      </CardContent>
      <CardFooter className="flex justify-center border-t border-slate-100 dark:border-slate-800 pt-4">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Não tem uma conta?{" "}
          <Link href="/register" className="text-blue-600 hover:text-blue-500 dark:text-blue-400 font-semibold">
            Cadastre-se
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}