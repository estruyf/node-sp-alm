import { IOptions } from './../utils/IAlmTasks';
import * as request from "request";
import * as spauth from 'node-sp-auth';
import Logger from './logger';

interface ICachedHeaders {
  [url: string]: IHeaders
}

interface IHeaders {
  [key: string]: any;
}

export default class AuthHelper {
  private static _headers: ICachedHeaders = {};
  
  /**
  * Create request headers
  */
  public static async getRequestHeaders(options: IOptions, siteUrl: string) {
    return new Promise(async (resolve, reject) => {      
      try {
        // Check if the request headers for the current site URL were already retrieved
        if (typeof AuthHelper._headers[siteUrl] !== "undefined") {
          Logger.info(`Request headers already retrieved for ${siteUrl}`)
          resolve(AuthHelper._headers[siteUrl]);
          return;
        }
        
        // Specify the site credentials
        const credentials = {
          username: options.username,
          password: options.password
        };
        
        // Authenticate against SharePoint
        const authResponse: spauth.IAuthResponse = await spauth.getAuth(siteUrl, credentials);
        // Perform request with any http-enabled library
        let headers = authResponse.headers;
        // Append the accept and content-type to the header
        headers["accept"] = "application/json";
        headers["content-type"] = "application/json";
        
        // Get the site and web ID
        const digestValue = await AuthHelper._getDigestValue(siteUrl, headers, options.verbose);
        // Add the digest value to the header
        headers["X-RequestDigest"] = digestValue;
        
        // Cache the headers
        AuthHelper._headers[siteUrl] = headers;
        
        resolve(headers);
      } catch (e) {
        Logger.error(JSON.stringify(e));
        reject(e);
      }
    });
  }
  
  /**
  * Retrieve the FormDigestValue for the current site
  * @param siteUrl The current site URL to call
  * @param headers The request headers
  */
  private static async _getDigestValue(siteUrl: string, headers: any, verbose: boolean) {
    return new Promise((resolve, reject) => {
      const apiUrl = `${siteUrl}/_api/contextinfo?$select=FormDigestValue`;
      request.post(apiUrl, { headers: headers }, (err, resp, body) => {
        if (err) {
          Logger.error(JSON.stringify(err));
          reject(`Failed to retrieve the FormDigestValue value for ${siteUrl}`);
          return;
        }
        
        // Parse the text to JSON
        const result = JSON.parse(body);
        if (result.FormDigestValue) {
          Logger.info(`FormDigestValue retrieved for ${siteUrl}`);
          resolve(result.FormDigestValue);
        } else {
          Logger.error(JSON.stringify(body))
          reject(`The FormDigestValue could not be retrieved for ${siteUrl}`);
        }
      });
    });
  }
}