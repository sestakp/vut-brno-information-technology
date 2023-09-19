import type { Opportunity, Phase, Template, Risk, Employee, Project } from "./types";

export const newEmployeeObj: Employee = {
	name: "",
	email: "",
	role: -1,
	id: null
};

export const newOportObj: Opportunity = {
	id: "",
	message: "",
	priority: "",
	isSolved: false
};

export const newPhaseObj: Phase = {
	id: "",
	name: "",
	startDate: "",
	endDate: "",
	isFinished: false
};

export const newTempRiskObj: Template = {
	id: "",
	name: "",
	description: "",
	category: "",
	cause: "",
	vulnerabilities: [],
	control: "",
	probability: 0,
	impact: 0,
	state: -1
};

export const newRiskObj: Risk = {
	itemId: "",
	phaseId: null,
	ownerId: null,
	createDate: "",
	lastUpdateDate: "",
	id: "",
	name: "",
	description: "",
	category: "",
	cause: "",
	vulnerabilities: [],
	control: "",
	probability: 0,
	impact: 0,
	state: -1,
	riskValue: 0
};

export const newProjectObj: Project = {
	id: "",
	name: "",
	startDate: "",
	endDate: "",
	isFinished: false,
	projectManager: ""
};
