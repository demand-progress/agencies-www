import { length, pipe, pluck, lift, filter, curry, find, path } from 'ramda'
import React from 'react'
import { parse } from 'qs'

export const VOTE_AGENCIES = ['FDIC', 'FTC', 'SEC']

export const getApiUrl = () => {
  return false && /localhost/.test(window.location.href) ? 'http://localhost:8888/agencies/' : '//api.demandprogressaction.org'
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
const filterUnexpiredMembers = status => filter(m => (m['term status'] || '').toLowerCase() === status)

export const agenciesWithStatus = status => {
  return pipe(
    pluck('members'),
    lift(filterUnexpiredMembers(status))
  )
}

export const filterAgencies = (agencies = [], search) => {
  const parsedSearch = parse(search.replace('?', ''))
  return agencies.filter(a => {
    let ok = true
    if (parsedSearch.s) {
      const regex = new RegExp(parsedSearch.s, 'i')
      if (!regex.test(a.agency) && !regex.test(a.abbreviation)) {
        ok = false
      }
    }
    if (parsedSearch.tracker && ok && !VOTE_AGENCIES.includes(a.abbreviation)) {
      ok = false
    }
    if (parsedSearch.noQuorum && ok && a['currently enough for quorum'] !== 'No') {
      ok = false
    }
    if (parsedSearch.expireds && ok) {
      const expiredCount = length(filterUnexpiredMembers('expired')(a.members))
      if (expiredCount !== parseInt(parsedSearch.expireds, 10)) {
        ok = false
      }
    }
    if (parsedSearch.vacant && ok) {
      const vc = length(filterUnexpiredMembers('vacant')(a.members))
      if (vc !== parseInt(parsedSearch.vacant, 10)) {
        ok = false
      }
    }
    if (parsedSearch.committee && ok && a['senate committee with jurisdiction'] !== parsedSearch.committee) {
      ok = false
    }
    return ok
  })
}