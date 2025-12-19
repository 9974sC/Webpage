import { useState, useRef, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Button } from "./button"
import { Languages } from "lucide-react"

export default function LanguageSelector() {
  const { i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const languages = [
    { code: "pl", name: "Polski", flag: "🇵🇱" },
    { code: "en", name: "English", flag: "🇬🇧" },
  ]

  const currentLanguage = languages.find((lang) => lang.code === i18n.language) || languages[0]

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode)
    setIsOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="sm"
        className="gap-2"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
      >
        <Languages className="h-4 w-4" />
        <span className="hidden sm:inline">
          {currentLanguage.flag} {currentLanguage.name}
        </span>
        <span className="sm:hidden">{currentLanguage.flag}</span>
      </Button>
      <div
        className={`absolute right-0 top-full mt-2 bg-card border-2 border-border rounded-lg shadow-lg transition-all z-50 min-w-[150px] ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onMouseLeave={() => setIsOpen(false)}
      >
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`w-full text-left px-4 py-2 hover:bg-primary/10 transition-calm flex items-center gap-2 ${
              i18n.language === lang.code ? "bg-primary/5 font-semibold" : ""
            }`}
          >
            <span>{lang.flag}</span>
            <span>{lang.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
