import { IAppMetadata } from './IAppMetadata';
import { IOptions } from './../utils/IAlmTasks';
import AuthHelper from '../helper/authHelper';
import appInsights from '../helper/appInsights';
import * as request from 'request';
import AppCatalog from '../helper/appCatalog';

/**
* Function get the app details
* @param options Options
* @param pkgId App ID
*/
export async function details(options: IOptions, pkgId: string, useAppCatalog: boolean = true): Promise<IAppMetadata> {
  // Check if the package ID was specified
  if (!pkgId) {
    throw "Package ID (pkgId) argument is required";
  }
  
  appInsights.trackEvent({
    name: 'appDetails'
  });
  
  const headers = await AuthHelper.getRequestHeaders(options);
  let siteUrl = options.absoluteUrl ? options.absoluteUrl : `https://${options.tenant}.sharepoint.com/${options.site}`;
  if (useAppCatalog) {
    siteUrl = await AppCatalog.get(options);
  }
  const restUrl = `${siteUrl}/_api/web/tenantappcatalog/AvailableApps/GetById('${pkgId}')`;
  
  return new Promise<IAppMetadata>((resolve, reject) => {
    request(restUrl, { headers }, (err, resp, body) => {
      // Check if there was an error
      if (err) {
        if (options.verbose) {
          console.log('ERROR:', err);
        }
        reject('Failed to retrieve package details.');
        return;
      }
      
      const data: IAppMetadata = JSON.parse(body);
      // Check if API returned an error
      if (data["odata.error"]) {
        if (options.verbose) {
          console.log('ERROR:', data["odata.error"]);
        }
        reject('Failed to retrieve package details.');
        return;
      }
      
      if (options.verbose) {
        console.log('INFO: Package details successfully retrieved.');
      }
      resolve(data);
    });
  });
}