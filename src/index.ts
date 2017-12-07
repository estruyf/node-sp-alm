import { IAppMetadata, IAddedApp } from './actions/IAppMetadata';
import { IOptions } from './utils/IAlmTasks';
import * as fs from 'fs';
import * as url from 'url';
import AuthHelper from './helper/authHelper';
import Logger from './helper/logger';
import uuid4 from './helper/uuid4';
import appInsights from './helper/appInsights';
import * as actions from './actions';

export class ALM {
  private _internalOptions: IOptions = {};
  
  constructor(options: IOptions) {
    appInsights.trackEvent({
      name: 'started'
    });
    
    this._internalOptions.username = options.username || "";
    this._internalOptions.password = options.password || "";
    this._internalOptions.tenant = options.tenant || "";
    this._internalOptions.site = options.site || "";
    this._internalOptions.absoluteUrl = options.absoluteUrl || "";
    this._internalOptions.verbose = typeof options.verbose !== "undefined" ? options.verbose : true;
    
    if (this._internalOptions.username === "") {
      throw "Username argument is required";
    }
    
    if (this._internalOptions.password === "") {
      throw "Password argument is required";
    }
    
    if (this._internalOptions.tenant === "" &&
    this._internalOptions.absoluteUrl === "") {
      throw "Tenant OR absoluteUrl argument is required";
    }

    // Set the verbose logging context
    Logger.init(this._internalOptions.verbose);
  }
  
  /**
  * List available packages from app catalog
  */
  public async list(useAppCatalog: boolean = true): Promise<IAppMetadata[]> {
    return await actions.list(this._internalOptions, useAppCatalog);
  }
  
  /**
  * Details on individual solution package from app catalog
  */
  public async appDetails(pkgId: string, useAppCatalog: boolean = true): Promise<IAppMetadata> {
    return await actions.details(this._internalOptions, pkgId, useAppCatalog);
  }
  
  /**
  * Add solution package to app catalog
  */
  public async add(filename: string, contents: Buffer, useAppCatalog: boolean = true): Promise<IAddedApp> {
    return await actions.add(this._internalOptions, filename, contents, useAppCatalog);
  }
  
  /**
  * Deploy solution package in app catalog
  */
  public async deploy(pkgId: string, skipFeatureDeployment: boolean, useAppCatalog: boolean = true): Promise<boolean> {
    return await actions.deploy(this._internalOptions, pkgId, skipFeatureDeployment, useAppCatalog);
  }
  
  /**
  * Retract solution package in app catalog
  */
  public async retract() {
    appInsights.trackEvent({
      name: 'retract'
    });
    console.log('retract - not yet implemented');
  }
  
  /**
  * Remove solution package from app catalog
  */
  public async remove() {
    appInsights.trackEvent({
      name: 'remove'
    });
    console.log('remove - not yet implemented');
  }
  
  /**
  * Install solution package from app catalog to SharePoint site
  */
  public async install() {
    appInsights.trackEvent({
      name: 'install'
    });
    console.log('install - not yet implemented');
  }
  
  /**
  * Uninstall solution package from SharePoint site
  */
  public async uninstall() {
    appInsights.trackEvent({
      name: 'uninstall'
    });
    console.log('uninstall - not yet implemented');
  }
  
  /**
  * Upgrade solution package in SharePoint site
  */
  public async upgrade() {
    appInsights.trackEvent({
      name: 'upgrade'
    });
    console.log('upgrade - not yet implemented');
  }

  /**
   * List available site collection app catalogs
   */
  public async siteCollectionAppCatalogsSites() {
    // _api/web/tenantappcatalog/SiteCollectionAppCatalogsSites
    appInsights.trackEvent({
      name: 'siteCollectionAppCatalogsSites'
    });
    console.log('upgrade - not yet implemented');
  }
}