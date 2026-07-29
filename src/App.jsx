import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import { pages } from './pageRegistry.js'

// Routes are generated from src/pages/*.jsx — adding a page means adding a
// file there, not editing this one. See src/pageRegistry.js.
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {pages.map(({ slug, isIndex, routePath, Component }) =>
          isIndex ? (
            <Route index key={slug} element={<Component />} />
          ) : (
            <Route path={routePath} key={slug} element={<Component />} />
          ),
        )}
      </Route>
    </Routes>
  )
}
