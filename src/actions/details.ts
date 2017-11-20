import { IAppMetadata } from './IAppMetadata';
import { IOptions } from './../utils/IAlmTasks';
import AuthHelper from '../helper/authHelper';
import appInsights from '../helper/appInsights';
import * as request from 'request';

/**
 * Function get the app details
 * @param options Options
 * @param pkgId App ID
 */
export async function details(options: IOptions, pkgId: string): Promise<IAppMetadata> {
  // Check if the package ID was specified
  if (!pkgId) {
    throw "Package ID (pkgId) argument is required";
  }

  appInsights.trackEvent({
    name: 'appDetails'
  });

  const headers = await AuthHelper.getRequestHeaders(options);
  const siteUrl = options.absoluteUrl ? options.absoluteUrl : `https://${options.tenant}.sharepoint.com/${options.site}`;
  const restUrl = `${siteUrl}/_api/web/tenantappcatalog/AvailableApps/GetById('${pkgId}')`;

  return new Promise<IAppMetadata>((resolve, reject) => {
    request(restUrl, { headers }, (err, resp, body) => {
      // Check if there was an error
      if (err) {
        if (options.verbose) {
            console.log('ERROR:', err);
        }
        reject('Failed to list available packages');
        return;
      }

      const data: IAppMetadata = JSON.parse(body);
      // Check if API returned an error
      if (data["odata.error"]) {
        if (options.verbose) {
          console.log('ERROR:', data["odata.error"]);
        }
        reject('Failed to list available packages');
        return;
      }

      resolve(data);
    });
  });
}