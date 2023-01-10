export interface Candidate {
    id: number,
    name: string,
    email: string,
    department: Department,
}

export interface Department {
    id?: number,
    deptName: string,
    contact: string,
    contactEmail: string,
}