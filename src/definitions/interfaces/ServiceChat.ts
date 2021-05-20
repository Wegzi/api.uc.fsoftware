export interface ServiceChatBody {
  message: string;
  answerer: boolean;
  service_id: string;
  owner_id: string;
}
export interface ServiceChatParams {
  service_id: string;
}
