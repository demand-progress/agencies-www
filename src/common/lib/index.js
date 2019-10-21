export const getApiUrl = () => {
  return /localhost/.test(window.location.href) ? 'http://localhost:8888/agencies/' : ''
}
