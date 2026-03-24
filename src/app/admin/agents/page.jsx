import { getAgents } from './actions';
import AgentsAdminClient from './AgentsAdminClient';

export default async function AgentsAdminPage() {
    const agents = await getAgents();
    return <AgentsAdminClient initialAgents={agents} />;
}
