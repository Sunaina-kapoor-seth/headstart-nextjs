import { ChangeEvent, FormEvent, FunctionComponent, useCallback, useEffect, useState } from 'react'
import login from '../../redux/ocAuth/login'
import { useOcDispatch, useOcSelector } from '../../redux/ocStore'

interface OcLoginFormProps {
  title?: string
  onLoggedIn: () => void
}

const OcLoginForm: FunctionComponent<OcLoginFormProps> = ({
  title = 'Sign into your account',
  onLoggedIn,
}) => {
  const dispatch = useOcDispatch()

  const { loading, error, isAnonymous } = useOcSelector((s) => ({
    isAnonymous: s.ocAuth.isAnonymous,
    error: s.ocAuth.error,
    loading: s.ocAuth.loading,
  }))

  const [formValues, setFormValues] = useState({
    identifier: '',
    password: '',
    remember: false,
  })

  const handleInputChange = (fieldKey: string) => (e: ChangeEvent<HTMLInputElement>) => {
    setFormValues((v) => ({ ...v, [fieldKey]: e.target.value }))
  }

  const handleCheckboxChange = (fieldKey: string) => (e: ChangeEvent<HTMLInputElement>) => {
    setFormValues((v) => ({ ...v, [fieldKey]: !!e.target.checked }))
  }

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault()
      dispatch(
        login({
          username: formValues.identifier,
          password: formValues.password,
          remember: formValues.remember,
        })
      )
    },
    [formValues, dispatch]
  )

  useEffect(() => {
    if (!isAnonymous) {
      onLoggedIn()
    }
  }, [isAnonymous, onLoggedIn])

  return (
    <form name="ocLoginForm" onSubmit={handleSubmit}>
      <h1>{title}</h1>
      {error && <p>{error.message}</p>}
      <label htmlFor="identifier">
        Username
        <input
          type="text"
          id="identifier"
          name="identifier"
          placeholder="Enter username"
          value={formValues.identifier}
          onChange={handleInputChange('identifier')}
          required
        />
      </label>
      <label htmlFor="password">
        Password
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Enter password"
          value={formValues.password}
          onChange={handleInputChange('password')}
          required
        />
      </label>
      <label htmlFor="remember">
        <input
          type="checkbox"
          id="remember"
          name="remember"
          checked={formValues.remember}
          onChange={handleCheckboxChange('remember')}
        />
        Keep me logged in
      </label>
      <button type="submit">
        Submit
      </button>
    </form>
  )
}

export default OcLoginForm
