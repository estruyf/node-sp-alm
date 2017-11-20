import { IAppList, IAppMetadata } from './IAppMetadata';
import { IOptions } from './../utils/IAlmTasks';
import AuthHelper from '../helper/authHelper';
import appInsights from '../helper/appInsights';
import * as request from 'request';

/**
 * Function to list all available apps
 * @param options 
 */
export async function list(options: IOptions): Promise<IAppMetadata[]> {
  appInsights.trackEvent({
    name: 'list'
  });

  const headers = await AuthHelper.getRequestHeaders(options);
  const siteUrl = options.absoluteUrl ? options.absoluteUrl : `https://${options.tenant}.sharepoint.com/${options.site}`;
  const restUrl = `${siteUrl}/_api/web/tenantappcatalog/AvailableApps`;

  return new Promise<IAppMetadata[]>((resolve, reject) => {
    request.post(restUrl, { headers }, (err, resp, body) => {
      // Check if there was an error
      if (err) {
        if (options.verbose) {
            console.log('ERROR:', err);
        }
        reject('Failed to list available packages');
        return;
      }

      const data: IAppList = JSON.parse(body);
      // Check if API returned an error
      if (data["odata.error"]) {
        if (options.verbose) {
          console.log('ERROR:', data["odata.error"]);
        }
        reject('Failed to list available packages');
        return;
      }

      // Return the apps
      resolve(data.value);
    });
  });
}