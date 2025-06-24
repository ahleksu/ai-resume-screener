export interface JobDescription {
    id?: string;
    title: string;
    company: string;
    description: string;
    requirements: string[];
    skills: string[];
    experience: string;
    location?: string;
    salary?: string;
    createdAt?: Date;
}
