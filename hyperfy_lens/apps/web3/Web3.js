import React, { useMemo, useState } from 'react'
import { useEth } from 'hyperfy'

// Lens 
const CONTRACT = '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270'

export function Web3() {
  const eth = useEth("polygon")
  const contract = useMemo(() => eth.contract(CONTRACT))
  // eth.contract(CONTRACT, ['function getHandle(uint256 profileId) external view override'])
  const [status, setStatus] = useState(null)
  async function getHandle(e) {
    // check to see if the user is logged in
    const { address } = e.avatar
    // if there's no address, notify them via <text />
    if (!address) return setStatus('Not connected!')
    setStatus('Checking...')
    const handle = await contract.read('balanceOf', '0x8115AfD8DFfCE5579381AD27524b6Feeae917BEF')
    setStatus(`Handle: ${handle}`)
    console.log(handle)
  }

  async function follow(e) {
    const { address } = e.avatar
    if (!address) return setStatus('Not connected!')
    setStatus('Please confirm transaction')
    // follow user example
    const tx = await contract.write('transfer', "0x74DBb201ecc0B16934e68377BC13013883D9417b", '1')
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
