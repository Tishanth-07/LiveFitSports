export interface Match {
  Id: string;
  Sport?: string;
  Title?: string;
  Description?: string;
  Status?: string;
  StartAtUtc: string;
  ImageUrl?: string;
  Metadata?: Record<string, any>;
  Popularity?: number;
  Teams?: string[];
}

export interface Workout {
  Id: string;
  Title?: string;
  Description?: string;
  ImageUrl?: string;
  Category?: string;
  CreatedAtUtc: string;
}

export interface HealthTip {
  Id: string;
  Title?: string;
  Content?: string;
  ImageUrl?: string;
  CreatedAtUtc: string;
}
