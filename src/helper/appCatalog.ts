import { ISearchResult, ICell, IRow } from './ISearchResult';
import { IOptions } from '../utils/IAlmTasks';
import AuthHelper from '../helper/authHelper';
import * as request from 'request';
import Logger from './logger';

export default class AppCatalog {
  private static _url: string = "";
  private static _query: string = "contentclass:STS_Site AND SiteTemplate:APPCATALOG";
  
  /**
  * Get the app catalog site of the current tenant
  */
  public static async get(options: IOptions, useAppCatalog: boolean): Promise<string> {
    const siteUrl = options.absoluteUrl ? options.absoluteUrl : `https://${options.tenant}.sharepoint.com/`;
    const restUrl = `${siteUrl}/_api/search/query?querytext='${AppCatalog._query}'&selectproperties='Path'`;

    // Get the headers to call the SharePoint Search API
    const headers = await AuthHelper.getRequestHeaders(options, siteUrl);

    return new Promise<string>(async (resolve, reject) => {
      // Check if the absolute URL needs to be used
      if (!useAppCatalog) {
        resolve(siteUrl);
        return;
      }

      // Check if the AppCatalog URL was already retrieved
      if (AppCatalog._url) {
        Logger.info(`Site catalog URL already retrieved: ${AppCatalog._url}`);
        resolve(AppCatalog._url);
        return;
      }

      Logger.info('Retrieving the App Catalog URL.');
      
      // Do a search query to retrieve the app catalog site
      request(restUrl, { headers }, (err, resp, body) => {
        // Check if there was an error
        if (err) {
          Logger.error(JSON.stringify(err));
          reject('Failed get the app catalog URL');
          return;
        }
        
        const data: ISearchResult = JSON.parse(body);
        // Check if API returned an error
        if (data["odata.error"]) {
          Logger.error(JSON.stringify(data["odata.error"]));
          reject('Failed get the app catalog URL');
          return;
        }
        
        // Retrieve the app catalog site URL
        if (typeof data.PrimaryQueryResult !== 'undefined') {
          if (typeof data.PrimaryQueryResult.RelevantResults !== 'undefined') {
            if (typeof data.PrimaryQueryResult.RelevantResults.Table !== 'undefined') {
              if (typeof data.PrimaryQueryResult.RelevantResults.Table.Rows !== 'undefined') {
                const rows: IRow[] = data.PrimaryQueryResult.RelevantResults.Table.Rows;
                if (rows.length > 0) {
                  const path: ICell = rows[0].Cells.find(cell => cell.Key.toLowerCase() === 'path');

                  Logger.info('App catalog URL retrieved.');

                  AppCatalog._url = path.Value;
                  resolve(path.Value);
                  return;
                }
              }
            }
          }
        }

        Logger.info(`Didn't find the app catalog URL.`);
        resolve("");
      });
    });
  }
}