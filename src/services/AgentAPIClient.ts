const API_BASE_URL = 'http://localhost:3001';

export class AgentAPIClient {
    static async registerAgent(id: string, name: string, capabilities: string[]) {
        try {
            const response = await fetch(`${API_BASE_URL}/agents`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, name, capabilities }),
            });
            return await response.json();
        } catch (error) {
            console.error('Error registering agent:', error);
            throw error;
        }
    }

    static async getAllAgents() {
        try {
            const response = await fetch(`${API_BASE_URL}/agents`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching agents:', error);
            throw error;
        }
    }

    static async assignTask(agentId: string, taskId: string, taskDetails: any) {
        try {
            const response = await fetch(`${API_BASE_URL}/agents/${agentId}/tasks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ taskId, taskDetails }),
            });
            return await response.json();
        } catch (error) {
            console.error('Error assigning task:', error);
            throw error;
        }
    }

    static async getAgentTasks(agentId: string) {
        try {
            const response = await fetch(`${API_BASE_URL}/agents/${agentId}/tasks`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching agent tasks:', error);
            throw error;
        }
    }
}
