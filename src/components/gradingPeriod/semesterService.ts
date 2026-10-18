import { apiClient } from "../../api/axiosInstrance";
import type {
  AddGradingPeriod,
  CurrentSemester,
  UpdateGradingPeriod,
} from "../../types/types";

export const semesterService = {
  async getCurrent(signal?: AbortSignal): Promise<CurrentSemester> {
    const { data } = await apiClient.get<CurrentSemester>(
      "/semesters/current",
      { signal },
    );
    return data;
  },

  // 201 = created. 400 and 404 reject, so the caller sees them as errors.
  async addGradingPeriod(
    semesterId: string,
    period: AddGradingPeriod,
  ): Promise<void> {
    await apiClient.post(`/semesters/${semesterId}/grading-periods`, period);
  },

  async updateGradingPeriod(
    semesterId: string,
    gradingPeriodId: string,
    period: UpdateGradingPeriod,
  ): Promise<void> {
    await apiClient.put(
      `/semesters/${semesterId}/grading-periods/${gradingPeriodId}`,
      period,
    );
  },

  async deleteGradingPeriod(
    semesterId: string,
    gradingPeriodId: string,
  ): Promise<void> {
    await apiClient.delete(
      `/semesters/${semesterId}/grading-periods/${gradingPeriodId}`,
    );
  },
};
