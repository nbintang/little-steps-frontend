import { create } from 'zustand'

export const createDialogStore = <T = any>() => {
  return create<{
    isOpen: boolean
    data: Partial<T>
    mode: 'create' | 'edit'
    open: (data?: Partial<T>) => void
    close: () => void
  }>((set) => ({
    isOpen: false,
    data: {},
    mode: 'create',
    open: (data = {}) => set({ 
      isOpen: true, 
      data,
      mode: Object.keys(data || {}).length > 0 ? 'edit' : 'create'
    }),
    close: () => set({ isOpen: false, data: {}, mode: 'create' })
  }))
}
 