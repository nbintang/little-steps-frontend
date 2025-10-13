import { create } from "zustand"

type OpenChildAccessDialog= {
    openDialog: boolean,
    setOpenDialog: (openDialog: boolean) => void,
}


export const useOpenChildAccessDialog = create<OpenChildAccessDialog>((set) => ({
    openDialog: false,
    setOpenDialog: (openDialog) => set({ openDialog }),
}))