import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _18203eb0 = () => interopDefault(import('..\\pages\\batch_estados.vue' /* webpackChunkName: "pages/batch_estados" */))
const _43e5f37c = () => interopDefault(import('..\\pages\\dashboard.vue' /* webpackChunkName: "pages/dashboard" */))
const _7339d69a = () => interopDefault(import('..\\pages\\getBatchDate.vue' /* webpackChunkName: "pages/getBatchDate" */))
const _58939f8a = () => interopDefault(import('..\\pages\\getBatchList.vue' /* webpackChunkName: "pages/getBatchList" */))
const _61ae5160 = () => interopDefault(import('..\\pages\\getLoteDate.vue' /* webpackChunkName: "pages/getLoteDate" */))
const _6b2524b2 = () => interopDefault(import('..\\pages\\home.vue' /* webpackChunkName: "pages/home" */))
const _bdb5a45e = () => interopDefault(import('..\\pages\\login.vue' /* webpackChunkName: "pages/login" */))
const _0db5e105 = () => interopDefault(import('..\\pages\\sap_batch.vue' /* webpackChunkName: "pages/sap_batch" */))
const _1ce764f0 = () => interopDefault(import('..\\pages\\users.vue' /* webpackChunkName: "pages/users" */))
const _5104ea8c = () => interopDefault(import('..\\pages\\index.vue' /* webpackChunkName: "pages/index" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/batch_estados",
    component: _18203eb0,
    name: "batch_estados"
  }, {
    path: "/dashboard",
    component: _43e5f37c,
    name: "dashboard"
  }, {
    path: "/getBatchDate",
    component: _7339d69a,
    name: "getBatchDate"
  }, {
    path: "/getBatchList",
    component: _58939f8a,
    name: "getBatchList"
  }, {
    path: "/getLoteDate",
    component: _61ae5160,
    name: "getLoteDate"
  }, {
    path: "/home",
    component: _6b2524b2,
    name: "home"
  }, {
    path: "/login",
    component: _bdb5a45e,
    name: "login"
  }, {
    path: "/sap_batch",
    component: _0db5e105,
    name: "sap_batch"
  }, {
    path: "/users",
    component: _1ce764f0,
    name: "users"
  }, {
    path: "/",
    component: _5104ea8c,
    name: "index"
  }],

  fallback: false
}

export function createRouter (ssrContext, config) {
  const base = (config._app && config._app.basePath) || routerOptions.base
  const router = new Router({ ...routerOptions, base  })

  // TODO: remove in Nuxt 3
  const originalPush = router.push
  router.push = function push (location, onComplete = emptyFn, onAbort) {
    return originalPush.call(this, location, onComplete, onAbort)
  }

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    return resolve(to, current, append)
  }

  return router
}
