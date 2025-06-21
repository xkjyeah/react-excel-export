import React from 'react'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      row: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        widthSetting?: boolean
      }
      text: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        width?: number
        z?: string
      }
      number: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        width?: number
        z?: string
      }
      boolean: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        width?: number
        z?: string
      }
      date: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        width?: number
        z?: string
      }
      formula: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        width?: number
        z?: string
      }
    }
  }
} 