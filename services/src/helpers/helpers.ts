export class Helpers {
    static mapObjectParamsToUrl(
        urlTemplate: string,
        params: Record<string, string | number>
    ): string {
        return urlTemplate.replace(/:([a-zA-Z0-9_]+)/g, (_, key) => {
            const value = params[key];
            if (value === undefined) {
                throw new Error(`Missing parameter: ${key}`);
            }
            return encodeURIComponent(String(value));
        });
    }
}
