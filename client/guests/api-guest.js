const create = async (params, credentials, guest) => {
  try {
    let response = await fetch('/api/guests', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      },
      body: JSON.stringify(guest)
    })
    return await response.json()
  } catch(err) {
    console.log(err)
  }
}

const read = async (params, credentials, signal) => {
  try {
    let response = await fetch('/api/guests/' + params.id, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      }
  })
    return await response.json()
  } catch(err) {
    console.log(err)
  }
}

const list = async (credentials, signal) => {
  try {
    let response = await fetch('/api/guests', {
      method: 'GET',
      signal: signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      }
    })
    return await response.json()
  } catch(err) {
    console.log(err)
  }
}

const update = async (params, credentials, guest) => {
  try {
    let response = await fetch('/api/guests/' + params.id, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      },
      body: JSON.stringify(guest)
    })
    return await response.json()
  } catch(err) {
    console.log(err)
  }
}

const remove = async (params, credentials) => {
  try {
    let response = await fetch('/api/guests/' + params.id, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      }
    })
    return await response.json()
  } catch(err) {
    console.log(err)
  }
}

export default {
  read,
  create,
  list,
  update,
  remove
}
