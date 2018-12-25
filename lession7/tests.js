var should = chai.should();
describe('simple test', function(){
    it('should = 0 when n===0', function(){
        window.fibonacci(0).should .equal(0);
    });
});