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

