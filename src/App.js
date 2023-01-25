import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

// Components
import Navigation from './components/Navigation'
import Section from './components/Section'
import Product from './components/Product'

// ABIs
import Dappazon from './abis/Dappazon.json'

// Config
import config from './config.json'

function App() {
  const [provider, setProvider] = useState(null)
  const [dappazon, setDappazon] = useState(null)

  const [account, setAccount] = useState(null)

  const [queens, setQueens] = useState(null)
  const [single, setSingle] = useState(null)
  const [executives, setExecutives] = useState(null)

  const [item, setItem] = useState({})
  const [toggle, setToggle] = useState(false)

  const togglePop = (item) => {
    setItem(item)
    toggle ? setToggle(false) : setToggle(true)
  }

  const loadBlockchainData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)
    const network = await provider.getNetwork()

    const dappazon = new ethers.Contract(config[network.chainId].dappazon.address, Dappazon, provider)
    setDappazon(dappazon)

    const items = []
    console.log(items);

    for (var i = 0; i < 9; i++) {
      const item = await dappazon.items(i + 1)
      items.push(item)
    }

    const queens = items.filter((item) => item.category === 'queens')
    const single = items.filter((item) => item.category === 'single')
    const executives = items.filter((item) => item.category === 'executives')

    setQueens(queens)
    setSingle(single)
    setExecutives(executives)
  }

  useEffect(() => {
    loadBlockchainData()
  }, [])

  return (
    <div>
      <Navigation account={account} setAccount={setAccount} />


      <h2>Best Rooms </h2>

      {queens && single && executives && (
        <>
          <Section title={"Single Rooms"} items={single} togglePop={togglePop} />
          <Section title={"Queens Suite"} items={queens} togglePop={togglePop} />
          <Section title={"Executive Rooms"} items={executives} togglePop={togglePop} />
        </>
      )}

      {toggle && (
        <Product item={item} provider={provider} account={account} dappazon={dappazon} togglePop={togglePop} />
      )}

    </div>
  );
}

export default App;