import { createFileRoute } from '@tanstack/react-router'
import {useState} from "react"
export const Route = createFileRoute('/register')({
  component: RegisterPage,
})

function RegisterPage() {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")

  async function handleSubmit(e:React.FormEvent){
    e.preventDefault()
    const res=await fetch("/auth/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({ name, phone, password }),
})
    const data = await res.json()
    console.log(data)
    if(res.ok){
      window.location.href="/login"
    }
  }

  return(
    <form onSubmit={handleSubmit}>
      <h1>Register(Owner)</h1>
      <input placeholder="Name" onChange={e => setName(e.target.value)} />
      <input placeholder="Phone" onChange={e => setPhone(e.target.value)} />
      <input placeholder="Password" type="password" onChange={e => setPassword(e.target.value)} />
      <button type='submit'>Register</button>
    </form>
  )
}

