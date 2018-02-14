import { IOptions } from './../utils/IAlmTasks';
import appInsights from '../helper/appInsights';
import Logger from '../helper/logger';
import BaseRequester from '../helper/baseRequester';

/**
* Function to upgrade the solution package
* @param options 
* @param pkgId 
* @param useAppCatalog 
*/
export async function upgrade(options: IOptions, pkgId: string): Promise<boolean> {
  // Check if the package ID was specified
  if (!pkgId) {
    throw "Package ID (pkgId) argument is required";
  }
  
  appInsights.trackEvent({
    name: 'upgrade'
  });
  
  Logger.info('Starting to upgrade solution package.');
  
  // Do the upgrade call
  return BaseRequester.post('Upgrade', pkgId, options, false);
}