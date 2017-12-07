import { IAppMetadata } from './IAppMetadata';
import { IOptions } from './../utils/IAlmTasks';
import AuthHelper from '../helper/authHelper';
import Logger from '../helper/logger';
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
  
  Logger.info('Starting to retrieve app details');
  
  // Get the site URL
  const siteUrl = await AppCatalog.get(options, useAppCatalog);
  
  // Retrieve the headers for the API calls
  const headers = await AuthHelper.getRequestHeaders(options, siteUrl);
  
  // Create the rest API URL
  const restUrl = `${siteUrl}/_api/web/tenantappcatalog/AvailableApps/GetById('${pkgId}')`;
  
  return new Promise<IAppMetadata>((resolve, reject) => {
    request(restUrl, { headers }, (err, resp, body) => {
      // Check if there was an error
      if (err) {
        Logger.error(JSON.stringify(err));
        reject('Failed to retrieve package details.');
        return;
      }
      
      const data: IAppMetadata = JSON.parse(body);
      // Check if API returned an error
      if (data["odata.error"]) {
        Logger.error(JSON.stringify(data["odata.error"]));
        reject('Failed to retrieve package details.');
        return;
      }
      
      Logger.info('Package details successfully retrieved.');
      resolve(data);
    });
  });
}