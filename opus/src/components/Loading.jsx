import React from 'react'
import { FadeLoader } from 'react-spinners';

const Loading = () => {
  return (
    <div>
      <FadeLoader
        color="#000000"
        height={20}
        margin={2}
        radius={5}
        speedMultiplier={0.5}
        width={5}
      />
    </div>
  )
}
