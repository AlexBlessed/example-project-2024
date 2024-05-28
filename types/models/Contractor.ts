export interface Contractor {
  alias: string;
  category_alias: string;
  created_at: number;
  created_at_datetime: string;
  description?: string;
  header_pic?: string;
  id: number;
  in_favorite: boolean;
  is_can_copy: boolean;
  is_can_delete: boolean;
  is_can_edit: boolean;
  logo?: string;
  meta_description: string;
  meta_title: string;
  name: string;
  rating: number;
  rating_count: number;
  status_id: number;
  status_name: string;
  title: { id: number, value: string, icon?: string };
  updated_at: number;
  updated_at_datetime: string;
}
