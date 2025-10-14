// store/schedule-store.ts
import { create } from 'zustand'
import { ScheduleAPI } from '@/types/schedule'
import { ChildrenAPI } from '@/types/children'

interface ScheduleState {
  isOpen: boolean
  child: ChildrenAPI | null
  schedules: ScheduleAPI[]
  isCreating: boolean
  editingId: string | null
  
  // Actions
  openDialog: (child: ChildrenAPI, schedules: ScheduleAPI[]) => void
  closeDialog: () => void
  setIsCreating: (value: boolean) => void
  setEditingId: (id: string | null) => void
  setSchedules: (schedules: ScheduleAPI[]) => void
  addSchedule: (schedule: ScheduleAPI) => void
  updateSchedule: (scheduleId: string, schedule: ScheduleAPI) => void
  deleteSchedule: (scheduleId: string) => void
  reset: () => void
}

export const useScheduleStore = create<ScheduleState>((set) => ({
  isOpen: false,
  child: null,
  schedules: [],
  isCreating: false,
  editingId: null,

  openDialog: (child, schedules) =>
    set({ isOpen: true, child, schedules, isCreating: false, editingId: null }),
  
  closeDialog: () =>
    set({
      isOpen: false,
      child: null,
      schedules: [],
      isCreating: false,
      editingId: null,
    }),
  
  setIsCreating: (value) => set({ isCreating: value }),
  setEditingId: (id) => set({ editingId: id }),
  setSchedules: (schedules) => set({ schedules }),
  
  addSchedule: (schedule) =>
    set((state) => ({
      schedules: [...state.schedules, schedule],
      isCreating: false,
      editingId: null,
    })),
  
  updateSchedule: (scheduleId, schedule) =>
    set((state) => ({
      schedules: state.schedules.map((s) =>
        s.id === scheduleId ? { ...schedule, id: scheduleId } : s
      ),
      isCreating: false,
      editingId: null,
    })),
  
  deleteSchedule: (scheduleId) =>
    set((state) => ({
      schedules: state.schedules.filter((s) => s.id !== scheduleId),
    })),
  
  reset: () =>
    set({
      isOpen: false,
      child: null,
      schedules: [],
      isCreating: false,
      editingId: null,
    }),
}))
