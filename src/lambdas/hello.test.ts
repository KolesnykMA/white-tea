import {handler} from './hello'

describe('handler', () => {
    it('should export handler', () => {
        expect(handler).toBeDefined();
    })

    it("should return message", async () => {
        await handler(undefined, undefined, function(error: any, response: any) {
            let body = JSON.parse(response.body);
            expect(body).toEqual({
                message: 'Hello'
            });
        });
    });
})
