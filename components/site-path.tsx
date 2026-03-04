"use client"
import React from 'react'
import { usePathname } from 'next/navigation'

function Sitepath() {
      const searchParams = usePathname()
  return (
    <h2 className="text-base font-medium">{searchParams.split('/').pop()?.toLocaleUpperCase()}</h2>
  )
}

export default Sitepath