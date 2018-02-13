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
export async function retract(options: IOptions, pkgId: string, useAppCatalog: boolean = true): Promise<boolean> {
  // Check if the package ID was specified
  if (!pkgId) {
    throw "Package ID (pkgId) argument is required";
  }
  
  appInsights.trackEvent({
    name: 'retract'
  });
  
  Logger.info('Starting to retract solution package.');
  
  // Do the retract call
  return BaseRequester.post('Retract', pkgId, options, useAppCatalog);
}