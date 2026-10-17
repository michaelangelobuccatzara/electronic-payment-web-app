import { apiClient } from "../../api/axiosInstrance";
import type { DashboardSummary } from "../../types/types";

export const dashboardService = {
  async getSummary(signal?: AbortSignal): Promise<DashboardSummary> {
    const res = await apiClient.get<DashboardSummary>("/dashboard/summary", {
      signal,
    });
    if (res.status !== 200)
      throw new Error("Dashboard Summary failed to fetch");
    return res.data;
  },
};
