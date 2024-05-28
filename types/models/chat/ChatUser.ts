import {SexUser} from "~/bash-frontend-kit/utils/data/_consts";

export interface ChatUser {
  id: number;
  name: string;
  avatar?: string;
  sex: SexUser;
  online: boolean;
  last_active: number;
}