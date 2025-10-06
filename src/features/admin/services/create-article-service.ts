import { api } from "@/lib/axios-instance/api"

export const createArticleService =async () => {
    const res = await api.post("/protected/articles",)
}