const SERVER_ID = '973993789280620585';
        
function countOnline(members) {
    return members.filter(m => m.status && m.status !== 'offline').length;
}

fetch(`https://discord.com/api/guilds/${SERVER_ID}/widget.json`)
    .then(response => {
        if (!response.ok) throw new Error('Ошибка загрузки данных');
        return response.json();
    })
    .then(data => {
        if (!data.members) throw new Error('Нет данных об участниках');
        
        const online = countOnline(data.members);
        
        document.getElementById('server-name').textContent = data.name;
        document.getElementById('online-count').textContent = online;
        
        const container = document.getElementById('members-container');
        container.innerHTML = '';
        
        const sorted = [...data.members].sort((a, b) => {
            const order = {online: 1, idle: 2, dnd: 3, offline: 4};
            return (order[a.status] || 4) - (order[b.status] || 4);
        });
        
        sorted.forEach(member => {
            const status = member.status || 'offline';
            container.innerHTML += `
                <div class="member">
                    <img src="${member.avatar_url || 'https://cdn.discordapp.com/embed/avatars/0.png'}" 
                         class="avatar"
                         onerror="this.src='https://cdn.discordapp.com/embed/avatars/0.png'">
                    <span>${member.username}</span>
                    <div class="status ${status}" title="${status}"></div>
                </div>
            `;
        });
    })
    .catch(error => {
        console.error('Ошибка:', error);
        document.getElementById('server-name').textContent = 'Ошибка загрузки';
        document.getElementById('members-container').innerHTML = '';
    });
