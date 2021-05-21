export interface ServiceMessageBody {
  message: string;
  answerer: boolean;
  service_id: string;
  owner_id: string;
}
export interface ServiceMessageParams {
  service_id: string;
}
