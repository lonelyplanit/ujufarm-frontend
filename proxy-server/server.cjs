// server.cjs
const express = require('express')
const fetch = require('node-fetch')
const dotenv = require('dotenv')
const cors = require('cors')
const path = require('path')

// .env 로드
dotenv.config({ path: path.resolve(__dirname, '.env') })

const app = express()
const PORT = 3001

app.use(cors())

console.log('▶ 실행 경로:', __dirname)
console.log('▶ .env 예상 경로:', path.resolve(__dirname, '.env'))
console.log('▶ KAKAO_API_KEY:', process.env.KAKAO_API_KEY)
console.log('▶ OPENWEATHER_API_KEY:', process.env.OPENWEATHER_API_KEY)
console.log('▶ GOOGLE_ELEVATION_KEY:', process.env.GOOGLE_ELEVATION_KEY)

//
// ✅ 1. Reverse Geocoding (Kakao)
//
app.get('/api/reverse-geocode', async (req, res) => {
  const { lat, lon } = req.query
  try {
    const url = `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${lon}&y=${lat}`
    const response = await fetch(url, {
      headers: {
        Authorization: `KakaoAK ${process.env.KAKAO_API_KEY}`,
      },
    })
    const data = await response.json()
    res.json(data)
  } catch (error) {
    console.error('❌ Reverse Geocoding Error:', error)
    res.status(500).json({ error: 'Failed to fetch region data' })
  }
})

//
// ✅ 2. 날씨 API (OpenWeatherMap)
//
app.get('/api/weather', async (req, res) => {
  const { lat, lon } = req.query
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric&lang=kr`
    const response = await fetch(url)
    const data = await response.json()
    res.json(data)
  } catch (error) {
    console.error('❌ Weather API Error:', error)
    res.status(500).json({ error: 'Failed to fetch weather data' })
  }
})

//
// ✅ 3. 고도 정보 (Google Elevation API)
//
app.get('/api/elevation', async (req, res) => {
  const { lat, lon } = req.query
  try {
    const url = `https://maps.googleapis.com/maps/api/elevation/json?locations=${lat},${lon}&key=${process.env.GOOGLE_ELEVATION_KEY}`
    const response = await fetch(url)
    const data = await response.json()
    res.json(data)
  } catch (error) {
    console.error('❌ Elevation API Error (Google):', error)
    res.status(500).json({ error: 'Failed to fetch elevation data' })
  }
})

//
// ✅ 4. 대기질 정보 (OpenWeatherMap Air Pollution API)
//
app.get('/api/air', async (req, res) => {
  const { lat, lon } = req.query
  try {
    const url = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}`
    const response = await fetch(url)
    const data = await response.json()
    res.json(data)
  } catch (error) {
    console.error('❌ Air Quality API Error:', error)
    res.status(500).json({ error: 'Failed to fetch air quality data' })
  }
})

//
// ✅ 서버 시작
//
app.listen(PORT, () => {
  console.log(`🚀 Proxy server running at http://localhost:${PORT}`)
})
