import { PaginationResponseMeta } from '~/bash-frontend-kit/types/response/PaginationResponse';
import { SpaceDetails } from '~/types/models/SpaceDetails';
import {CatalogMediaPosition} from "~/bash-frontend-kit/types/models/CatalogMediaPosition";

export interface PlatformsMarketplaceMeta extends PaginationResponseMeta {
  current_filters?: Record<string, any>;
  models: SpaceDetails[];
  seo: PlatformsMarketplaceSEO;
  url: string;
}

export interface PlatformsMarketplaceSEO {
  assets: PlatformsMarketplaceSEOAssets;
  canonical: string;
  h1: string;
  metaDescription: string;
  metaTitle: string;
  robots: string;
}

export interface PlatformsMarketplaceSEOAssets {
  banners: PlatformsMarketplaceBanner[];
  media: PlatformsMarketplaceMedia[];
}

export interface PlatformsMarketplaceBanner {
  id: number;
  url: string;
  title: string;
  cover?: string;
  position: CatalogMediaPosition
}

export interface PlatformsMarketplaceMedia {
  id: number;
  active: boolean
  url: string;
  heading: string;
  content: string;
  created_at: number;
  deleted_at?: number;
  updated_at: number;
  position: CatalogMediaPosition;
}
