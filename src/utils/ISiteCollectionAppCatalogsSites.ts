export interface ISiteCollectionAppCatalogsSites {
  'odata.metadata': string;
  value: Value[];
}

export interface Value {
  'odata.type': string;
  'odata.id': string;
  'odata.editLink': string;
  AbsoluteUrl: string;
  SiteID: string;
}