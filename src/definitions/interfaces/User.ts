export interface UserParams {
  user_id: string;
  name: string;
  email: string;
  password: string;
  birth_date: Date;
  created_at: Date;
  updated_at: Date;
}

export interface UserBody {
  name: string;
  email: string;
  password: string;
  birth_date?: Date;
}
