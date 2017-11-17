import { IOptions } from './utils/IAlmTasks';
import * as spauth from 'node-sp-auth';
import * as request from 'request';
import * as fs from 'fs';
import * as url from 'url';
import uuid4 from './helper/uuid4';

export default class NodeSPAlm {
    private _internalOptions: IOptions = {};

    constructor(options: IOptions) {
        this._internalOptions.username = options.username || "";
        this._internalOptions.password = options.password || "";
        this._internalOptions.tenant = options.tenant || "";
        this._internalOptions.site = options.site || "";
        this._internalOptions.absoluteUrl = options.absoluteUrl || "";
        this._internalOptions.pkgId = options.pkgId || "";
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

        if (this._internalOptions.site === "" &&
            this._internalOptions.absoluteUrl === "") {
            throw "Site OR absoluteUrl argument is required";
        }

        if (this._internalOptions.pkgId === "") {
            throw "Package ID (pkgId) argument is required";
        }
    }

    /**
     * List available packages from app catalog
     */
    public async list() {
        console.log('list - not yet implemented');
    }

    /**
     * Details on individual solution package from app catalog
     */
    public async appDetails() {
        console.log('appDetails - not yet implemented');
    }

    /**
     * Add solution package to app catalog
     */
    public async add() {
        console.log('add - not yet implemented');
    }

    /**
     * Deploy solution package in app catalog
     */
    public async deploy() {
        console.log('deploy - not yet implemented');
    }

    /**
     * Retract solution package in app catalog
     */
    public async retract() {
        console.log('retract - not yet implemented');
    }

    /**
     * Remove solution package from app catalog
     */
    public async remove() {
        console.log('remove - not yet implemented');
    }

    /**
     * Install solution package from app catalog to SharePoint site
     */
    public async install() {
        console.log('install - not yet implemented');
    }

    /**
     * Uninstall solution package from SharePoint site
     */
    public async uinstall() {
        console.log('uninstall - not yet implemented');
    }

    /**
     * Upgrade solution package in SharePoint site
     */
    public async upgrade() {
        console.log('upgrade - not yet implemented');
    }
}