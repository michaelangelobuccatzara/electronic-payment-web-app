import { apiClient } from "../../api/axiosInstrance";
import type {
  AddStaff,
  PagedResult,
  StaffMember,
  UpdateStaff,
} from "../../types/types";

const PAGE_SIZE = 10;

export const staffService = {
  async getPagination(
    page: number,
    searchTerm: string,
    signal?: AbortSignal,
  ): Promise<PagedResult<StaffMember>> {
    const { data } = await apiClient.get<PagedResult<StaffMember>>("/users", {
      params: {
        page,
        pageSize: PAGE_SIZE,
        searchTerm: searchTerm || undefined,
      },
      signal,
    });
    return data;
  },

  async addStaff(member: AddStaff): Promise<void> {
    const res = await apiClient.post("/users", member);

    if (res.status !== 201) throw new Error("Adding Staff Error");
  },

  async updateStaff(id: string, member: UpdateStaff): Promise<void> {
    const res = await apiClient.put(`/users/${id}`, member);

    if (res.status !== 204) throw new Error("Updating Staff Error");
  },

  async revokeStaff(id: string): Promise<void> {
    const res = await apiClient.delete(`/users/${id}`);

    if (res.status !== 204) throw new Error("Updating Staff Error");
  },
};
