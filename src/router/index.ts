import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import PageManagerPage from '@/pages/PageManagerPage.vue'
import PageViewerPage from '@/pages/PageViewerPage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/page-manager',
    name: 'PageManager',
    component: PageManagerPage
  },
  {
    path: '/page/:pageId',
    name: 'PageViewer',
    component: PageViewerPage,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 