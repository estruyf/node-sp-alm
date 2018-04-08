import { IAppMetadata, IAddedApp } from './utils/IAppMetadata';
import { IOptions } from './utils/IAlmTasks';
import * as fs from 'fs';
import * as url from 'url';
import AuthHelper from './helper/authHelper';
import Logger from './helper/logger';
import uuid4 from './helper/uuid4';
import appInsights from './helper/appInsights';
import * as actions from './actions';
import { ISiteCollectionAppCatalogsSites } from './utils/ISiteCollectionAppCatalogsSites';

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
   * @param useAppCatalog Default: true
   */
  public async list(useAppCatalog: boolean = true): Promise<IAppMetadata[]> {
    return await actions.list(this._internalOptions, useAppCatalog);
  }
  
  /**
   * Details on individual solution package from app catalog
   * @param pkgId Provide the GUID of the solution 
   * @param useAppCatalog Default: true 
   */
  public async appDetails(pkgId: string, useAppCatalog: boolean = true): Promise<IAppMetadata> {
    return await actions.details(this._internalOptions, pkgId, useAppCatalog);
  }
  
  /**
   * Add solution package to app catalog
   * @param filename Provide the filename
   * @param contents Provide the file contents
   * @param overwrite Default: true
   * @param useAppCatalog Default: true
   */
  public async add(filename: string, contents: Buffer, overwrite: boolean = true, useAppCatalog: boolean = true): Promise<IAddedApp> {
    return await actions.add(this._internalOptions, filename, contents, overwrite, useAppCatalog);
  }
  
  /**
   * Deploy solution package in app catalog
   * @param pkgId Provide the GUID of the solution 
   * @param skipFeatureDeployment Specify if you want to skip feature deployment 
   * @param useAppCatalog Default: true
   */
  public async deploy(pkgId: string, skipFeatureDeployment: boolean, useAppCatalog: boolean = true): Promise<boolean> {
    return await actions.deploy(this._internalOptions, pkgId, skipFeatureDeployment, useAppCatalog);
  }
  
  /**
   * Retract solution package in app catalog
   * @param pkgId Provide the GUID of the solution 
   * @param useAppCatalog Default: true
   */
  public async retract(pkgId: string, useAppCatalog: boolean = true): Promise<boolean> {
    return await actions.retract(this._internalOptions, pkgId, useAppCatalog);
  }
  
  /**
   * Remove solution package from app catalog
   * @param pkgId Provide the GUID of the solution 
   * @param useAppCatalog Default: true
   */
  public async remove(pkgId: string, useAppCatalog: boolean = true): Promise<boolean> {
    return await actions.remove(this._internalOptions, pkgId, useAppCatalog);
  }
  
  /**
   * Install solution package from app catalog to SharePoint site
   * @param pkgId Provide the GUID of the solution 
   */
  public async install(pkgId: string): Promise<boolean> {
    return await actions.install(this._internalOptions, pkgId);
  }
  
  /**
   * Uninstall solution package from SharePoint site
   * @param pkgId Provide the GUID of the solution 
   */
  public async uninstall(pkgId: string): Promise<boolean> {
    return await actions.uninstall(this._internalOptions, pkgId);
  }
  
  /**
   * Upgrade solution package in SharePoint site
   * @param pkgId Provide the GUID of the solution
   */
  public async upgrade(pkgId: string): Promise<boolean> {
    return await actions.upgrade(this._internalOptions, pkgId);
  }

  /**
   * List available site collection app catalogs
   */
  public async getCatalogSites(): Promise<ISiteCollectionAppCatalogsSites> {
    return await actions.getCatalogSites(this._internalOptions);
  }
}