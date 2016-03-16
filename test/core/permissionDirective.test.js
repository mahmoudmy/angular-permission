describe('directive: Permission', function () {
  'use strict';

  var $q, $log, $compile, $rootScope, Authorization, PermissionStore, PermissionMap;


  beforeEach(function () {
    // Instantiate module
    module('permission');

    // Inject services into module
    inject(function ($injector) {
      $q = $injector.get('$q');
      $log = $injector.get('$log');
      $compile = $injector.get('$compile');
      $rootScope = $injector.get('$rootScope').$new();
      Authorization = $injector.get('Authorization');
      PermissionStore = $injector.get('PermissionStore');
      PermissionMap = $injector.get('PermissionMap');
    });
  });

  // Initialize permissions
  beforeEach(function () {
    PermissionStore.definePermission('USER', function () {
      return true;
    });

    PermissionStore.definePermission('ADMIN', function () {
      return false;
    });
  });

  it('should log deprecation warning if deprecated "only" attribute is used [deprecated]', function () {
    // GIVEN
    var element = angular.element('<div permission only="[\'USER\']"></div>');

    // WHEN
    $compile(element)($rootScope);
    $rootScope.$digest();

    // THEN
    expect($log.warn.logs.length).toEqual(1);
  });

  it('should log deprecation warning if deprecated "except" attribute is used [deprecated]', function () {
    // GIVEN
    var element = angular.element('<div permission except="[\'USER\']"></div>');

    // WHEN
    $compile(element)($rootScope);
    $rootScope.$digest();

    // THEN
    expect($log.warn.logs.length).toEqual(1);
  });

  it('should show element if authorized when permissions are passed as string array', function () {
    // GIVEN
    var element = angular.element('<div permission permission-only="[\'USER\']"></div>');

    // WHEN
    $compile(element)($rootScope);
    $rootScope.$digest();

    // THEN
    expect(element.hasClass('ng-hide')).toBeFalsy();
  });

  it('should show element if authorized when permissions are passed as string array [deprecated]', function () {
    // GIVEN
    var element = angular.element('<div permission only="[\'USER\']"></div>');

    // WHEN
    $compile(element)($rootScope);
    $rootScope.$digest();

    // THEN
    expect(element.hasClass('ng-hide')).toBeFalsy();
  });

  it('should show element if authorized when permissions are passed as variable reference', function () {
    // GIVEN
    var element = angular.element('<div permission permission-only="only"></div>');
    $rootScope.only = ['USER'];

    // WHEN
    $compile(element)($rootScope);
    $rootScope.$digest();

    // THEN
    expect(element.hasClass('ng-hide')).toBeFalsy();
  });

  it('should show element if authorized when permissions are passed as variable reference [deprecated]', function () {
    // GIVEN
    var element = angular.element('<div permission only="only"></div>');
    $rootScope.only = ['USER'];

    // WHEN
    $compile(element)($rootScope);
    $rootScope.$digest();

    // THEN
    expect(element.hasClass('ng-hide')).toBeFalsy();
  });

  it('should hide element if unauthorized when permissions are passed as string array', function () {
    // GIVEN
    var element = angular.element('<div permission permission-except="[\'USER\']"></div>');

    // WHEN
    $compile(element)($rootScope);
    $rootScope.$digest();

    // THEN
    expect(element.hasClass('ng-hide')).toBeTruthy();
  });
  it('should hide element if unauthorized when permissions are passed as string array [deprecated]', function () {
    // GIVEN
    var element = angular.element('<div permission except="[\'USER\']"></div>');

    // WHEN
    $compile(element)($rootScope);
    $rootScope.$digest();

    // THEN
    expect(element.hasClass('ng-hide')).toBeTruthy();
  });

  it('should hide element if unauthorized when permissions are passed as variable reference', function () {
    // GIVEN
    var element = angular.element('<div permission permission-except="except"></div>');
    $rootScope.except = ['USER'];

    // WHEN
    $compile(element)($rootScope);
    $rootScope.$digest();

    // THEN
    expect(element.hasClass('ng-hide')).toBeTruthy();
  });

  it('should hide element if unauthorized when permissions are passed as variable reference [deprecated]', function () {
    // GIVEN
    var element = angular.element('<div permission except="except"></div>');
    $rootScope.except = ['USER'];

    // WHEN
    $compile(element)($rootScope);
    $rootScope.$digest();

    // THEN
    expect(element.hasClass('ng-hide')).toBeTruthy();
  });

  it('should watch for changes in "only" and "except" attributes', function () {
    // GIVEN
    var element = angular.element('<div permission permission-only="only"></div>');
    $rootScope.only = ['USER'];
    $compile(element)($rootScope);
    $rootScope.$digest();

    // WHEN
    $rootScope.only = ['ADMIN'];
    $rootScope.$digest();

    // THEN
    expect(element.hasClass('ng-hide')).toBeTruthy();
  });

  it('should call provided "onAuthorized" function when authorized', function () {
    // GIVEN
    $rootScope.only = ['USER'];
    $rootScope.onAuthorized = function (element) {
      element.removeAttr('disabled');
    };

    spyOn($rootScope, 'onAuthorized').and.callThrough();

    // WHEN
    var element = $compile('<input permission permission-only="only" permission-on-authorized="onAuthorized" disabled="disabled">')($rootScope);
    $rootScope.$digest();

    // THEN
    expect($rootScope.onAuthorized).toHaveBeenCalled();
    expect(element.attr('disabled')).not.toBeDefined();
  });

  it('should call provided "onUnauthorized" function when authorized', function () {
    // GIVEN
    $rootScope.only = ['ADMIN'];
    $rootScope.onUnauthorized = function (element) {
      element.attr('disabled', 'disabled');
    };

    spyOn($rootScope, 'onUnauthorized').and.callThrough();

    // WHEN
    var element = $compile('<input permission permission-only="only" permission-on-unauthorized="onUnauthorized">')($rootScope);
    $rootScope.$digest();

    // THEN
    expect($rootScope.onUnauthorized).toHaveBeenCalled();
    expect(element.attr('disabled')).toEqual('disabled');
  });

  it('should call authorize method', function () {
    // GIVEN
    var element = angular.element('<div permission permission-except="[\'USER\']"></div>');
    spyOn(Authorization, 'authorize');

    // WHEN
    $compile(element)($rootScope);
    $rootScope.$digest();

    // THEN
    expect(Authorization.authorize).toHaveBeenCalledWith(new PermissionMap({only: undefined, except: ['USER']}), null);
  });
});