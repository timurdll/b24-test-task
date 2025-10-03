/**
 * API для сущности Deal
 */
import { getDeals, createDeal } from "@/src/shared/api";
import {
  CreateDealData,
  DealsResponse,
  CreateDealResponse,
} from "../model/types";

export interface DealApi {
  getDeals(): Promise<DealsResponse>;
  createDeal(data: CreateDealData): Promise<CreateDealResponse>;
}

export const dealApi: DealApi = {
  getDeals: (): Promise<DealsResponse> => getDeals(),
  createDeal: (data: CreateDealData): Promise<CreateDealResponse> =>
    createDeal(data),
};
