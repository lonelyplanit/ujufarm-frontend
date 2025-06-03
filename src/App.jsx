import { Routes, Route, Link } from 'react-router-dom'
import MapView from './components/MapView'
import CropStatusList from './components/CropStatusList'

function App() {
  return (
    <div>
      <header>
        <h1>UjuFarm 스마트팜 플랫폼</h1>
        <nav style={{ marginBottom: '20px' }}>
          <Link to="/">홈</Link> | <Link to="/crop-status">작물 상태</Link>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<MapView />} />
        <Route path="/crop-status" element={<CropStatusList />} />
      </Routes>
    </div>
  )
}

export default App
