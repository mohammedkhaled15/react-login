import { useEffect } from "react";
import { useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";

const Users = () => {
  const [users, setUsers] = useState()
  const axiosPrivate = useAxiosPrivate()

  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const controller = new AbortController()
    let isMounted = true
    const getUsers = async () => {
      try {
        const response = await axiosPrivate.get("/users", {
          signal: controller.signal
        })
        isMounted && setUsers(response?.data?.users)
      } catch (error) {
        console.log(error)
        navigate("/login", { state: { from: location }, replace: true })
      }
    }

    getUsers()

    return () => {
      isMounted = false
      isMounted && controller.abort() // to adapt to react 18 changes of remounting the components
    }

  }, [])

  return (
    <article>
      <h2>List Of Users</h2>
      {
        users?.length
          ? (
            <ul style={{ listStyleType: "none", marginLeft: "20px" }}>
              {users.map((user, i) => {
                return (
                  <li key={i}>{user}</li>
                )
              })}
            </ul>
          ) : (
            <p>No users to display</p>
          )
      }
    </article>
  )
}

export default Users