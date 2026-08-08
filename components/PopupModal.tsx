"use client"
import React, { useState, useEffect } from 'react'
import { FaTimes } from 'react-icons/fa'

const PopupModal = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 7000) 

    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative bg-primary rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-300">
        
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 bg-primary-hover border border-white/20 rounded-full flex items-center justify-center shadow-lg hover:bg-secondary group transition-colors duration-200"
          aria-label="Close modal"
        >
          <FaTimes className="text-surface group-hover:text-white text-sm" />
        </button>

        {/* Image Container */}
        <div className="w-full flex justify-center items-center">
          <img 
            src="/banner.png"
            alt="Promotion Banner"
            loading="eager"
            className="w-full h-auto max-h-[80vh] object-contain block"
          />
        </div>
      </div>
    </div>
  )
}

export default PopupModal
