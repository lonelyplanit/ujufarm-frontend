// src/components/AddCropStatus.jsx
import { supabase } from '../supabaseClient'
import { useState } from 'react'

export default function AddCropStatus() {
  const [crop, setCrop] = useState('')
  const [status, setStatus] = useState('')

  const handleSave = async () => {
    const { error } = await supabase.from('crop_status').insert([
      {
        region: '경상남도 거창군',
        region_code: '4888000000',
        crop_name: crop,
        growth_stage: '생장기',
        status: status,
        status_code: 'A01',
        recorded_at: new Date().toISOString()
      }
    ])

    if (error) {
      alert('저장 실패: ' + error.message)
    } else {
      alert('작물 상태 저장 완료!')
    }
  }

  return (
    <div>
      <h3>작물 상태 입력</h3>
      <input placeholder="작물 이름" value={crop} onChange={(e) => setCrop(e.target.value)} />
      <input placeholder="상태 설명" value={status} onChange={(e) => setStatus(e.target.value)} />
      <button onClick={handleSave}>저장</button>
    </div>
  )
}
