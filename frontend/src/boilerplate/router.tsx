import * as React from 'react'
import Loadable from 'react-loadable'
import { Route, Switch } from 'react-router'

import Footer from 'components/Footer'
import Header from 'components/Header'
import HomePageLoader from 'pages/HomePage/components/ContentLoader'
import NotFoundPageLoader from 'pages/NotFoundPage/components/ContentLoader'

const HomePage = Loadable({
  loader: () => import(
    /*
      webpackChunkName: "home-page",
      webpackPreload: true
    */
    './pages/HomePage'),
  loading: HomePageLoader,
});

const NotFoundPage = Loadable({
  loader: () => import(
    /*
      webpackChunkName: "not-found-page",
      webpackPrefetch: true
    */
    './pages/NotFoundPage'),
  loading: NotFoundPageLoader,
});

export default (
  <div>
    <Header />
    <Switch>
      <Route exact path='/' component={HomePage} />
      <Route component={NotFoundPage} />
    </Switch>
    <Footer />
  </div>
);
