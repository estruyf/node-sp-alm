export interface ISearchResult {
  'odata.metadata': string;
  ElapsedTime: number;
  PrimaryQueryResult: IPrimaryQueryResult;
  Properties: IProperty[];
  SecondaryQueryResults: any[];
  SpellingSuggestion: string;
  TriggeredRules: any[];
}

export interface IPrimaryQueryResult {
  CustomResults: any[];
  QueryId: string;
  QueryRuleId: string;
  RefinementResults?: any;
  RelevantResults: IRelevantResults;
  SpecialTermResults?: any;
}

export interface IRelevantResults {
  GroupTemplateId?: any;
  ItemTemplateId?: any;
  Properties: IProperty[];
  ResultTitle?: any;
  ResultTitleUrl?: any;
  RowCount: number;
  Table: ITable;
  TotalRows: number;
  TotalRowsIncludingDuplicates: number;
}

export interface ITable {
  Rows: IRow[];
}

export interface IRow {
  Cells: ICell[];
}

export interface ICell {
  Key: string;
  Value?: string;
  ValueType: string;
}

export interface IProperty {
  Key: string;
  Value: string;
  ValueType: string;
}