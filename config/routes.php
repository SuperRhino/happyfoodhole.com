<?php
/**
 * Auth route middleware
 */
$must_auth = function($request, $response, $next)
{
    $params = $request->getQueryParams();
    $token = array_get($params, 'token');

    if (is_null($token)) {
        throw new \Core\Http\Exception\BadRequestException('Missing token URL parameter.');
    }

    if (! $this['app']->validateToken($token)) {
        throw new \Core\Http\Exception\UnauthorizedException('Invalid token.');
    }

    return $next($request, $response);
};

/**
 * Public Pages Routes:
 */
$this->get('/', 'App\Controllers\HomeController:index');
$this->get('/view-all', 'App\Controllers\HomeController:viewAll');
$this->get('/category/{categoryName}', 'App\Controllers\HomeController:showCategory');
$this->get('/search', 'App\Controllers\HomeController:searchResults');
$this->get('/sitemap.xml', 'App\Controllers\SitemapController:index');
$this->get('/rss', 'App\Controllers\SitemapController:rss');
$this->get('/{pageName}', 'App\Controllers\HomeController:showPage');

/**
 * Admin Pages Routes:
 */
$this->get('/admin/page-editor', 'App\Controllers\AdminController:pageEditor');
$this->get('/admin/page-inventory', 'App\Controllers\AdminController:pageInventory');

/**
 * API Routes:
 */
$this->post('/api/account/login', 'App\Controllers\Api\AccountController:login');
$this->post('/api/account/logout', 'App\Controllers\Api\AccountController:logout')->add($must_auth);
$this->get('/api/account', 'App\Controllers\Api\AccountController:getUser')->add($must_auth);

$this->get('/api/pages',         'App\Controllers\Api\PageController:getPages')->add($must_auth);
$this->post('/api/pages',        'App\Controllers\Api\PageController:addPage')->add($must_auth);
$this->get('/api/pages/{id}',   'App\Controllers\Api\PageController:getPage')->add($must_auth);
$this->post('/api/pages/{id}',   'App\Controllers\Api\PageController:updatePage')->add($must_auth);
$this->post('/api/upload-file',  'App\Controllers\Api\PageController:uploadFile')->add($must_auth);

// Catch all for any API route
$this->any('/api/{endpoint}', 'Core\BaseApiController:notFound');
