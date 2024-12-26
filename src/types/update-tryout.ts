export interface UpdateTryoutFormData {
  tryoutId: number;
  name: string;
  endedAt: Date;
  status: "closed" | "open" | "completed";
}

export interface ActionResponse {
  success: boolean;
  message: string;
  errors?: {
    [K in keyof UpdateTryoutFormData]?: string[];
  };
}


