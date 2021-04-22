const create = async (params, credentials, event) => {
  try {
    let response = await fetch('/api/events/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      },
      body: JSON.stringify(event)
    })
    return await response.json()
  } catch(err) {
    console.log(err)
  }
}

const read = async (params, credentials, signal) => {
  try {
    let response = await fetch('/api/events/' + params.id, {
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
    let response = await fetch('/api/events', {
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

const listByUser = async (params, credentials) => {
  try {
    let response = await fetch('/api/events/byUser/'+ params.id, {
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

const listByGuest = async (params, credentials) => {
  try {
    let response = await fetch('/api/events/withGuest/'+ params.id, {
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

const remove = async (params, credentials) => {
  try {
    let response = await fetch('/api/events/' + params.id, {
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

const removeGuest = async (params, credentials, guestObj) => {
  try {
    let response = await fetch('/api/events/removeGuest/' + params.id, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      },
      body: JSON.stringify(guestObj)
    })
    return await response.json()
  } catch(err) {
    console.log(err)
  }
}

const update = async (params, credentials, event) => {
  try {
    let response = await fetch('/api/events/' + params.id, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      },
      body: JSON.stringify(event)
    })
    return await response.json()
  } catch(err) {
    console.log(err)
  }
}


export default {
  read,
  update,
  list,
  listByUser,
  listByGuest,
  create,
  remove,
  removeGuest
}
