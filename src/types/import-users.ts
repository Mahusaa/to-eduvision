export interface UpdateUserFormData {
  name: string;
  email: string;
  role: "user" | "admin" | "mulyono"; // Replace with actual roles if more are available
}
export interface BatchActionResponse {
  success: boolean;
  message: string;
  errors?: {
    index: number;
    errorDetails: {
      [K in keyof UpdateUserFormData]?: string[];
    };
  }[];
}
