import { api } from "@/lib/axios-instance/api";
import { SuccessResponse } from "@/types/response";
import { useQuery } from "@tanstack/react-query";

export default function Dashboard() {

    const {} =useQuery({
        queryKey: ["users"]
        ,queryFn: async () => {
            const response = await api.get<SuccessResponse<{}>>("/profile/me");
            console.log(response.data.data);
        }
    })
    return (
        <div>
            <h1>Dashboard</h1>
        </div>
    );
}