import * as crypto from 'crypto';

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

export default class uuid4 {
    /**
     * Generate a new GUID
     */
    public static generate() {
        let rnd = crypto.randomBytes(16);
        rnd[6] = (rnd[6] & 0x0f) | 0x40;
        rnd[8] = (rnd[8] & 0x3f) | 0x80;
        let guid = rnd.toString('hex').match(/(.{8})(.{4})(.{4})(.{4})(.{12})/);
        guid.shift();
        return guid.join('-');
    }

    /**
     * Validate your GUID
     * @param uuid The GUID to test
     */
    public static valid(uuid: string): boolean {
        return uuidPattern.test(uuid);
    }
}