import { apiClient } from "../../api/axiosInstrance";
import type {
  AddStudent,
  PagedResult,
  StudentRecord,
  UpdateStudent,
} from "../../types/types";

const PAGE_SIZE = 10;

export const studentService = {
  async getPagination(
    page: number,
    searchTerm: string,
    signal?: AbortSignal,
  ): Promise<PagedResult<StudentRecord>> {
    const { data } = await apiClient.get<PagedResult<StudentRecord>>(
      "/students",
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

  async addStudent(student: AddStudent): Promise<void> {
    await apiClient.post("/students", student);
  },

  async updateStudent(id: string, student: UpdateStudent): Promise<void> {
    await apiClient.put(`/students/${id}`, student);
  },

  async deleteStudent(id: string): Promise<void> {
    await apiClient.delete(`/users/${id}`);
  },
};
