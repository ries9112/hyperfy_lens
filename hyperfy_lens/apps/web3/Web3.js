import React, { useMemo, useState } from 'react'
import { useEth } from 'hyperfy'

// Lens 
const CONTRACT = '0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d'

export function Web3() {
  const eth = useEth("polygon")
  console.log(eth.contract(CONTRACT))
  //const contract = useMemo(() => eth.contract(CONTRACT))
  const contract = useMemo(() => eth.contract(CONTRACT, ['function setProfileImageURI(uint256 profileId, string imageURI) external override notPartialPaused', 'function balanceOf(address owner) external view override']))
  
  // NOTE JUNE 13: got setProfileImageURI to work! Confirmed working great! The read function of balanceOf on the other hand doesn't seem to work
  
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
    const tx = await contract.write('setProfileImageURI', '66252', 'https://ik.imagekit.io/lens/media-snapshot/tr:w-300,h-300/f21aeb4295c37bc9e370d40f14bf4cdb47337d79fd743e5dba6e3d40bac78d68.png')
    setStatus('Verifying...')
    await tx.wait()
    setStatus('Changed Profile Picture!')
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
