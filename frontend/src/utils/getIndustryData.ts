import { industryData } from "../constants/industryData";
import IndustryModel from "../models/IndustryModel";

export const getIndustryData = (): IndustryModel[] => {
  return industryData;
};