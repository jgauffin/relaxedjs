
describe("ViewEngine", () => {

    test("matches url with parameter", async () => {
        try {
            var result = await generateMappings('../example/');
            console.log(result);
        }
        catch (error) {
            console.log(error);
        }

    });

});