import React, { useMemo, useState } from 'react'
import { useEth } from 'hyperfy'

// Lens 
const CONTRACT = '0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d'

export function Web3() {
  const eth = useEth("polygon")
  const contract = useMemo(() => eth.contract(CONTRACT, ['function getHandle(uint256 profileId)']) )
  const [status, setStatus] = useState(null)

  async function getHandle(e) {
    // check to see if the user is logged in
    const { address } = e.avatar
    // if there's no address, notify them via <text />
    if (!address) return setStatus('Not connected!')
    setStatus('Checking...')
    const supply = await contract.read('getHandle', '0x0102cc')
    setStatus(`Handle: ${supply}`)
  }

  async function follow(e) {
    const { address } = e.avatar
    if (!address) return setStatus('Not connected!')
    setStatus('Please confirm transaction')
    // follow user example
    const tx = await contract.write('follow', [749], ['0x'])
    setStatus('Verifying...')
    await tx.wait()
    setStatus('Followed!')
  }

  return (
    <>
      {status && <text color="white" value={status} position={[0, 1.5, 0]} />}
      <box
        color="white"
        size={0.5}
        position={[-0.9, 1, 0]}
        onClick={getHandle}
      />
      <box color="blue" size={0.5} position={[-0.3, 1, 0]} onClick={follow} />
    </>
  )
}
