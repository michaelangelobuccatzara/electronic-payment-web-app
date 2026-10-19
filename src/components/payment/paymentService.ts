import { apiClient } from "../../api/axiosInstrance";
import type { PagedResult, PaymentRecord } from "../../types/types";
import axios from "axios";

const PAGE_SIZE = 10;

export interface CsvExport {
  blob: Blob;
  fileName: string;
}

function parseFileName(header: unknown): string | null {
  if (typeof header !== "string") return null;

  const encoded = /filename\*=UTF-8''([^;]+)/i.exec(header)?.[1];
  if (encoded) {
    try {
      return decodeURIComponent(encoded);
    } catch {
      // Malformed escape sequence: fall through to the plain form.
    }
  }

  const plain = /filename="?([^";]+)"?/i.exec(header)?.[1];
  return plain ? plain.trim() : null;
}

async function readBlobError(error: unknown): Promise<unknown> {
  if (axios.isAxiosError(error) && error.response?.data instanceof Blob) {
    const text = await error.response.data.text();
    try {
      error.response.data = JSON.parse(text);
    } catch {
      error.response.data = text;
    }
  }
  return error;
}

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

  async exportCsv(dateFrom: string, dateTo: string): Promise<CsvExport> {
    try {
      const response = await apiClient.get<Blob>("/payments/csv", {
        params: { dateFrom, dateTo },
        responseType: "blob",
      });
      return {
        blob: response.data,
        fileName:
          parseFileName(response.headers["content-disposition"]) ??
          `payments_${dateFrom}_to_${dateTo}.csv`,
      };
    } catch (error) {
      throw await readBlobError(error);
    }
  },
};
