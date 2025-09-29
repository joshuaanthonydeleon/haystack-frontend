import { useState, type ChangeEvent, type ClipboardEvent, type KeyboardEvent } from 'react'
import { X } from 'lucide-react'
import { Label } from './label'

type MultiValueInputProps = {
  id: string
  label: string
  values: string[]
  placeholder?: string
  description?: string
  onChange: (values: string[]) => void
}

export const MultiValueInput = ({ id, label, values, placeholder, description, onChange }: MultiValueInputProps) => {
  const [inputValue, setInputValue] = useState('')

  const addValue = (rawValue: string) => {
    const value = rawValue.trim()
    if (!value) return
    const exists = values.some((item) => item.toLowerCase() === value.toLowerCase())
    if (exists) {
      setInputValue('')
      return
    }
    onChange([...values, value])
    setInputValue('')
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',' || event.key === 'Tab') {
      if (inputValue.trim().length === 0) return
      event.preventDefault()
      addValue(inputValue)
    }

    if (event.key === 'Backspace' && inputValue.length === 0 && values.length > 0) {
      event.preventDefault()
      onChange(values.slice(0, values.length - 1))
    }
  }

  const handleBlur = () => {
    if (inputValue.trim().length > 0) {
      addValue(inputValue)
    }
  }

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    const text = event.clipboardData.getData('text')
    if (!text) return
    event.preventDefault()
    text
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
      .forEach(addValue)
  }

  const removeValue = (value: string) => {
    onChange(values.filter((item) => item !== value))
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="border-input focus-within:border-ring focus-within:ring-ring/50 relative flex min-h-11 w-full flex-wrap items-center gap-2 rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-within:ring-[3px]">
        {values.map((value) => (
          <span
            key={value}
            className="bg-primary/10 text-primary flex items-center gap-1 rounded-full px-3 py-1 text-xs"
          >
            {value}
            <button
              type="button"
              className="hover:text-primary/80 focus-visible:outline-none"
              onClick={() => removeValue(value)}
              aria-label={`Remove ${label} ${value}`}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          id={id}
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onPaste={handlePaste}
          placeholder={values.length === 0 ? placeholder : undefined}
          className="bg-transparent flex-1 min-w-[8rem] border-none outline-none text-sm"
        />
      </div>
      {description && <p className="text-xs text-gray-500">{description}</p>}
    </div>
  )
}
