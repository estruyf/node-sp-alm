import { IOptions } from './../utils/IAlmTasks';
import { ISiteCollectionAppCatalogsSites } from '../utils/ISiteCollectionAppCatalogsSites';
import appInsights from '../helper/appInsights';
import Logger from '../helper/logger';
import AppCatalog from '../helper/appCatalog';
import AuthHelper from '../helper/authHelper';
import * as request from 'request';

/**
* Function to get all the app catalog sites
* @param options Options
* @param filename File name
* @param contents File contents
*/
export async function getCatalogSites(options: IOptions): Promise<ISiteCollectionAppCatalogsSites> {  
  appInsights.trackEvent({
    name: 'siteCollectionAppCatalogsSites'
  });
  
  Logger.info('Starting to retrieve all app catalog sites');
  
  // Get the site URL
  const siteUrl = await AppCatalog.get(options, false);
  
  // Retrieve the headers for the API calls
  const headers = await AuthHelper.getRequestHeaders(options, siteUrl);
  
  // Create the rest API URL
  const restUrl = `${siteUrl}/_api/web/tenantappcatalog/SiteCollectionAppCatalogsSites`;
  
  return new Promise<ISiteCollectionAppCatalogsSites>((resolve, reject) => {
    Logger.info(`Calling the following API: ${restUrl}`);
    
    request(restUrl, { headers }, (err, resp, body) => {
      // Check if there was an error
      if (err) {
        Logger.error(JSON.stringify(err));
        reject('Failed to retrieve app catalog sites.');
        return;
      }
      
      const data: ISiteCollectionAppCatalogsSites = JSON.parse(body);
      // Check if API returned an error
      if (data["odata.error"]) {
        Logger.error(JSON.stringify(data["odata.error"]));
        reject('Failed to retrieve app catalog sites.');
        return;
      }
      
      Logger.info('App catalog sites information retrieved.');
      resolve(data);
    });
  });
}