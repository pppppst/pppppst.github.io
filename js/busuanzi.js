// Site integration: retain the existing Busuanzi service and count history.
// A request belongs to one navigation; old JSONP callbacks cannot update a new page.
(() => {
  if (window.pandaBusuanzi) return
  window.pandaBusuanzi = true

  const keys = ['site_pv', 'site_uv', 'page_pv']
  let sequence = 0
  let pending = null

  const display = (data, loading = false) => {
    keys.forEach(key => {
      const element = document.getElementById('busuanzi_value_' + key)
      if (!element) return
      element.title = ''
      if (loading) {
        element.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>'
      } else if (data && Number.isSafeInteger(data[key]) && data[key] >= 0) {
        element.textContent = String(data[key])
      } else {
        element.textContent = '—'
        element.title = '浏览统计暂不可用'
      }
    })
  }

  const cancel = () => {
    sequence++
    if (!pending) return
    clearTimeout(pending.timer)
    pending.script.remove()
    delete window[pending.callbackName]
    pending = null
  }

  const refresh = () => {
    cancel()
    display(null, true)
    const token = sequence
    const pathname = location.pathname
    const callbackName = 'PandaBusuanziCallback_' + token
    const script = document.createElement('script')
    const finish = data => {
      if (token !== sequence || pathname !== location.pathname) return
      cancel()
      display(data)
    }
    window[callbackName] = finish
    script.async = true
    script.referrerPolicy = 'no-referrer-when-downgrade'
    script.src = 'https://busuanzi.ibruce.info/busuanzi?jsonpCallback=' + callbackName
    script.onerror = () => finish(null)
    pending = { script, callbackName, timer: setTimeout(() => finish(null), 10000) }
    document.head.appendChild(script)
  }

  document.addEventListener('pjax:send', cancel)
  document.addEventListener('pjax:complete', refresh)
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', refresh, { once: true })
  else refresh()
})()
