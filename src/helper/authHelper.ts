import { IOptions } from './../utils/IAlmTasks';
import * as request from "request";
import * as spauth from 'node-sp-auth';

export default class AuthHelper {
  /**
   * Create request headers
   */
  public static async getRequestHeaders(options: IOptions) {
    return new Promise((resolve, reject) => {
        (async () => {
            try {
                // Create the site URL
                const siteUrl = options.absoluteUrl ? options.absoluteUrl : `https://${options.tenant}.sharepoint.com/${options.site}`;

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

                resolve(headers);
            } catch (e) {
                console.log('ERROR:', e);
                reject(e);
            }
        })();
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
                if (verbose) {
                    console.log('ERROR:', err);
                }
                reject('Failed to retrieve the site and web ID');
                return;
            }

            // Parse the text to JSON
            const result = JSON.parse(body);
            if (result.FormDigestValue) {
                if (verbose) {
                    console.log('INFO: FormDigestValue retrieved');
                }
                resolve(result.FormDigestValue);
            } else {
                if (verbose) {
                    console.log('ERROR:', body);
                }
                reject('The FormDigestValue could not be retrieved');
            }
        });
    });
  }
}