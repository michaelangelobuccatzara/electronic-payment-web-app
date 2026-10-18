import { apiClient } from "../../api/axiosInstrance";
import type { ApprovePromissory, PagedResult, PromissoryRecord } from "../../types/types";

const PAGE_SIZE = 10;

export const promissoryService = {
  async getPagination(
    page: number,
    searchTerm: string,
    signal?: AbortSignal,
  ): Promise<PagedResult<PromissoryRecord>> {
    const { data } = await apiClient.get<PagedResult<PromissoryRecord>>(
      "/promissories",
      {
        params: {
          page,
          pageSize: PAGE_SIZE,
          searchTerm: searchTerm || undefined,
        },
        signal,
      },
    );
    return data;
  },

  async getById(id: string, signal?: AbortSignal): Promise<PromissoryRecord> {
    const { data } = await apiClient.get<PromissoryRecord>(
      `/promissories/${id}`,
      { signal },
    );
    return data;
  },

  async approve(id: string, request: ApprovePromissory): Promise<void> {
  await apiClient.post(`/promissories/${id}/approve`, request);
},
};
