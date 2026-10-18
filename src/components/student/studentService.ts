import { apiClient } from "../../api/axiosInstrance";
import type { AddStudent } from "../../types/types";

export const studentService = {
  // axios already rejects on non-2xx responses, so no manual status check is needed.
  async addStudent(student: AddStudent): Promise<void> {
    await apiClient.post("/students", student);
  },
};