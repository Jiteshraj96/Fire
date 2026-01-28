import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error) {
    // eslint-disable-next-line no-console
    console.error('App crashed:', error)
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      <div className="min-h-full bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-6 ring-1 ring-slate-200">
          <div className="text-lg font-semibold text-slate-900">Something went wrong</div>
          <p className="mt-2 text-sm text-slate-600">
            Check your browser console for details. Common cause: missing Firebase env in <code>.env.local</code>.
          </p>
          <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-800 ring-1 ring-slate-200">
            {String(this.state.error?.message || this.state.error)}
          </div>
          <p className="mt-4 text-sm text-slate-600">
            Fix env, then restart dev server: <code>Ctrl+C</code> → <code>npm run dev</code>
          </p>
        </div>
      </div>
    )
  }
}


