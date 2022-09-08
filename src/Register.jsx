// import react required hooks
import { useState, useEffect, useRef } from "react"

//import react icons
import { FaInfoCircle } from "react-icons/fa"

// declaring required regex variables
const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/



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
    const [successMsg, setSuccessMsg] = useState("")// set success msg if there

    useEffect(() => {
        userRef.current.focus() // adding focus on user input
    }, [])

    useEffect(() => {
        const res = USER_REGEX.test(user) // test user input against user regex
        console.log(res)
        console.log(user)
        setValidName(res) // set validity of user name
    }, [user])

    useEffect(() => {
        const res = PWD_REGEX.test(pwd) // test pwd input against pwd regex
        console.log(res)
        console.log(pwd)
        setValidPwd(res)
        const match = pwd === matchPwd // set match variable to bloean value if both coincide or not
        setMatchPwd(match) // set the bloean value of match or not 
    }, [pwd, matchPwd])

    useEffect(() => {
        setErrMsg("") // clear err message when user start to change any of form input
    }, [user, pwd, matchPwd])


    return (
        <section>
            <p ref={errRef} className={errMsg ? "errMsg" : "offscreen"} aria-live={"assertive"} >{errMsg}</p>
            <h1>Register</h1>
            <form>
                <label htmlFor="username">
                    Username:
                </label>
                <input
                    type="text"
                    id="username"
                    ref={userRef}
                    maxLength="24"
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
            </form>
        </section>
    )
}

export default Register