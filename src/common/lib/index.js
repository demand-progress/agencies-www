import { curry, find, path } from 'ramda'

export const VOTE_AGENCIES = ['FDIC', 'FTC', 'SEC']

export const getApiUrl = () => {
  return false && /localhost/.test(window.location.href) ? 'http://localhost:8888/agencies/' : 'http://api.demandprogressaction.org'
}

export const pathsChanged = curry((props, nextProps, arrayOfPaths) => {
  return find(p => {
    const pathArr = typeof p === 'string' ? [p] : p
    return path(pathArr, props) !== path(pathArr, nextProps)
  }, arrayOfPaths)
})