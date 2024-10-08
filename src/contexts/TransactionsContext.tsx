import { PropsWithChildren, useCallback, useEffect, useState } from 'react'
import { createContext } from 'use-context-selector'

import { api } from '../lib/axios'

interface CreateTransactionInput {
  description: string
  type: 'income' | 'outcome'
  price: number
  category: string
}

interface Transaction extends CreateTransactionInput {
  id: number
  createdAt: string
}

interface TransactionContextType {
  transactions: Transaction[]
  createTransaction: (transaction: CreateTransactionInput) => Promise<void>
  fetchTransactions: (query?: string) => Promise<void>
}

export const TransactionsContext = createContext({} as TransactionContextType)

export function TransactionsProvider({ children }: PropsWithChildren) {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  const fetchTransactions = useCallback(
    async (query?: string): Promise<void> => {
      const response = await api.get('transactions', {
        params: {
          q: query,
          _sort: 'createdAt',
          _order: 'desc',
        },
      })

      setTransactions(response.data)
    },
    [],
  )

  const createTransaction = useCallback(
    async (transaction: CreateTransactionInput) => {
      const { category, description, price, type } = transaction

      const response = await api.post('transactions', {
        category,
        description,
        price,
        type,
        createdAt: new Date().toISOString(),
      })

      setTransactions((state) => [response.data, ...state])
    },
    [],
  )

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  return (
    <TransactionsContext.Provider
      value={{ transactions, createTransaction, fetchTransactions }}
    >
      {children}
    </TransactionsContext.Provider>
  )
}
