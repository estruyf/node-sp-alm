import { ISearchResult, ICell, IRow } from './ISearchResult';
import { IOptions } from '../utils/IAlmTasks';
import AuthHelper from '../helper/authHelper';
import * as request from 'request';

export default class AppCatalog {
  private static _url: string = "";
  private static _query: string = "contentclass:STS_Site AND SiteTemplate:APPCATALOG";
  
  /**
  * Get the app catalog site of the current tenant
  */
  public static async get(options: IOptions): Promise<string> {
    const headers = await AuthHelper.getRequestHeaders(options);
    const siteUrl = options.absoluteUrl ? options.absoluteUrl : `https://${options.tenant}.sharepoint.com/`;
    const restUrl = `${siteUrl}/_api/search/query?querytext='${AppCatalog._query}'&selectproperties='Path'&clienttype='ContentSearchRegular'`;

    return new Promise<string>(async (resolve, reject) => {
      // Check if the AppCatalog URL was already retrieved
      if (AppCatalog._url) {
        if (options.verbose) {
          console.log('INFO: Site catalog URL already retrieved.');
        }
        resolve(AppCatalog._url);
        return;
      }

      if (options.verbose) {
        console.log('INFO: Retrieving the App Catalog URL.');
      }
      
      // Do a search query to retrieve the app catalog site
      request(restUrl, { headers }, (err, resp, body) => {
        // Check if there was an error
        if (err) {
          if (options.verbose) {
            console.log('ERROR:', err);
          }
          reject('Failed get the app catalog URL');
          return;
        }
        
        const data: ISearchResult = JSON.parse(body);
        // Check if API returned an error
        if (data["odata.error"]) {
          if (options.verbose) {
            console.log('ERROR:', data["odata.error"]);
          }
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

                  if (options.verbose) {
                    console.log('INFO: App catalog URL retrieved.');
                  }

                  AppCatalog._url = path.Value;
                  resolve(path.Value);
                  return;
                }
              }
            }
          }
        }

        if (options.verbose) {
          console.log(`INFO: Didn't find the app catalog URL.`);
        }

        resolve("");
      });
    });
  }
}