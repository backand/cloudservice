describe('unit: app_log_service', function () {

  //var appLogService;
  var server;
  var appLogService;

  // get a reference to the module
  beforeEach(module('app'));

  /* use the $injector service to get a reference to the StorageService.
   Use the $httpBackend service to mock our server
   */
  beforeEach(inject(function ($injector, $httpBackend) {
    appLogService = $injector.get('AppLogService');
    server = $httpBackend;
  }));

  it('should defined', function () {
    expect(true).toBeDefined(true)
  })

})
