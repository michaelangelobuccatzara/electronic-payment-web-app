import { apiClient } from "../../api/axiosInstrance";
import type { PagedResult, PaymentRecord } from "../../types/types";

const PAGE_SIZE = 10;

export const paymentService = {
  async getPagination(
    page: number,
    searchTerm: string,
    signal?: AbortSignal,
  ): Promise<PagedResult<PaymentRecord>> {
    const { data } = await apiClient.get<PagedResult<PaymentRecord>>(
      "/payments",
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

  async getById(id: string, signal?: AbortSignal): Promise<PaymentRecord> {
    const { data } = await apiClient.get<PaymentRecord>(`/payments/${id}`, {
      signal,
    });
    return data;
  },
};
