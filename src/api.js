const url = 'https://api.coincap.io/v2'

const getAssets = async () => {
  try {
    const response = await fetch(`${url}/assets?limit=30`)
    const { data } = await response.json()
    return data
  } catch (error) {
    console.error(`¡Ocurrió un error con el API!: ${error}`)
  }
}

const getAsset = async (coin) => {
  try {
    const response = await fetch(`${url}/assets/${coin}`)
    const { data } = await response.json()
    return data
  } catch (error) {
    console.error(`¡Ocurrió un error en la cripto detail!: ${error}`)
    // $router.push('404')
  }
}

const getAssetHistory = async (coin) => {
  const now = new Date()
  const end = now.getTime()
  now.setDate(now.getDate() - 1)
  const start = now.getTime()
  try {
    return fetch(
      `${url}/assets/${coin}/history?interval=h1&start=${start}&end=${end}`
    )
      .then((res) => res.json())
      .then((res) => res.data)
  } catch (e) {
    console.error(`Hubo un error en la Historia: ${e}`)
  }
}

const getMarkets = async (coin) => {
  try {
    let res = await fetch(`${url}/assets/${coin}/markets?limit=5`)
    res = await res.json()
    return res.data
  } catch (error) {
    console.log(`Error in get markets ${error}`)
  }
}

const getExchanges = async (id) => {
  try {
    let res = await fetch(`${url}/exchanges/${id}`)
    res = await res.json()
    return res.data
  } catch (e) {
    console(`Error in getExchanges: ${e}`)
  }
}

export default {
  getAssets,
  getAsset,
  getAssetHistory,
  getMarkets,
  getExchanges,
}
