export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'teacher' | 'student';
    enrolledCourses?: Course[];
}

export interface Course {
    _id: string;
    title: string;
    description: string;
    materials: CourseMaterial[];
    createdBy: string;
    enrollmentLink: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CourseMaterial {
    type: 'text' | 'document' | 'video';
    content: string;
    title: string;
    order: number;
}

export interface AuthResponse {
    token: string;
    user: User;
} 