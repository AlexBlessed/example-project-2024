import {StatusLead} from "~/bash-frontend-kit/types/models/Lead";
import {UserShort} from "~/bash-frontend-kit/types/models/User";

export interface Chat {
  id: number;
  lead_id: number;
  date: number;
  event_start?: number;
  event_finish?: number;
  message?: string;
  messages?: number;
  space_icon?: string;
  space_title: string;
  count: number;
  is_updated_lead?: boolean;
  is_new: boolean;
  is_comment: boolean;
  is_system: boolean;
  online?: boolean;
  user: UserShort;
  status: StatusLead;
  lead: {
    event_type?: string;
    people_count?: number;
  },
}