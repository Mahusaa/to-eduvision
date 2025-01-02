export interface CreateUserFormData {
  email: string;
  name: string;
  role: "user" | "admin" | "mulyono";
}

export interface ActionResponse {
  success: boolean;
  message: string;
  errors?: {
    [K in keyof CreateUserFormData]?: string[];
  };
}


