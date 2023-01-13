import axios from "../api/axios"
import { useState, useEffect, useRef } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import useAuth from "../hooks/useAuth"
const LOGIN_URL = "/auth"

const Login = () => {
  const { setAuth } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || "/"
  const userRef = useRef()
  const errRef = useRef()

  const [user, setUser] = useState("")
  const [pwd, setPwd] = useState("")
  const [errMsg, setErrMsg] = useState("")

  useEffect(() => {
    userRef.current.focus()
  }, [])

  useEffect(() => {
    setErrMsg("")
  }, [user, pwd])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(LOGIN_URL,
        JSON.stringify({ user, pwd }),
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true
        })
      console.log(response?.data?.accessToken, response?.data?.roles)
      const accessToken = response?.data?.accessToken
      const roles = response?.data?.roles
      setAuth({ user, pwd, roles, accessToken })
      setUser("")
      setPwd("")
      navigate(from, { replace: true })
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No server response")
      } else {
        setErrMsg(err?.response?.data?.message)
      }
      errRef.current.focus()
    }
  }

  return (
    <section>
      <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          ref={userRef}
          autoComplete="off"
          onChange={(e) => setUser(e.target.value)}
          value={user}
          required
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          onChange={(e) => setPwd(e.target.value)}
          value={pwd}
          required
        />
        <button>Sign In</button>
      </form>
      <p>
        Need an Account? <br />
        <span className="line">
          <Link to={"/register"}>Sign Up</Link>
        </span>
      </p>
    </section>
  )
}

export default Login