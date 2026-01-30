export function projectInviteTemplate(params: {
    projectName:string
    inviterName:string
    inviteLink:string}
):string{
    return `<h2>You've been invited to ${params.projectName}</h2>
    <p>${params.inviterName} invited you to join the project.</p>
    <a hred="${params.inviteLink}">Accept Invitation</a>
    `
}