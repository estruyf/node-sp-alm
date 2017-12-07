import { IAppList, IAppMetadata } from './IAppMetadata';
import { IOptions } from './../utils/IAlmTasks';
import AuthHelper from '../helper/authHelper';
import AppCatalog from '../helper/appCatalog';
import appInsights from '../helper/appInsights';
import * as request from 'request';
import Logger from '../helper/logger';

/**
 * Function to list all available apps
 * @param options 
 */
export async function list(options: IOptions, useAppCatalog: boolean = true): Promise<IAppMetadata[]> {
  appInsights.trackEvent({
    name: 'list'
  });

  Logger.info('Starting to retrieve available apps.');

  // Get the site URL
  const siteUrl = await AppCatalog.get(options, useAppCatalog);

  // Retrieve the headers for the API calls
  const headers = await AuthHelper.getRequestHeaders(options, siteUrl);

  // Create the rest API URL
  const restUrl = `${siteUrl}/_api/web/tenantappcatalog/AvailableApps`;

  return new Promise<IAppMetadata[]>((resolve, reject) => {
    request.post(restUrl, { headers }, (err, resp, body) => {
      // Check if there was an error
      if (err) {
        Logger.error(JSON.stringify(err));
        reject('Failed to list available packages');
        return;
      }

      const data: IAppList = JSON.parse(body);
      // Check if API returned an error
      if (data["odata.error"]) {
        Logger.error(JSON.stringify(data["odata.error"]));
        reject('Failed to list available packages');
        return;
      }

      Logger.info('Available apps successfully retrieved.');
      // Return the apps
      resolve(data.value);
    });
  });
}