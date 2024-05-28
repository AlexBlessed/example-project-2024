import { EventContractor } from '~/types/models/EventContractor';

export interface EventContractorDetails extends EventContractor {
  clients: EventContractorClient[];
  portfolioWorks: EventContractorPortfolioWork[];
  promotions: EventContractorPromotion[];
  rating: number;
  rating_can_add: boolean;
  rating_count: number
  services: EventContractorService[];
  video: string;
  price_pdf: EventContractorFile,
}

export interface EventContractorClient {
  id: number;
  name: string;
  photo: string;
  is_gray_photo: boolean;
}

export interface EventContractorPortfolioWork {
  id: number;
  title: string;
  photo: string;
  date: number;
}

export interface EventContractorContact {
  active: string;
  id: number;
  is_active: boolean;
  label: string;
  type: string;
  url: string;
  url_without_protocol: string;
  value: string;
}

export interface EventContractorService {
  id: number;
  max_price: number;
  min_price: number;
  name: string;
  type_count: number;
  type_count_name: string;
}

export interface EventContractorPromotion {
  begins_at: number;
  description: string;
  ends_at: number;
  id: number;
  photo: string;
  short_description: string;
  title: string;
}

export interface EventContractorFile {
  id: number;
  url: string;
  fileName: string;
  originalName: string;
  size: number;
  mime: string;
}
