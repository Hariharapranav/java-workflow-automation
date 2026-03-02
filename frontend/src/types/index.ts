export type Role = 'ADMIN' | 'MANAGER' | 'EMPLOYEE';

export interface User {
    id: number;
    name: string;
    email: string;
    role: Role;
}

export interface WorkflowStep {
    id?: number;
    name: string;
    stepIndex: number;
    requiredRole: Role;
}

export interface Workflow {
    id: number;
    name: string;
    description: string;
    steps: WorkflowStep[];
}

export type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface WorkflowRequest {
    id: number;
    workflow: Workflow;
    requesterId: number;
    requesterName: string;
    status: RequestStatus;
    currentStepIndex: number;
    payloadJson: string;
    createdAt: string;
    updatedAt: string;
}

export interface RequestApproval {
    id: number;
    requestId: number;
    stepId: number;
    approverId: number;
    approverName: string;
    status: ApprovalStatus;
    comments: string;
    createdAt: string;
}
