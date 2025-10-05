
type LocationResponse = {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  category: string;
  type: string;
  place_rank: number;
  importance: number;
  addresstype: string;
  name: string;
  display_name: string;
  address: {
    highway: string;
    road: string;
    city_block: string;
    neighbourhood: string;
    suburb: string;
    city: string;
    "ISO3166-2-lvl4": string;
    region: string;
    "ISO3166-2-lvl3": string;
    postcode: string;
    country: string;
    country_code: string;
  };
  boundingbox: Array<string>;
};