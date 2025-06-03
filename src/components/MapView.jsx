import { useState } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import materialMarkerIcon from './materialMarkerIcon.js'
import 'leaflet/dist/leaflet.css'

const API_BASE = import.meta.env.VITE_API_BASE

function MapClickHandler({ onClick }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng)
    },
  })
  return null
}

function MapView() {
  const [clickedLocation, setClickedLocation] = useState(null)
  const [regionName, setRegionName] = useState(null)
  const [weatherData, setWeatherData] = useState(null)
  const [elevation, setElevation] = useState(null)
  const [airQuality, setAirQuality] = useState(null)

  const fetchRegionName = async (lat, lon) => {
    try {
      const res = await fetch(`${API_BASE}api/reverse-geocode?lat=${lat}&lon=${lon}`)
      const json = await res.json()
      const region = json.documents?.[0]?.region_2depth_name || '알 수 없음'
      setRegionName(region)
    } catch (err) {
      console.error('Reverse Geocoding Error:', err)
      setRegionName('지역 정보 없음')
    }
  }

  const fetchData = async (lat, lon) => {
    try {
      const [weatherRes, elevRes, airRes] = await Promise.all([
        fetch(`${API_BASE}api/weather?lat=${lat}&lon=${lon}`),
        fetch(`${API_BASE}api/elevation?lat=${lat}&lon=${lon}`),
        fetch(`${API_BASE}api/air?lat=${lat}&lon=${lon}`),
      ])

      const weatherJson = await weatherRes.json()
      const elevJson = await elevRes.json()
      const airJson = await airRes.json()

      setWeatherData(weatherJson)
      setElevation(elevJson.results?.[0]?.elevation ?? null)
      setAirQuality(airJson.list?.[0] ?? null)
    } catch (error) {
      console.error('❌ API fetch 오류:', error)
      setWeatherData(null)
      setElevation(null)
      setAirQuality(null)
    }
  }

  const handleMapClick = (latlng) => {
    setClickedLocation(latlng)
    fetchRegionName(latlng.lat, latlng.lng)
    fetchData(latlng.lat, latlng.lng)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '90%', margin: '0 auto' }}>
      <div style={{ width: '100%' }}>
        <MapContainer center={[36.5, 127.5]} zoom={7} style={{ height: '600px', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
          />
          <MapClickHandler onClick={handleMapClick} />
          {clickedLocation && (
            <Marker
              position={[clickedLocation.lat, clickedLocation.lng]}
              icon={materialMarkerIcon}
            />
          )}
        </MapContainer>
      </div>

      <div
        style={{
          marginTop: '20px',
          padding: '20px',
          background: '#f9f9f9',
          border: '1px solid #ccc',
          width: '100%',
          color: '#333',
        }}
      >
        <h3>📋 상세 정보</h3>
        {!clickedLocation && <p>지도를 클릭하여 위치를 선택하세요.</p>}

        {clickedLocation && (
          <>
            <p>📍 위도: {clickedLocation.lat.toFixed(4)}</p>
            <p>📍 경도: {clickedLocation.lng.toFixed(4)}</p>
            <p>🗺️ 행정구역: {regionName}</p>
            {elevation !== null && <p>🌄 고도: {Math.round(elevation)} m</p>}

            {weatherData?.weather?.[0] && (
              <>
                <p>🌤️ 날씨: {weatherData.weather[0].description ?? '정보없음 '}</p>
                <p>🌡️ 온도: {weatherData.main?.temp ?? '-'} °C</p>
                <p>🧭 기압: {weatherData.main?.pressure ?? '-'} hPa</p>
                <p>💧 습도: {weatherData.main?.humidity ?? '-'} %</p>
              </>
            )}

            {airQuality?.components && (
              <>
                <p>💨 PM2.5: {airQuality.components.pm2_5 ?? '-'} μg/m³</p>
                <p>💨 PM10: {airQuality.components.pm10 ?? '-'} μg/m³</p>
                <p>💨 일산화탄소(CO): {airQuality.components.co ?? '-'} μg/m³</p>
                <p>💨 이산화질소(NO₂): {airQuality.components.no2 ?? '-'} μg/m³</p>
                <p>💨 오존(O₃): {airQuality.components.o3 ?? '-'} μg/m³</p>
                <p>💨 아황산가스(SO₂): {airQuality.components.so2 ?? '-'} μg/m³</p>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default MapView
