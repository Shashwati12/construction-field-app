import { useState } from "react";

export function LoginForm(){
    const [phone, setPhone] = useState("")
    const [password, setPassword] = useState("")
    async function handleSubmit(e:React.FormEvent){
        e.preventDefault()

        try{
            const res = await fetch("/auth/login", {
  method: "POST",
  credentials: "include",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ phone, password }),
})

        if(!res.ok){
            const errorData = await res.json()
            console.error("Lohin error:", errorData)
            return
        }
            const meRes = await fetch("/auth/me", {
  credentials: "include",
})
            if (!meRes.ok) {
  console.log("Not authenticated")
  return
}
            const meData = await meRes.json()
            if (!meData?.user?.role) {
      throw new Error("Invalid user object")
    }
            switch (meData.user.role) {
      case "OWNER":
        window.location.href = "/owner/dashboard"
        break
      case "MANAGER":
        window.location.href = "/manager/dashboard"
        break
      case "ACCOUNTANT":
        window.location.href = "/accountant/dashboard"
        break
      default:
        alert("This role is not allowed on web")
    }

        }
        catch(err){
            console.error("Netwrok or unexpected error:", err)
        }
        
    }
    return(
        <form onSubmit={handleSubmit}>
            <div>
                <label>Phone</label>
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)}/>
            </div>
            <div>
                <label>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            </div>
            <button type="submit">Login</button>
        </form>
    )
}