import { apiClient } from "../../api/axiosInstrance";
import type { CurrentSemester } from "../../types/types";

export const semesterService = {
  async getCurrent(signal?: AbortSignal): Promise<CurrentSemester> {
    const { data } = await apiClient.get<CurrentSemester>("/semesters/current", { signal });
    return data;
  },
};