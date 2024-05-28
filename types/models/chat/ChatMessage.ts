import {ChatUser} from "~/types/models/chat/ChatUser";
import {PhotoUploadResponse} from "~/bash-frontend-kit/types/response/PhotoUploadResponse";

export interface ChatMessage {
  id: number;
  created_at: number;
  text?: string;
  updated_at?: number;
  read_at?: number;
  is_updated?: boolean;
  is_read?: boolean;
  is_mine?: boolean;
  is_system?: boolean;
  is_comment?: boolean;
  user: ChatUser;
  files: (PhotoUploadResponse & { isImage: boolean })[];
}