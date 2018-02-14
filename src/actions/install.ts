import { IOptions } from './../utils/IAlmTasks';
import appInsights from '../helper/appInsights';
import Logger from '../helper/logger';
import BaseRequester from '../helper/baseRequester';

/**
* Function to retract the solution package
* @param options 
* @param pkgId 
* @param useAppCatalog 
*/
export async function install(options: IOptions, pkgId: string): Promise<boolean> {
  // Check if the package ID was specified
  if (!pkgId) {
    throw "Package ID (pkgId) argument is required";
  }
  
  appInsights.trackEvent({
    name: 'install'
  });
  
  Logger.info('Starting to install solution package.');
  
  // Do the install call
  return BaseRequester.post('Install', pkgId, options, false);
}