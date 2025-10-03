/**
 * API для сущности Deal
 */
import { getDeals, createDeal } from "@/shared/api";
import {
  CreateDealData,
  DealsResponse,
  CreateDealResponse,
} from "../model/types";

export const dealApi = {
  getDeals: getDeals,
  createDeal: (data: CreateDealData) => createDeal(data),
};
