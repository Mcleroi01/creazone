import React from 'react'
import { AlertCircle } from 'lucide-react'

interface ErrorMessageProps {
  message: string
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex items-center space-x-3 text-red-600 dark:text-red-400">
        <AlertCircle className="h-6 w-6" />
        <p className="text-lg">{message}</p>
      </div>
    </div>
  )
}