export interface Candidate {
    id: number,
    name: string,
    email: string,
    department: {
        deptName: string,
        contact: string,
        contactEmail: string,
    },
}