import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export default function CropStatusList() {
  const [data, setData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from('crop_status').select('*')
      if (error) console.error('Error:', error)
      else setData(data)
    }

    fetchData()
  }, [])

  return (
    <div>
      <h2>작물 상태 목록</h2>
      {data.length === 0 ? (
        <p>저장된 작물 상태가 없습니다.</p>
      ) : (
        <ul>
          {data.map((item) => (
            <li key={item.id}>
              🌿 {item.crop_name} ({item.region}) – {item.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
