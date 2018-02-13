import * as request from 'request';
import AppCatalog from '../helper/appCatalog';
import AuthHelper from '../helper/authHelper';
import Logger from '../helper/logger';
import { IOptions } from '../utils/IAlmTasks';

export default class BaseRequester {
  /**
   * Base requester post method request
   * @param action 
   * @param pkgId 
   * @param options 
   * @param useAppCatalog 
   * @param skipFeatureDeployment 
   */
  public static async post(action: string, pkgId: string, options: IOptions, useAppCatalog: boolean, skipFeatureDeployment: boolean = true): Promise<boolean> {
    // Get the site URL
    const siteUrl = await AppCatalog.get(options, useAppCatalog);
    
    // Retrieve the headers for the API calls
    const headers = await AuthHelper.getRequestHeaders(options, siteUrl);
    
    // Create the rest API URL
    const restUrl = `${siteUrl}/_api/web/tenantappcatalog/AvailableApps/GetById('${pkgId}')/${action}`;

    // Create body
    let body = null;
    if (action === "Deploy") {
      body = JSON.stringify({ "skipFeatureDeployment": skipFeatureDeployment });
    }

    return new Promise<boolean>((resolve, reject) => {
      request.post(restUrl, { headers, body }, (err, resp, body) => {
        // Check if there was an error
        if (err) {
          Logger.error(JSON.stringify(err));
          reject(`Failed to ${action.toLowerCase()} the solution package with ID: ${pkgId}`);
          return;
        }
        
        const data = JSON.parse(body);
        // Check if API returned an error
        if (data["odata.error"]) {
          Logger.error(JSON.stringify(data["odata.error"]));
          reject(`Failed to ${action.toLowerCase()} the solution package with ID: ${pkgId}`);
          return;
        }
        
        if (resp.statusCode === 200) {
          Logger.info(`${action} action completed.`);
          resolve(true);
        } else {
          Logger.warning(`Something went wrong during the ${action.toLowerCase()} action of your solution.`);
          resolve(false);
        }
      });
    });
  }
}