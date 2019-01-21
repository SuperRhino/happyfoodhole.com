import React from 'react';
import ReactDOM from 'react-dom';
import path from 'path';
import Utils from '../Utils/Utils';
import PageEditor from '../Views/PageEditor';
import PageInventory from '../Views/PageInventory';
import BlogSearch from '../Components/BlogSearch';

export default class Routes {

  static homeRoute = 'home';

  static current(pathname) {
    var basename = path.basename(pathname) || Routes.homeRoute;
    var camelName = basename.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
    if (typeof Routes[camelName] === 'function') {
      Routes[camelName]();
    }
    Routes._common();
  }

  static _common() {
    let SearchElement = document.getElementById('BlogSearch');

    if (SearchElement) {
      let searchTerm = window.GLOBAL_DATA.searchTerm;
      ReactDOM.render(
        <BlogSearch term={searchTerm} />,
        document.getElementById('BlogSearch')
      );
    }
  }

  //----------------------------
  // Custom Routes:
  //----------------------------

  static home() {
    console.log('Home route');
  }

  //----------------------------
  // Admin Routes:
  //----------------------------

  static pageEditor() {
    let pageId = Utils.getQueryParam('id') || null;
    if (pageId) pageId = parseInt(pageId);
    ReactDOM.render(
      <PageEditor pageId={pageId} />,
      document.getElementById('PageEditor')
    );
  }

  static pageInventory() {
    ReactDOM.render(
      <PageInventory />,
      document.getElementById('PageInventory')
    );
  }

}
