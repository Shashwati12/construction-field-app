import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/projects")({
    beforeLoad: async()=>{
        const res = await fetch("/projects", {
            credentials: "include",
        })
        if(!res.ok){
            throw redirect({to: "/login"})
        }
        const data = await res.json()
        return data.projects
    },
    component: ProjectsPage,
})

function ProjectsPage(){
    const projects = Route.useLoaderData() as {
        id:string
        name:string
        location:string
        status:string
        createdAt:string
    }[]

    return(
        <div>
        <h1>Projects</h1>
        {projects.length === 0 && <p>No projects to see</p>}
        <ul>
            {projects.map(project => (
                <li key={project.id}>
                    <strong>{project.name}</strong> - {project.location} ({project.status})
                </li>
            ))}
        </ul>
        </div>
    )
}