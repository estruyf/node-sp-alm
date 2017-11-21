import { IOptions } from './../utils/IAlmTasks';
import { IAddedApp } from './IAppMetadata';
import AuthHelper from '../helper/authHelper';
import appInsights from '../helper/appInsights';
import * as request from 'request';
import AppCatalog from '../helper/appCatalog';

/**
 * Function to add a solution package to the app catalog
 * @param options Options
 * @param filename File name
 * @param contents File contents
 */
export async function add(options: IOptions, filename: string, contents: Buffer, useAppCatalog: boolean = true): Promise<IAddedApp> {
  // Check if the filename was specified
  if (!filename) {
    throw "Filename argument is required";
  }
  // Check if the contents was specified
  if (!contents) {
    throw "Filename argument is required";
  }

  appInsights.trackEvent({
    name: 'add'
  });

  const headers = await AuthHelper.getRequestHeaders(options);
  // Add binaryStringRequestBody header
  headers["binaryStringRequestBody"] = true;
  let siteUrl = options.absoluteUrl ? options.absoluteUrl : `https://${options.tenant}.sharepoint.com/${options.site}`;
  if (useAppCatalog) {
    siteUrl = await AppCatalog.get(options);
  }
  const restUrl = `${siteUrl}/_api/web/tenantappcatalog/Add(overwrite=true, url='${filename}')`;

  return new Promise<IAddedApp>((resolve, reject) => {
    request.post(restUrl, { headers, body: contents }, (err, resp, body) => {
      // Check if there was an error
      if (err) {
        if (options.verbose) {
            console.log('ERROR:', err);
        }
        reject('Failed to add the solution package');
        return;
      }

      const data: IAddedApp = JSON.parse(body);
      // Check if API returned an error
      if (data["odata.error"]) {
        if (options.verbose) {
          console.log('ERROR:', data["odata.error"]);
        }
        reject('Failed to add the solution package');
        return;
      }

      if (options.verbose) {
        console.log('INFO: Solution package got added to the app catalog.');
      }
      resolve(data);
    });
  });
}