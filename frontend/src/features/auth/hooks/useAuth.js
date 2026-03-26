import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context.jsx";
import { login ,register,logout,getMe} from "../services/auth.api"

export const useAuth = ()=>{
    const context = useContext(AuthContext)

    const { user, setUser, loading, setLoading } = context

     const handleLogin = async ({ email, password }) => {
        setLoading(true)
        try {
            const data = await login({ email, password })
            if (data?.user) {
                setUser(data.user)
            } else {
                console.error("No user data returned from login")
            }
        } catch (err) {
            const errorMsg = err?.response?.data?.message || err?.message || "Login failed. Please check your connection and try again."
            console.error("Login error:", errorMsg);
            alert(errorMsg)
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true)
        try {
            const data = await register({ username, email, password })
            if (data?.user) {
                setUser(data.user)
            } else {
                console.error("No user data returned from register")
            }
        } catch (err) {
            const errorMsg = err?.response?.data?.message || err?.message || "Registration failed. Please check your connection and try again."
            console.error("Register error:", errorMsg);
            alert(errorMsg)
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        setLoading(true)
        try {
            await logout()
            setUser(null)
        } catch (err) {
            const errorMsg = err?.response?.data?.message || err?.message || "Logout failed"
            console.error("Logout error:", errorMsg);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {

        const getAndSetUser = async () => {
            try {
                const data = await getMe()
                if (data?.user) {
                    setUser(data.user)
                }
            } catch (err) { 
                console.warn("User not authenticated or backend unavailable", err?.message);
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        getAndSetUser()

    }, [])

    return { user, loading, handleRegister, handleLogin, handleLogout }
}
