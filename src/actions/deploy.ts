import { IOptions } from './../utils/IAlmTasks';
import AuthHelper from '../helper/authHelper';
import AppCatalog from '../helper/appCatalog';
import appInsights from '../helper/appInsights';
import * as request from 'request';
import Logger from '../helper/logger';
import BaseRequester from '../helper/baseRequester';

/**
* Function to deploy the app
* @param options 
* @param pkgId 
* @param skipFeatureDeployment 
*/
export async function deploy(options: IOptions, pkgId: string, skipFeatureDeployment: boolean = true, useAppCatalog: boolean = true): Promise<boolean> {
  // Check if the package ID was specified
  if (!pkgId) {
    throw "Package ID (pkgId) argument is required";
  }
  
  appInsights.trackEvent({
    name: 'deploy'
  });
  
  Logger.info('Starting to deploy solution package.');
  
  // Do the deploy call
  return BaseRequester.post('Deploy', pkgId, options, useAppCatalog, skipFeatureDeployment);
}