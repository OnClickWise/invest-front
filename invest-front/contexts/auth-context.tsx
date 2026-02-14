"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { api } from "@/lib/api"
import { useRouter } from "next/navigation"

type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'INVESTOR'

interface User {
  id: string
  name: string
  email: string
  role: UserRole
  tenantId?: string
}

interface AuthContextType {
  user: User | null
  role: UserRole
  setRole: (role: UserRole) => void
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<UserRole>('INVESTOR') // Default seguro
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const normalizeRole = (value: UserRole | number | string): UserRole => {
    if (typeof value === 'number') {
      const map: UserRole[] = ['SUPER_ADMIN', 'ADMIN', 'INVESTOR']
      return map[value] || 'INVESTOR'
    }

    if (value === 'SUPER_ADMIN' || value === 'ADMIN' || value === 'INVESTOR') {
      return value
    }

    return 'INVESTOR'
  }

  // Ao carregar, verifica se já tem sessão salva
  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')

    if (savedToken && savedUser) {
      const parsedUser = JSON.parse(savedUser)
      setUser(parsedUser)
      setRole(normalizeRole(parsedUser.role))
    }
    setIsLoading(false)
  }, [])

  // Função de Login Real
  const login = async (email: string, password: string) => {
    try {
      // Chama o endpoint do .NET
      const response = await api.post('/auth/login', { email, password })

      const token = response.data?.accessToken || response.data?.AccessToken
      const apiUser = response.data?.user || response.data?.User

      if (!token || !apiUser) {
        throw new Error("Login response missing token or user")
      }

      // Salva no navegador
      localStorage.setItem('token', token)
      const normalizedUser = { ...apiUser, role: normalizeRole(apiUser.role) }
      localStorage.setItem('user', JSON.stringify(normalizedUser))

      // Atualiza estado
      setUser(normalizedUser)
      setRole(normalizedUser.role)

      // Redireciona
      router.push('/dashboard')
    } catch (error) {
      console.error("Erro ao fazer login:", error)
      throw error // Lança o erro para a tela de login tratar (ex: mostrar mensagem)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setRole('INVESTOR')
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ user, role, setRole, isAuthenticated: !!user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider")
  }
  return context
}