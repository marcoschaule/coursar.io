describe('angularjs homepage todo list', function() {
    it('should add a todo', function() {
        browser.get('http://localhost:3000/sign-in');

        element(by.model('vm.modelSignUp.username')).sendKeys('some username');
        element(by.model('vm.modelSignUp.password')).sendKeys('some password');
        element(by.css('#sign-in')).click();

        // expect(todoList.count()).toEqual(3);
        // expect(todoList.get(2).getText()).toEqual('write first protractor test');
    });
});

