import { apiClient } from "../../api/axiosInstrance";
import type { DashboardSummary } from "../../types/types";

export const dashboardService = {
  async getSummary(): Promise<DashboardSummary> {
    const res = await apiClient.get<DashboardSummary>("/dashboard/summary");

    if (res.status !== 200) {
      throw new Error("Dashboard Summary failed to fetch");
    }

    return res.data;
  },
};
