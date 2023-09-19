export const risksValues = new Array(25)
	.fill("Low", 0, 3)
	.fill("Medium", 3, 15)
	.fill("High", 14, 25);
export const riskColors = new Array(25)
	.fill("bg-green-500", 0, 3)
	.fill("bg-yellow-400", 3, 7)
	.fill("bg-orange-400", 7, 14)
	.fill("bg-red-500", 14, 25);

export const impacts: Array<string> = ["Negligible", "Minor", "Moderate", "Major", "Catastrophic"];
export const probabilities: Array<string> = [
	"Rare",
	"Unlikely",
	"Possible",
	"Likely",
	"Almost certain"
];

export const threatCats: Array<string> = [
	"T1 Physical threats",
	"T2 Natural threats",
	"T3 Infrastructure failures",
	"T4 Technical failures",
	"T5 Human actions",
	"T6 Compromise of functions or service",
	"T7 Organizational threats",
	"T8 Acts of contrary to internal rules",
	"T9 Law regulations and standards",
	"T10 Geopolitical threats"
];

export const vulnerCats: Array<string> = [
	"V1 Hardware",
	"V2 Software",
	"V3 Network",
	"V4 Personnel",
	"V5 Site",
	"V6 Organization",
	"V7 Supplier"
];

export const states: Array<string> = ["Concept", "Active", "Closed", "Discarded"];

export enum Roles {
	SUPERMANAGER,
	PROJECTMANAGER,
	ADMIN
}
export const roles: Array<string> = ["Super manager", "Project manager", "Admin"];

export const oporPrios: Array<string> = ["Low", "Normal", "High"];
