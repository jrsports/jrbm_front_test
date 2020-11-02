
const UserTokenKey = 'userToken'
const TeamTokenKey = 'teamToken'

export function getUserToken() {
  return localStorage.getItem(UserTokenKey)
}

export function setUserToken(userToken) {
  return localStorage.setItem(UserTokenKey,userToken)
}

export function removeUserToken() {
  return localStorage.removeItem(UserTokenKey);
}

export function getTeamToken() {
  return sessionStorage.getItem(TeamTokenKey)
}

export function setTeamToken(userToken) {
  return sessionStorage.setItem(TeamTokenKey,userToken)
}

export function removeTeamToken() {
  return sessionStorage.removeItem(TeamTokenKey);
}

