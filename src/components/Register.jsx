// import react required hooks
import { useState, useEffect, useRef } from "react"

//import react icons
import { FaInfoCircle } from "react-icons/fa"
import { AiOutlineCheck } from "react-icons/ai"
import { ImCross } from "react-icons/im"

//import axios
import axios from "./../api/axios"
import { Link } from "react-router-dom"

// declaring required regex variables
const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/

const REGISTER_URL = "/register"



const Register = () => {

  const userRef = useRef() // for autofocus on username input
  const errRef = useRef() // for focus on err msg for read accessability

  const [user, setUser] = useState("") // save user input
  const [validName, setValidName] = useState(false) // check if name correct
  const [userFocus, setUserFocus] = useState(false) // set focus on user or not 

  const [pwd, setPwd] = useState("") // save password input
  const [validPwd, setValidPwd] = useState(false) // check if pwd correct
  const [pwdFocus, setPwdFocus] = useState(false) // set focus on pwd input

  const [matchPwd, setMatchPwd] = useState("") // save matchpwd input
  const [validMatch, setValidMatch] = useState(false) // check validity of match
  const [matchFocus, setMatchFocus] = useState(false) // set focus on input 

  const [errMsg, setErrMsg] = useState("") // save err message if there
  const [success, setSuccess] = useState(false)// set success  if everything is ok

  useEffect(() => {
    userRef.current.focus() // adding focus on user input
  }, [])

  useEffect(() => {
    const res = USER_REGEX.test(user) // test user input against user regex
    // console.log(res)
    // console.log(user)
    setValidName(res) // set validity of user name
  }, [user])

  useEffect(() => {
    const res = PWD_REGEX.test(pwd) // test pwd input against pwd regex
    // console.log(res)
    // console.log(pwd)
    setValidPwd(res)
    const match = pwd === matchPwd // set match variable to bloean value if both coincide or not
    setValidMatch(match) // set the bloean value of match or not 
  }, [pwd, matchPwd])

  useEffect(() => {
    setErrMsg("") // clear err message when user start to change any of form input
  }, [user, pwd, matchPwd])

  const handleSubmit = async (e) => {
    e.preventDefault()
    // followed lines to precheck if someone sign up without enable sign up button (hack)
    const v1 = USER_REGEX.test(user)
    const v2 = PWD_REGEX.test(pwd)
    if (!v1 || !v2) {
      setErrMsg("invaild Entry")
      return
    }
    try {
      await axios.post(REGISTER_URL,
        JSON.stringify({ user, pwd }),
        {
          headers: { 'Content-Type': "application/json" },
          withCredentials: true
        })
      setSuccess(true)
    }
    catch (err) {
      if (!err?.response) {
        setErrMsg("No server response")
      } else if (err.response.status === 404) {
        setErrMsg("Server Not Found")
      } else if (err.response.status === 409) {
        setErrMsg("Username Already Taken")
      } else if (err.response.status === 500) {
        setErrMsg("Internal Server Error")
      } else {
        setErrMsg("Registration Failed")
      }
      errRef.current.focus()
    }
  }

  return (
    <>
      {success ? (
        <section>
          <h1>Success!</h1>
          <p>
            <Link to={"/login"}>Sign In</Link>
          </p>
        </section>
      ) : (
        < section >

          <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live={"assertive"} >{errMsg}</p>

          <h1>Register</h1>

          <form onSubmit={handleSubmit}>

            <label htmlFor="username">
              Username:
              <span className={validName ? "valid" : "hide"}>
                <AiOutlineCheck />
              </span>
              <span className={validName || !user ? "hide" : "invalid"}>
                <ImCross />
              </span>
            </label>
            <input
              type="text"
              id="username"
              ref={userRef}
              maxLength="23"
              autoComplete="off"
              onChange={e => setUser(e.target.value)}
              required
              aria-invalid={validName ? "false" : "true"}
              aria-describedby="uidnote"
              onFocus={() => setUserFocus(true)}
              onBlur={() => setUserFocus(false)}
            />
            <p id="uidnote" className={userFocus && user && !validName ? "instructions" : "offscreen"}>
              <FaInfoCircle /> 4 to 24 characters <br /> Must begin with a letter <br />letters,numbers, underscores, hyphens are allowed
            </p>

            <label htmlFor="password">
              Password:
              <span className={validPwd ? "valid" : "hide"}>
                <AiOutlineCheck />
              </span>
              <span className={validPwd || !pwd ? "hide" : "invalid"}>
                <ImCross />
              </span>
            </label>
            <input
              type="password"
              id="password"
              maxLength="24"
              onChange={e => setPwd(e.target.value)}
              required
              aria-invalid={validPwd ? "false" : "true"}
              aria-describedby="pwdnote"
              onFocus={() => setPwdFocus(true)}
              onBlur={() => setPwdFocus(false)}
            />
            <p id="pwdnote" className={pwdFocus && pwd && !validPwd ? "instructions" : "offscreen"}>
              <FaInfoCircle /> 8 to 24 characters <br /> Must include uppercase and lowercase letters, a number and specal character. <br />
              Allowed special character: <span aria-label="exlamination mark">!</span><span aria-label="at symbol">@</span><span aria-label="dollar sign">$</span><span aria-label="percent mark ">%</span>
            </p>

            <label htmlFor=" confirm_pwd">
              Confirm Password:
              <span className={validMatch && matchPwd ? "valid" : "hide"}>
                <AiOutlineCheck />
              </span>
              <span className={validMatch || !matchPwd ? "hide" : "invalid"}>
                <ImCross />
              </span>
            </label>
            <input
              type="password"
              id="confirm_pwd"
              maxLength="24"
              onChange={e => setMatchPwd(e.target.value)}
              required
              aria-invalid={validMatch ? "false" : "true"}
              aria-describedby="confirmnote"
              onFocus={() => setMatchFocus(true)}
              onBlur={() => setMatchFocus(false)}
            />
            <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
              <FaInfoCircle /> Must match the entered password
            </p>

            <button disabled={!validName || !validPwd || !validMatch ? true : false}>Sign Up</button>

          </form>
          <p>
            Already registered?<br />
            <span className="line">
              <Link to={"/login"}>Sign In</Link>
            </span>
          </p>
        </section>
      )

      }
    </>
  )
}

export default Register