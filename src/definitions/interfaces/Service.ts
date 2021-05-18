export interface ServiceParams {
  service_id: string;
  user_id: string;
  title: string;
  description: string;
  value: number;
  owner_id: string;
  tags: string[];

  created_at: Date;
  updated_at: Date;
}

export interface ServiceBody {
  title: string;
  description: string;
  value: number;
  owner_id: string;
  tags: string[];
}
