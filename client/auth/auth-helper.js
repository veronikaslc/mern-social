import { signout } from './api-auth.js'

const auth = {
  isAuthenticated() {
    if (typeof window == "undefined") {
      return false
    }

    const auth = sessionStorage.getItem('jwt')
    if (!auth) {
      return false
    }

    return JSON.parse(sessionStorage.getItem('jwt'))
  },
  isAuthorized(){
    if (typeof window == "undefined") {
      return false
    }

    const auth = sessionStorage.getItem('jwt')
    if (!auth) {
      return false
    }
    const authJson = JSON.parse(auth)
    // if admin did not authorise new user to make changes to the data
    return authJson.user?.approved
  },
  isAdmin() {
    if (typeof window == "undefined") {
      return false
    }

    const auth = sessionStorage.getItem('jwt')
    if (!auth) {
      return false
    }

    const authJson = JSON.parse(auth)
    return authJson.user?.name == "admin"
  },
  authenticate(jwt, cb) {
    if (typeof window !== "undefined") {
      sessionStorage.setItem('jwt', JSON.stringify(jwt))
    }
    cb()
  },
  clearJWT(cb) {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem('jwt')
    }
    cb()
    //optional
    signout().then((data) => {
      document.cookie = "t=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    })
  }
}

export default auth
