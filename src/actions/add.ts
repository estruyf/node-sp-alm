import { IOptions } from './../utils/IAlmTasks';
import { IAddedApp } from '../utils/IAppMetadata';
import AuthHelper from '../helper/authHelper';
import appInsights from '../helper/appInsights';
import * as request from 'request';
import AppCatalog from '../helper/appCatalog';
import Logger from '../helper/logger';

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
    throw "Contents argument is required";
  }
  
  appInsights.trackEvent({
    name: 'add'
  });

  Logger.info('Starting to add solution package');
  
  // Get the site URL
  const siteUrl = await AppCatalog.get(options, useAppCatalog);
  
  // Retrieve the headers for the API calls
  const headers = await AuthHelper.getRequestHeaders(options, siteUrl);
  // Add binaryStringRequestBody header
  headers["binaryStringRequestBody"] = true;
  
  // Create the rest API URL
  const restUrl = `${siteUrl}/_api/web/tenantappcatalog/Add(overwrite=true, url='${filename}')`;
  
  return new Promise<IAddedApp>((resolve, reject) => {
    request.post(restUrl, { headers, body: contents }, (err, resp, body) => {
      // Check if there was an error
      if (err) {
        Logger.error(JSON.stringify(err));
        reject('Failed to add the solution package');
        return;
      }
      
      const data: IAddedApp = JSON.parse(body);
      // Check if API returned an error
      if (data["odata.error"]) {
        Logger.error(JSON.stringify(data["odata.error"]));
        reject('Failed to add the solution package');
        return;
      }

      Logger.info('Solution package got added to the app catalog.');
      resolve(data);
    });
  });
}