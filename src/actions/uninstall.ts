import { IOptions } from './../utils/IAlmTasks';
import appInsights from '../helper/appInsights';
import Logger from '../helper/logger';
import BaseRequester from '../helper/baseRequester';

/**
* Function to uninstall the solution package
* @param options 
* @param pkgId 
* @param useAppCatalog 
*/
export async function uninstall(options: IOptions, pkgId: string): Promise<boolean> {
  // Check if the package ID was specified
  if (!pkgId) {
    throw "Package ID (pkgId) argument is required";
  }
  
  appInsights.trackEvent({
    name: 'uninstall'
  });
  
  Logger.info('Starting to uninstall solution package.');
  
  // Do the uninstall call
  return BaseRequester.post('Uninstall', pkgId, options, false);
}