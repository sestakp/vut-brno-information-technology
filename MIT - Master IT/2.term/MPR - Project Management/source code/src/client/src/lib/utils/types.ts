export interface Employee {
	id: string | null;
	name: string;
	email: string;
	role: number;
}

export interface Template {
	id: string;
	name: string;
	description: string;
	category: string;
	cause: string;
	vulnerabilities: Array<string>;
	control: string;
	probability: number;
	impact: number;
	state: number;
}

export interface Risk extends Template {
	itemId: string;
	phaseId: string | null;
	ownerId: string | null;
	riskValue: number;
	createDate: string;
	lastUpdateDate: string;
}

export interface Opportunity {
	id: string;
	message: string;
	priority: string;
	isSolved: boolean;
}

export interface Project {
	id: string;
	name: string;
	startDate: string;
	endDate: string;
	isFinished: boolean;
	projectManager: string;
}

export interface Phase {
	id: string;
	name: string;
	startDate: string;
	endDate: string;
	isFinished: boolean;
}
