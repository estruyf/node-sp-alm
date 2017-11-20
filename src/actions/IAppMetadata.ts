export interface IAppList {
  'odata.metadata': string;
  value: IAppMetadata[];
}

export interface IAppMetadata {
  'odata.type': string;
  'odata.id': string;
  'odata.editLink': string;
  AppCatalogVersion: string;
  CanUpgrade: boolean;
  CurrentVersionDeployed: boolean;
  Deployed: boolean;
  ID: string;
  InstalledVersion: string;
  IsClientSideSolution: boolean;
  Title: string;
}

export interface IAddedApp {
  'odata.metadata': string;
  'odata.type': string;
  'odata.id': string;
  'odata.editLink': string;
  CheckInComment: string;
  CheckOutType: number;
  ContentTag: string;
  CustomizedPageStatus: number;
  ETag: string;
  Exists: boolean;
  IrmEnabled: boolean;
  Length: string;
  Level: number;
  LinkingUri?: any;
  LinkingUrl: string;
  MajorVersion: number;
  MinorVersion: number;
  Name: string;
  ServerRelativeUrl: string;
  TimeCreated: string;
  TimeLastModified: string;
  Title: string;
  UIVersion: number;
  UIVersionLabel: string;
  UniqueId: string;
}