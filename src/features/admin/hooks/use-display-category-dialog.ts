import { createDialogStore } from "@/hooks/create-dialog-store";
import { CategoryAPI } from "@/types/category";

 

export const useDisplayCategoryDialog = createDialogStore<CategoryAPI>();