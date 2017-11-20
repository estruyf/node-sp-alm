import { IOptions } from './../utils/IAlmTasks';
import AuthHelper from '../helper/authHelper';
import appInsights from '../helper/appInsights';
import * as request from 'request';

/**
 * Function to deploy the app
 * @param options 
 * @param pkgId 
 * @param skipFeatureDeployment 
 */
export async function deploy(options: IOptions, pkgId: string, skipFeatureDeployment: boolean = true): Promise<boolean> {
  // Check if the package ID was specified
  if (!pkgId) {
    throw "Package ID (pkgId) argument is required";
  }

  appInsights.trackEvent({
    name: 'deploy'
  });

  const headers = await AuthHelper.getRequestHeaders(options);
  const siteUrl = options.absoluteUrl ? options.absoluteUrl : `https://${options.tenant}.sharepoint.com/${options.site}`;
  const restUrl = `${siteUrl}/_api/web/tenantappcatalog/AvailableApps/GetById('${pkgId}')/Deploy`;

  return new Promise<boolean>((resolve, reject) => {
    request.post(restUrl, { headers, body: JSON.stringify({ "skipFeatureDeployment": skipFeatureDeployment }) }, (err, resp, body) => {
      // Check if there was an error
      if (err) {
        if (options.verbose) {
            console.log('ERROR:', err);
        }
        reject('Failed to list available packages');
        return;
      }

      const data = JSON.parse(body);
      // Check if API returned an error
      if (data["odata.error"]) {
        if (options.verbose) {
          console.log('ERROR:', data["odata.error"]);
        }
        reject('Failed to list available packages');
        return;
      }

      if (resp.statusCode === 200) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}