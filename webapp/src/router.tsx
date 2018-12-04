import React from 'react'
// import Loadable from 'react-loadable'
import { Route, Switch } from 'react-router'

// import Footer from 'components/Footer'
// import HomePageLoader from 'pages/HomePage/components/ContentLoader'
import Header from 'components/Header'
import LoginPage from 'pages/LoginPage'

// const HomePage = Loadable({
// 	loader: () => import(
// 			webpackChunkName: "home-page",
// 			webpackPreload: true
// 		'./pages/HomePage'),
// 	loading: HomePageLoader,
// });

// const NotFoundPage = Loadable({
//   loader: () => import(
//     /*
//       webpackChunkName: "not-found-page",G
//       webpackPrefetch: true
//     */
//     './pages/NotFoundPage'),
//   loading: NotFoundPageLoader,
// });

// const ParallaxPage = Loadable({
//   loader: () => import
//       webpackChunkName: "parallax-page",
//       webpackPrefetch: true
//     './pages/ParallaxPage'),
//   loading: ParallaxPageLoader,
// });

// const ReactPage = Loadable({
//   loader: () => import(
//     /*
//       webpackChunkName: "react-page",
//       webpackPrefetch: true
//     */
//     './pages/ReactPage'),
//   loading: ReactPageLoader,
// });

export default (
	<div>
		<Header />
		<Switch>
			<Route exact path='/' component={LoginPage} />
			{/*<Route path='/react' component={ReactPage} />*/}
			{/*<Route path='/parallax' component={ParallaxPage} />*/}
			<Route component={LoginPage} />
		</Switch>
		{/*<Footer />*/}
	</div>
)
