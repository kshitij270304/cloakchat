import { Message } from '@/types/Message';

export interface ApiResponse {
  success: boolean;
  message?: string;
  messages?: Message[];
  isAcceptingMessages?: boolean;
}
