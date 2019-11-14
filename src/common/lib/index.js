import { curry, find, path } from 'ramda'
import React from 'react'

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

export const agencySubtitle = agency => {
  return <div className="subtitle">
    <div>
      <div className="label">Established by Statute:</div>
      {agency.statute}
    </div>
    <div>
      <div className="label">Committee of Jurisdiction:</div>
      {agency['senate committee with jurisdiction']}
    </div>
    <div>
      <div className="label">Partisan Balance:</div>
      {agency['political balance required'] === 'Yes' ? 'Required' : 'Not Required'}
    </div>
  </div>
}
