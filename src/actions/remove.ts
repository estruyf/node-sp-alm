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
export async function remove(options: IOptions, pkgId: string, useAppCatalog: boolean = true): Promise<boolean> {
  // Check if the package ID was specified
  if (!pkgId) {
    throw "Package ID (pkgId) argument is required";
  }
  
  appInsights.trackEvent({
    name: 'remove'
  });
  
  Logger.info('Starting to remove solution package.');
  
  // Do the remove call
  return BaseRequester.post('Remove', pkgId, options, useAppCatalog);
}