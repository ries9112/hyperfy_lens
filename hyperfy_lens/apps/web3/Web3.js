import React, { useMemo, useState } from 'react'
import { useEth } from 'hyperfy'

// Lens 
const CONTRACT = '0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d'

export function Web3() {
  const eth = useEth("polygon")
  console.log(eth.contract(CONTRACT))
  //const contract = useMemo(() => eth.contract(CONTRACT))
  const contract = useMemo(() => eth.contract(CONTRACT, ['function setProfileImageURI(uint256 profileId, string imageURI) external override notPartialPaused', 'function collect(uint256 profileId, uint256 pubId, bytes data) external override notPartialPaused']))
  
  // NOTE JUNE 13: got setProfileImageURI to work! Confirmed working great! The read function of balanceOf on the other hand doesn't seem to work. Good news is I can read data from GraphQL (better anyway!), so I only really need the write smart contract interactions working.
  
  // was also able to get a collect example working which is great! However not yet sure about how to derive the data field (which I manually grabbed from polygonscan). Paid collects have a data field, while it's empty for free collects. However free collect didn't work because it didn't like the blank field. But passing the same as I did for paid collect actually did work!
  
  const [status, setStatus] = useState(null)
  async function collect(e) {
    // check to see if the user is logged in
    const { address } = e.avatar
    // if there's no address, notify them via <text />
    if (!address) return setStatus('Not connected!')
    setStatus('Checking...')
    const handle = await contract.write('collect', '101876', '292', '0x0000000000000000000000000d500b1d8e8ef31e21c99d1db9a6444d3adf127000000000000000000000000000000000000000000000000029a2241af62c0000')
    setStatus(`Handle: ${handle}`)
    console.log(handle)
  }

  async function setProfileImageURI(e) {
    const { address } = e.avatar
    if (!address) return setStatus('Not connected!')
    setStatus('Please confirm transaction')
    // setProfileImageURI user example
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
        onClick={collect}
      />
      <box color="blue" size={0.5} position={[-0.3, 1, 0]} onClick={setProfileImageURI} />
    </>
  )
}
