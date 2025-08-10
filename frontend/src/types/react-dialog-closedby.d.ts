// src/types/react-dialog-closedby.d.ts
import 'react'
// closedby not yet supported in Safari, so we define it here for TypeScript
declare module 'react' {
  interface DialogHTMLAttributes<T> extends HTMLAttributes<T> {
    closedby?: 'any' | 'closerequest' | 'none'
  }
}
