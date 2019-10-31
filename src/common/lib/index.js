export const getApiUrl = () => {
  return false && /localhost/.test(window.location.href) ? 'http://localhost:8888/agencies/' : 'http://api.demandprogressaction.org'
}
