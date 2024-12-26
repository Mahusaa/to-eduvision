const subtestFields = [
  { name: "Penalaran Umum", code: "pu" },
  { name: "Penalaran Matematika", code: "pm" },
  { name: "Kemampuan Memahami Bacaan dan Menulis", code: "pbm" },
  { name: "Pengetahuan dan Pemahaman Umum", code: "ppu" },
  { name: "Kemampuan Kuantitatif", code: "kk" },
  { name: "Literasi Bahasa Indonesia", code: "lbind" },
  { name: "Literasi Bahasa Inggris", code: "lbing" },
];


export interface TryoutFormData {
  tryoutName: string;
  tryoutEnd: Date;
  tryoutNumber: number;
  subtestData: Record<string, {
    duration: number;
    total: number;
  }>
}


export interface TryoutFormData {
  tryoutName: string;
  tryoutEnd: Date;
  tryoutNumber: number;
  subtestData: Record<string, {
    duration: number;
    total: number;
  }>;
}

export interface ActionResponse {
  success: boolean;
  message: string;
  errors?: Partial<
    Record<
      keyof TryoutFormData,
      string | Record<string, string>
    >
  >;
}

