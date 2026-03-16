import type { NextApiRequest, NextApiResponse } from "next";
import rawConnections from "../../utils/data/connections.json";
import rawUsers from "../../utils/data/users.json";
import rawGuilds from "../../utils/data/guilds.json";
import rawTeams from "../../utils/data/teams.json";
import rawNotifications from "../../utils/data/notifications.json";
import type {
	ConnectionsPageStructure,
	GuildPayload,
	TeamPayload,
	NotificationPayload,
	UserStructure,
	ConnectionMetrics,
	AuditLogPayload,
	SubscriptionsPayload,
} from "../../types";

const connections = rawConnections as unknown as ConnectionsPageStructure[];
const users = rawUsers as UserStructure[];
const guilds = rawGuilds as unknown as GuildPayload[];
const teams = rawTeams as unknown as TeamPayload[];
const notifications = rawNotifications as unknown as NotificationPayload[];

const randomUser = users[Math.floor(Math.random() * users.length)];

const ok = (res: NextApiResponse, data: unknown) => res.status(200).json(data);
const notFound = (res: NextApiResponse) =>
	res.status(404).json({ message: "Not found" });

function matchRoute(
	path: string,
	pattern: string,
): Record<string, string> | null {
	const patternParts = pattern.split("/");
	const pathParts = path.split("/");
	if (patternParts.length !== pathParts.length) return null;
	const params: Record<string, string> = {};
	for (let i = 0; i < patternParts.length; i++) {
		if (patternParts[i].startsWith(":")) {
			params[patternParts[i].slice(1)] = pathParts[i];
		} else if (patternParts[i] !== pathParts[i]) {
			return null;
		}
	}
	return params;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	const { slug } = req.query;
	const path = "/" + (Array.isArray(slug) ? slug.join("/") : slug ?? "");
	const method = req.method ?? "GET";

	if (path === "/auth/user") return ok(res, randomUser);

	if (path === "/users/@me/guilds" && method === "GET") return ok(res, guilds);

	if (path === "/users/@me/connections" && method === "GET") {
		const userConns = connections.filter((c) => c.creator.id === randomUser.id);
		return ok(res, userConns.length > 0 ? userConns : connections.slice(0, 2));
	}

	if (path === "/users/@me/connections/random" && method === "GET")
		return ok(res, connections[Math.floor(Math.random() * connections.length)]);

	if (path === "/users/@me/teams" && method === "GET") {
		const userTeams = teams.filter((t) =>
			t.members.some((m) => m.id === randomUser.id),
		);
		return ok(res, userTeams.length > 0 ? userTeams : teams.slice(0, 1));
	}

	if (path === "/users/@me/inbox" && method === "GET")
		return ok(res, notifications);
	if (path === "/users/@me/inbox/bulk-delete" && method === "POST")
		return ok(res, { deleted: true });
	if (path === "/users/@me/subscriptions" && method === "GET")
		return ok(res, { guilds: [], connections: [] } as SubscriptionsPayload);
	if (path === "/users/@me/connections" && method === "PUT")
		return ok(res, { created: true });
	if (path === "/users/@me/teams" && method === "POST")
		return ok(res, { id: "team_new", ...req.body });

	if (path === "/connections" && method === "GET") {
		const { tag, query, sort, start_at, end_at } = req.query;
		let result = [...connections];
		if (tag && typeof tag === "string")
			result = result.filter((c) =>
				c.tags.some((t) => t.toLowerCase().includes(tag.toLowerCase())),
			);
		if (query && typeof query === "string")
			result = result.filter((c) =>
				c.name.toLowerCase().includes(query.toLowerCase()),
			);
		if (sort === "votes")
			result = result.sort(
				(a, b) =>
					b.votes.reduce((n, v) => n + v.count, 0) -
					a.votes.reduce((n, v) => n + v.count, 0),
			);
		else if (sort === "newest")
			result = result.sort((a, b) => b.createdTimestamp - a.createdTimestamp);
		return ok(res, result.slice(Number(start_at) || 0, Number(end_at) || 18));
	}

	const connById = matchRoute(path, "/connections/:id");
	if (connById) {
		if (method === "GET") {
			const conn = connections.find(
				(c) => c.name === connById.id || c._id === connById.id,
			);
			return conn ? ok(res, conn) : notFound(res);
		}
		if (method === "PATCH" || method === "DELETE")
			return ok(res, { success: true });
	}

	const connRecommended = matchRoute(path, "/connections/:name/recommended");
	if (connRecommended && method === "GET")
		return ok(
			res,
			connections.filter((c) => c.name !== connRecommended.name).slice(0, 4),
		);

	const connMetrics = matchRoute(path, "/connections/:name/metrics");
	if (connMetrics && method === "GET")
		return ok(res, {
			views: Array.from({ length: 7 }, () => Math.floor(Math.random() * 500)),
			servers: Array.from({ length: 7 }, () => Math.floor(Math.random() * 100)),
			feedbacks: Array.from({ length: 7 }, () =>
				Math.floor(Math.random() * 50),
			),
		} as ConnectionMetrics);

	const connAudit = matchRoute(path, "/connections/:id/audit-logs");
	if (connAudit && method === "GET")
		return ok(res, { entries: [] } as AuditLogPayload);

	const connVotes = matchRoute(path, "/connections/:name/votes");
	if (connVotes && method === "POST") return ok(res, { voted: true });

	const connInvite = matchRoute(path, "/connections/:name/invite");
	if (connInvite && method === "PUT")
		return ok(res, { hashInvite: "mock-invite-hash" });

	const guildById = matchRoute(path, "/guilds/:id");
	if (guildById) {
		if (method === "GET") {
			const guild = guilds.find((g) => g.id === guildById.id) ?? guilds[0];
			return ok(res, guild);
		}
		if (method === "PATCH") return ok(res, { updated: true });
	}

	const guildChannels = matchRoute(path, "/guilds/:id/channels");
	if (guildChannels && method === "GET")
		return ok(res, [
			{ id: "ch_001", name: "general", position: 0, nsfw: false },
			{ id: "ch_002", name: "dev-chat", position: 1, nsfw: false },
			{ id: "ch_003", name: "gaming", position: 2, nsfw: false },
		]);

	const guildMembers = matchRoute(path, "/guilds/:id/members");
	if (guildMembers && method === "GET")
		return ok(
			res,
			users.map((u) => ({ user: { ...u, bot: false } })),
		);

	const guildConns = matchRoute(path, "/guilds/:id/connections");
	if (guildConns && method === "PUT") return ok(res, { connected: true });

	const guildConn = matchRoute(path, "/guilds/:guildId/connections/:name");
	if (guildConn) {
		if (method === "GET") {
			const guild = guilds.find((g) => g.id === guildConn.guildId) ?? guilds[0];
			const conn =
				guild.connections.find((c) => c.name === guildConn.name) ??
				guild.connections[0];
			return conn ? ok(res, conn) : notFound(res);
		}
		if (method === "PATCH" || method === "DELETE")
			return ok(res, { success: true });
	}

	const guildCase = matchRoute(path, "/guilds/:id/cases/:caseId");
	if (guildCase && method === "GET") {
		const guild = guilds.find((g) => g.id === guildCase.id) ?? guilds[0];
		const cas =
			guild.cases.find((c) => c.id === guildCase.caseId) ?? guild.cases[0];
		return cas ? ok(res, cas) : notFound(res);
	}

	const teamById = matchRoute(path, "/teams/:id");
	if (teamById) {
		if (method === "GET") {
			const team = teams.find((t) => t.id === teamById.id) ?? teams[0];
			return ok(res, team);
		}
		if (method === "DELETE") return ok(res, { deleted: true });
	}

	const teamJoin = matchRoute(path, "/teams/:id/join");
	if (teamJoin && method === "PUT") return ok(res, { joined: true });

	const teamMembers = matchRoute(path, "/teams/:teamID/members");
	if (teamMembers) {
		if (method === "PUT") return ok(res, { added: true });
		if (method === "DELETE") return ok(res, { removed: true });
	}

	const teamOwner = matchRoute(path, "/teams/:teamID/owner");
	if (teamOwner && method === "PUT") return ok(res, { transferred: true });

	const teamAudit = matchRoute(path, "/teams/:teamId/connections/audit-logs");
	if (teamAudit && method === "GET") {
		const team = teams.find((t) => t.id === teamAudit.teamId) ?? teams[0];
		const logs = (team.children ?? []).map((child: any) => ({
			_id: child.name,
			entries: [],
		}));
		return ok(res, logs);
	}

	const teamConn = matchRoute(path, "/teams/:teamID/connections/:name");
	if (teamConn) {
		if (method === "PUT") return ok(res, { added: true });
		if (method === "DELETE") return ok(res, { removed: true });
	}

	if (path.startsWith("/codes/")) return ok(res, { success: true });

	return res
		.status(404)
		.json({ message: `Route not found: ${method} ${path}` });
}
