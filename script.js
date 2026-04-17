// Dashboard JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {

    checkRegistration();

    setupRegistrationForm();

    setupUserLogout();

    initializeChart();

    setupNavigation();

    setupRealTimeUpdates();

    setupActionButtons();

});



// Setup user logout functionality

function setupUserLogout() {

    const logoutBtn = document.getElementById('userLogoutBtn');

    

    if (logoutBtn) {

        logoutBtn.addEventListener('click', function() {

            userLogout();

        });

    }

}



// User logout function

function userLogout() {

    if (confirm('Möchtest du dich wirklich ausloggen? Du musst dich erneut registrieren.')) {

        // Remove registration data

        localStorage.removeItem('userRegistered');

        localStorage.removeItem('userRegistration');

        

        showNotification('Erfolgreich ausgeloggt!', 'success');

        

        // Reload page to show registration overlay

        setTimeout(() => {

            location.reload();

        }, 1000);

    }

}



// Check if user is registered

async function checkRegistration() {

    const registrationOverlay = document.getElementById('registrationOverlay');

    const dashboardContent = document.getElementById('dashboardContent');

    const logoutBtn = document.getElementById('userLogoutBtn');



    const stored = JSON.parse(localStorage.getItem('userRegistration') || '{}');

    let isRegistered = false;



    if (stored.name && stored.nachname) {

        try {

            const res = await fetch(`/check-member?name=${encodeURIComponent(stored.name)}&nachname=${encodeURIComponent(stored.nachname)}`);

            const data = await res.json();

            isRegistered = data.exists;

        } catch (e) {

            // Server nicht erreichbar, localStorage als Fallback

            isRegistered = localStorage.getItem('userRegistered') === 'true';

        }

    }



    if (!isRegistered) {

        localStorage.removeItem('userRegistered');

        localStorage.removeItem('userRegistration');

    }



    if (isRegistered) {

        registrationOverlay.classList.add('hidden');

        dashboardContent.classList.add('registered');

        if (logoutBtn) logoutBtn.style.display = 'block';

    } else {

        registrationOverlay.classList.remove('hidden');

        dashboardContent.classList.remove('registered');

        if (logoutBtn) logoutBtn.style.display = 'none';

    }

}



// Setup registration form

function setupRegistrationForm() {

    const form = document.getElementById('registrationForm');

    const messageDiv = document.getElementById('registrationMessage');

    

    form.addEventListener('submit', function(e) {

        e.preventDefault();

        

        const name = document.getElementById('regName').value.trim();

        const nachname = document.getElementById('regNachname').value.trim();

        const id = document.getElementById('regId').value.trim();

        const email = document.getElementById('regEmail').value.trim();

        const password = document.getElementById('regPassword').value.trim();

        

        // Clear previous messages

        messageDiv.innerHTML = '';

        messageDiv.className = '';

        

        // Validate inputs

        if (!name || !nachname || !id || !email || !password) {

            messageDiv.innerHTML = '<div class="registration-error">Bitte alle Felder ausfüllen!</div>';

            return;

        }

        

        if (name.length < 2 || nachname.length < 2) {

            messageDiv.innerHTML = '<div class="registration-error">Name und Nachname müssen mindestens 2 Zeichen lang sein!</div>';

            return;

        }

        

        if (id.length < 3) {

            messageDiv.innerHTML = '<div class="registration-error">ID muss mindestens 3 Zeichen lang sein!</div>';

            return;

        }

        

        if (email.indexOf('@') === -1 || email.length < 5) {

            messageDiv.innerHTML = '<div class="registration-error">Bitte gib eine gültige Email-Adresse ein!</div>';

            return;

        }

        

        if (password.length < 4) {

            messageDiv.innerHTML = '<div class="registration-error">Passwort muss mindestens 4 Zeichen lang sein!</div>';

            return;

        }

        

        // Save registration data

        const registrationData = {

            name: name,

            nachname: nachname,

            email: email,

            id: id,

            registrationDate: new Date().toISOString(),

            fullName: `${name} ${nachname}`

        };

        

        localStorage.setItem('userRegistration', JSON.stringify(registrationData));

        localStorage.setItem('userRegistered', 'true');

        

        // Save to MongoDB

        saveMemberToMongoDB(name, nachname, id, email, password);

        

        // Show success message

        messageDiv.innerHTML = '<div class="registration-success">Registrierung erfolgreich! Willkommen bei Black Oath.</div>';

        

        // Add to member list

        const memberList = loadMemberList();

        if (!memberList.some(m => m.name === registrationData.fullName)) {

            memberList.push({ name: registrationData.fullName });

            saveMemberList(memberList);

        }

        

        // Redirect to dashboard after short delay

        setTimeout(() => {

            checkRegistration();

        }, 1500);

    });

}



// Save member data to text file

async function saveMemberToFile(name, nachname, id, email, password) {

    const timestamp = new Date().toLocaleString('de-DE', { 

        day: '2-digit', 

        month: '2-digit', 

        year: 'numeric', 

        hour: '2-digit', 

        minute: '2-digit', 

        second: '2-digit' 

    });

    

    const memberData = JSON.stringify({ name, nachname, email, id, password });

    

    try {

        // Save via server endpoint

        const response = await fetch('/save-member', {

            method: 'POST',

            headers: {

                'Content-Type': 'application/json',

            },

            body: memberData

        });

        

        if (response.ok) {

            console.log('Mitgliedsdaten erfolgreich in Datei gespeichert');

            return true;

        } else {

            console.error('Fehler beim Speichern der Mitgliedsdaten');

            return false;

        }

    } catch (error) {

        console.error('Server nicht erreichbar:', error);

        return false;

    }

}

function initializeChart() {

    const ctx = document.getElementById('revenueChart');

    if (!ctx) return;



    // Chart deactivated - no data display

    return;

}



// Setup navigation functionality

function setupNavigation() {

    const navItems = document.querySelectorAll('.nav-item');

    

    navItems.forEach(item => {

        item.addEventListener('click', function() {

            // Remove active class from all items

            navItems.forEach(nav => nav.classList.remove('active'));

            // Add active class to clicked item

            this.classList.add('active');

            

            // Here you could add page switching logic

            const pageName = this.textContent.toLowerCase();

            console.log(`Navigation zur ${pageName}-Seite`);

            handleNavigation(pageName);

        });

    });

}



// Setup real-time updates simulation

function setupRealTimeUpdates() {

    // Periodically verify registration status so a deleted member file forces re-registration.

    setInterval(() => {

        checkRegistration();

    }, 3000);

}



// Aktualisieren Sie die Statistiken mit zufälligen Änderungen

function updateStats() {

    // Function deactivated - no more number updates

    return;

}



// Add new activity to the feed

function addNewActivity() {

    const activities = [

        { icon: '🔔', text: 'Neue Benutzerregistrierung festgestellt' },

        { icon: '💰', text: 'Zahlung verarbeitet' },

        { icon: '📊', text: 'Wochenbericht erfolgreich erstellt' },

        { icon: '⚠️', text: 'Serverlast über Schwellenwert' },

        { icon: '✅', text: 'System-Backup abgeschlossen' },

        { icon: '🚀', text: 'Neue Funktion erfolgreich bereitgestellt' },

        { icon: '📈', text: 'Traffic-Zunahme festgestellt' },

        { icon: '🔒', text: 'Sicherheits-Scan abgeschlossen' }

    ];

    

    const randomActivity = activities[Math.floor(Math.random() * activities.length)];

    const timestamp = new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });

    

    // Store activity in localStorage to persist across page changes

    const savedActivities = JSON.parse(localStorage.getItem('activities') || '[]');

    savedActivities.unshift({

        icon: randomActivity.icon,

        text: randomActivity.text,

        time: timestamp

    });

    

    // Keep only the latest 20 activities

    if (savedActivities.length > 20) {

        savedActivities.splice(20);

    }

    

    localStorage.setItem('activities', JSON.stringify(savedActivities));

    

    // Try to add to current activity list if it exists

    const activityList = document.querySelector('.activity-list');

    if (activityList) {

        addActivityItem(activityList);

    }

}



// Update activity time stamps

function updateActivityTimes() {

    const activities = JSON.parse(localStorage.getItem('activities') || '[]');

    const activityItems = document.querySelectorAll('.activity-item');

    const times = ['Gerade eben', 'Vor 1 Minute', 'Vor 2 Minuten', 'Vor 5 Minuten', 'Vor 15 Minuten', 'Vor 30 Minuten', 'Vor 1 Stunde', 'Vor 2 Stunden', 'Vor 3 Stunden'];

    

    activityItems.forEach((item, index) => {

        const timeElement = item.querySelector('.activity-time');

        if (timeElement && index < times.length) {

            timeElement.textContent = times[index];

        }

    });

    

    // Update localStorage with new time stamps

    activities.forEach((activity, index) => {

        if (index < times.length) {

            activity.time = times[index];

        }

    });

    localStorage.setItem('activities', JSON.stringify(activities));

}



// Setup action button functionality

function setupActionButtons() {

    const actionButtons = document.querySelectorAll('.action-btn');

    

    actionButtons.forEach(button => {

        button.addEventListener('click', function() {

            const action = this.textContent.trim();

            handleAction(action);

        });

    });

}



// Handle different actions

function handleAction(action) {

    switch(action) {

        case 'Bericht erstellen':

            generateReport();

            break;

        case 'Daten exportieren':

            exportData();

            break;

        case 'Benutzerverwaltung':

            openUserManagement();

            break;

        case 'Systemeinstellungen':

            openSettings();

            break;

        default:

            console.log(`Unbekannte Aktion: ${action}`);

    }

}



// Handle navigation clicks

async function handleNavigation(pageName) {

    switch(pageName) {

        case 'mitglieder':

            await showMitglieder();

            break;

        case 'dashboard':

            showDashboard();

            break;

        case 'analytik':

            showAnalytik();

            break;

        case 'admin':

            showEinstellungen(); // Admin page with password

            break;

        case 'verträge':

            showVertraege();

            break;

        default:

            console.log(`Unbekannte Seite: ${pageName}`);

    }

}



// Add role to member

function addRole(button) {

    const roleInput = button.previousElementSibling;

    const roleText = button.textContent;

    const mitgliedInfo = button.closest('.mitglied-info');

    

    // Remove input container and add role

    const roleContainer = button.closest('.role-input-container');

    roleContainer.remove();

    

    // Add role display

    const roleDisplay = document.createElement('p');

    roleDisplay.className = 'mitglied-role';

    roleDisplay.textContent = roleText;

    mitgliedInfo.appendChild(roleDisplay);

    

    // Save role to localStorage

    saveMemberRole('Bryan Cooper', roleText);

    

    showNotification(`Rolle "${roleText}" wurde gespeichert!`, 'success');

}



// Save member role to localStorage

function saveMemberRole(memberName, role) {

    const members = JSON.parse(localStorage.getItem('mitglieder') || '{}');

    members[memberName] = role;

    localStorage.setItem('mitglieder', JSON.stringify(members));

    

    // Update role in member file on server

    const parts = memberName.trim().split(' ');

    const name = parts[0] || '';

    const nachname = parts.slice(1).join(' ') || '';

    

    fetch('/update-role', {

        method: 'POST',

        headers: { 'Content-Type': 'application/json' },

        body: JSON.stringify({ name, nachname, role })

    }).then(response => {

        if (response.ok) {

            console.log('Rolle erfolgreich in Datei aktualisiert');

        } else {

            console.error('Fehler beim Aktualisieren der Rolle in Datei');

        }

    }).catch(error => {

        console.error('Server nicht erreichbar für Rollen-Update:', error);

    });

}



// Load saved member roles

async function loadSavedRoles() {

    const memberList = loadMemberList();

    const roles = {};

    

    for (const member of memberList) {

        const memberName = member.name;

        const parts = memberName.trim().split(' ');

        const name = parts[0] || '';

        const nachname = parts.slice(1).join(' ') || '';

        

        try {

            const response = await fetch(`/get-role?name=${encodeURIComponent(name)}&nachname=${encodeURIComponent(nachname)}`);

            if (response.ok) {

                const data = await response.json();

                roles[memberName] = data.role;

            } else {

                roles[memberName] = 'Member';

            }

        } catch (error) {

            console.error('Error loading role for', memberName, error);

            roles[memberName] = 'Member';

        }

    }

    

    return roles;

}



// Load saved member list

function loadMemberList() {

    const members = JSON.parse(localStorage.getItem('memberList') || '[]');

    return members;

}



// Save member list

function saveMemberList(members) {

    localStorage.setItem('memberList', JSON.stringify(members));

}



// Check admin access

function checkAdminAccess() {

    const password = localStorage.getItem('adminPassword');

    return !!password; // Accept any password as admin login for admin page access

}



async function getCurrentUserRole() {

    const stored = JSON.parse(localStorage.getItem('userRegistration') || '{}');

    const fullName = stored.fullName || `${stored.name || ''} ${stored.nachname || ''}`.trim();

    const roles = await loadSavedRoles();

    return roles[fullName] || '';

}



async function isLeaderOrCoLeader() {

    const role = await getCurrentUserRole();

    return role === 'Leader' || role === 'CoLeader';

}



async function canManageMembers() {

    return checkAdminAccess() || await isLeaderOrCoLeader();

}



// Save registration to text file

async function saveRegistrationToFile(firstname, lastname, password) {

    const registrationData = `Registration: ${firstname} ${lastname} - Password: ${password}\n`;

    

    try {

        // Use fetch to save to server-side file

        const response = await fetch('/save-password', {

            method: 'POST',

            headers: {

                'Content-Type': 'text/plain',

            },

            body: registrationData

        });

        

        if (response.ok) {

            showNotification('Registrierung wurde in Password.txt gespeichert!', 'success');

        } else {

            // Fallback to download if server save fails

            downloadPasswordFile(registrationData);

        }

    } catch (error) {

        // Fallback to download if fetch fails

        downloadPasswordFile(registrationData);

    }

}



// Fallback download function

function downloadPasswordFile(data) {

    const blob = new Blob([data], { type: 'text/plain' });

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');

    a.href = url;

    a.download = 'Password.txt';

    a.click();

    window.URL.revokeObjectURL(url);

    

    showNotification('Registrierung wurde heruntergeladen (Server nicht erreichbar)!', 'info');

}



// Login to admin

function adminLogin() {

    const firstnameInput = document.getElementById('register-firstname');

    const lastnameInput = document.getElementById('register-lastname');

    const passwordInput = document.getElementById('register-password') || document.getElementById('login-password') || document.getElementById('admin-password');

    const password = passwordInput.value.trim();

    

    // Allow any password for registration

    if (password) {

        localStorage.setItem('adminPassword', password);

        

        // Save registration to file

        if (firstnameInput && lastnameInput) {

            const firstname = firstnameInput.value.trim();

            const lastname = lastnameInput.value.trim();

            const fullName = `${firstname} ${lastname}`;

            

            if (fullName.trim() !== ' ') {

                localStorage.setItem('adminName', fullName.trim());

                

                // Add member with "One for All" role

                const memberList = loadMemberList();

                if (!memberList.some(m => m.name === fullName.trim())) {

                    memberList.push({ name: fullName.trim() });

                    saveMemberList(memberList);

                }

                

                // Save role as "One for All"

                saveMemberRole(fullName.trim(), 'One for All');

                

                // Save to text file

                saveRegistrationToFile(firstname, lastname, password);

            }

        }

        

        showNotification('Erfolgreich als Admin registriert!', 'success');

        passwordInput.value = '';

        

        // Clear name inputs

        if (firstnameInput) firstnameInput.value = '';

        if (lastnameInput) lastnameInput.value = '';

        

        // Determine which page to refresh

        if (document.getElementById('register-password')) {

            showRegister();

        } else if (document.getElementById('login-password')) {

            showLogin();

        } else {

            showEinstellungen();

        }

    } else {

        showNotification('Bitte gib ein Passwort ein!', 'error');

        passwordInput.value = '';

    }

}



// Logout from admin

function adminLogout() {

    localStorage.removeItem('adminPassword');

    showNotification('Erfolgreich ausgeloggt!', 'success');

    showEinstellungen(); // Refresh admin page

}



// Delete member

async function deleteMember(memberName) {

    if (!(await canManageMembers())) {

        showNotification('Nur Leader, CoLeader oder Admins können Mitglieder löschen!', 'error');

        return;

    }

    

    if (confirm(`Möchtest du "${memberName}" wirklich löschen?`)) {

        // Remove from member list

        const memberList = loadMemberList();

        const updatedList = memberList.filter(m => m.name !== memberName);

        saveMemberList(updatedList);

        

        // Remove member data

        const memberData = loadMemberData();

        delete memberData[memberName];

        localStorage.setItem('memberData', JSON.stringify(memberData));

        

        // Delete text file on server

        const parts = memberName.trim().split(' ');

        const name = parts[0] || '';

        const nachname = parts.slice(1).join(' ') || '';

        fetch('/delete-member', {

            method: 'POST',

            headers: { 'Content-Type': 'application/json' },

            body: JSON.stringify({ name, nachname })

        });



        // Wenn der gelöschte Nutzer der aktuell eingeloggte ist → ausloggen

        const currentUser = JSON.parse(localStorage.getItem('userRegistration') || '{}');

        if (currentUser.name === name && currentUser.nachname === nachname) {

            localStorage.removeItem('userRegistered');

            localStorage.removeItem('userRegistration');

            showNotification(`Mitglied "${memberName}" wurde gelöscht!`, 'success');

            setTimeout(() => location.reload(), 1000);

            return;

        }

        

        showNotification(`Mitglied "${memberName}" wurde gelöscht!`, 'success');

        showMitglieder(); // Refresh the page

    }

}



// Add new member

async function addNewMember() {

    if (!(await canManageMembers())) {

        showNotification('Nur Leader, CoLeader oder Admins können Mitglieder hinzufügen!', 'error');

        return;

    }

    

    const nameInput = document.getElementById('new-member-name');

    const memberName = nameInput.value.trim();

    

    if (!memberName) {

        showNotification('Bitte gib einen Namen ein!', 'error');

        return;

    }

    

    const memberList = loadMemberList();

    if (memberList.some(m => m.name === memberName)) {

        showNotification('Mitglied existiert bereits!', 'error');

        return;

    }

    

    memberList.push({ name: memberName });

    saveMemberList(memberList);

    saveMemberRole(memberName, 'Member');

    

    nameInput.value = '';

    showMitglieder(); // Refresh the page

    showNotification(`Mitglied "${memberName}" wurde hinzugefügt!`, 'success');

}



// Load saved member data

function loadMemberData() {

    const members = JSON.parse(localStorage.getItem('memberData') || '{}');

    return members;

}



// Save member data

function saveMemberData(memberName, data) {

    const members = loadMemberData();

    members[memberName] = data;

    localStorage.setItem('memberData', JSON.stringify(members));

}



// Clear all members

async function clearAllMembers() {

    localStorage.removeItem('memberList');

    localStorage.removeItem('mitglieder');

    localStorage.removeItem('memberData');

    showNotification('Alle Mitglieder wurden gelöscht!', 'success');

    await showMitglieder(); // Refresh the page

}



// Show members page with saved roles

async function showMitglieder() {

    const mainContent = document.querySelector('.dashboard-main');

    const savedRoles = await loadSavedRoles();

    const memberList = loadMemberList();

    const memberData = loadMemberData();

    const isAdmin = checkAdminAccess();

    const canManage = await canManageMembers();

    

    let membersHTML = '';

    

    memberList.forEach(member => {

        const memberName = member.name;

        const currentRole = savedRoles[memberName];

        const userData = memberData[memberName] || {};

        const canAddBadge = currentRole === 'Leader' || currentRole === 'CoLeader' ? `<span class="permission-badge">Kann hinzufügen</span>` : '';

        

        membersHTML += `

            <div class="mitglied-item">

                <div class="mitglied-avatar">${userData.gender === 'female' ? '👩' : userData.gender === 'male' ? '👨' : '👤'}</div>

                <div class="mitglied-info">

                    <h3>${memberName}</h3>

                    <div class="role-display-container">

                        <p class="mitglied-role">${currentRole || 'Member'}</p>

                        <div class="member-details">

                            ${userData.gender ? `<span class="gender-badge">${userData.gender === 'female' ? 'Frau' : 'Mann'}</span>` : ''}

                            ${canAddBadge}

                        </div>

                        ${isAdmin ? `<button class="change-role-btn" onclick="changeRole('${memberName}')">Rolle ändern</button>` : ''}

                    </div>

                </div>

                ${canManage ? `<button class="delete-member-btn" onclick="deleteMember('${memberName}')">🗑️</button>` : ''}

            </div>

        `;

    });

    

    mainContent.innerHTML = `

        <div class="mitglieder-container">

            <h1 class="page-title">Mitglieder</h1>

            

            ${!canManage ? `

            <div class="access-denied">

                <p>⚠️ Nur Leader, CoLeader oder Admins können Mitglieder hinzufügen oder löschen</p>

            </div>` : ''

            }

            

            <!-- Add new member section -->

            ${canManage ? `

            <div class="add-member-section">

                <div class="add-member-form">

                    <input type="text" id="new-member-name" class="member-input" placeholder="Name eingeben...">

                    <button class="add-member-btn" onclick="addNewMember()">+</button>

                </div>

            </div>` : ''

            }

            

            <div class="mitglieder-list">

                ${membersHTML}

            </div>

        </div>

    `;

    

    // Re-setup navigation after content change

    setupNavigation();

}



// Edit member gender

async function editGender(memberName) {

    if (!checkAdminAccess()) {

        showNotification('Nur Admins können Geschlecht ändern!', 'error');

        return;

    }

    

    const gender = prompt(`Geschlecht für ${memberName} ändern:\n1 für Mann, 2 für Frau`);

    

    if (gender === '1') {

        saveMemberData(memberName, { ...loadMemberData()[memberName], gender: 'male' });

        showNotification(`${memberName} ist jetzt ein Mann`, 'success');

    } else if (gender === '2') {

        saveMemberData(memberName, { ...loadMemberData()[memberName], gender: 'female' });

        showNotification(`${memberName} ist jetzt eine Frau`, 'success');

    } else {

        showNotification('Ungültige Eingabe', 'error');

        return;

    }

    

    await showMitglieder(); // Refresh the page

}



// Toggle member permission to add others

async function togglePermission(memberName) {

    if (!checkAdminAccess()) {

        showNotification('Nur Admins können Berechtigungen ändern!', 'error');

        return;

    }

    

    const currentData = loadMemberData()[memberName] || {};

    const newPermission = !currentData.canAdd;

    

    saveMemberData(memberName, { ...currentData, canAdd: newPermission });

    

    if (newPermission) {

        showNotification(`${memberName} kann jetzt Mitglieder hinzufügen`, 'success');

    } else {

        showNotification(`${memberName} kann keine Mitglieder mehr hinzufügen`, 'success');

    }

    

    await showMitglieder(); // Refresh the page

}



// Add role to member

function addRole(button, memberName) {

    if (!checkAdminAccess()) {

        showNotification('Nur Admins können Rollen zuweisen!', 'error');

        return;

    }

    

    const roleText = button.textContent;

    const mitgliedInfo = button.closest('.mitglied-info');

    

    // Remove input container and add role

    const roleContainer = button.closest('.role-input-container');

    roleContainer.remove();

    

    // Add role display

    const roleDisplay = document.createElement('div');

    roleDisplay.className = 'role-display-container';

    roleDisplay.innerHTML = `

        <p class="mitglied-role">${roleText}</p>

        <button class="change-role-btn" onclick="changeRole('${memberName}')">Rolle ändern</button>

    `;

    mitgliedInfo.appendChild(roleDisplay);

    

    // Save role to localStorage

    saveMemberRole(memberName, roleText);

    

    showNotification(`Rolle "${roleText}" für ${memberName} wurde gespeichert!`, 'success');

}



// Save member role to localStorage

function saveMemberRole(memberName, role) {

    const members = JSON.parse(localStorage.getItem('mitglieder') || '{}');

    members[memberName] = role;

    localStorage.setItem('mitglieder', JSON.stringify(members));

    

    // Update role in member file on server

    const parts = memberName.trim().split(' ');

    const name = parts[0] || '';

    const nachname = parts.slice(1).join(' ') || '';

    

    fetch('/update-role', {

        method: 'POST',

        headers: { 'Content-Type': 'application/json' },

        body: JSON.stringify({ name, nachname, role })

    }).then(response => {

        if (response.ok) {

            console.log('Rolle erfolgreich in Datei aktualisiert');

        } else {

            console.error('Fehler beim Aktualisieren der Rolle in Datei');

        }

    }).catch(error => {

        console.error('Server nicht erreichbar für Rollen-Update:', error);

    });

}



// Change role function

function changeRole(memberName) {

    if (!checkAdminAccess()) {

        showNotification('Nur Admins können Rollen ändern!', 'error');

        return;

    }

    

    // Find the specific member's info container

    const mitgliedItems = document.querySelectorAll('.mitglied-item');

    let targetMitgliedInfo = null;

    

    mitgliedItems.forEach(item => {

        const nameElement = item.querySelector('h3');

        if (nameElement && nameElement.textContent === memberName) {

            targetMitgliedInfo = item.querySelector('.mitglied-info');

        }

    });

    

    if (!targetMitgliedInfo) return;

    

    // Remove current role display and show role selection again

    const roleDisplay = targetMitgliedInfo.querySelector('.role-display-container');

    

    if (roleDisplay) {

        roleDisplay.remove();

    }

    

    // Add role input container

    const roleInputContainer = document.createElement('div');

    roleInputContainer.className = 'role-input-container';

    roleInputContainer.innerHTML = `

        <input type="text" class="role-input" placeholder="Rolle eingeben...">

        <div class="role-buttons">

            <button class="add-role-btn" onclick="addRole(this, '${memberName}')">Leader</button>

            <button class="add-role-btn" onclick="addRole(this, '${memberName}')">CoLeader</button>

            <button class="add-role-btn" onclick="addRole(this, '${memberName}')">Member</button>

            <button class="add-role-btn" onclick="addRole(this, '${memberName}')">Hund</button>

        </div>

    `;

    

    targetMitgliedInfo.appendChild(roleInputContainer);

}



// Show dashboard page

function showDashboard() {

    const mainContent = document.querySelector('.dashboard-main');

    mainContent.innerHTML = `

        <div class="dashboard-grid">

            <!-- Stats Cards -->

            <section class="stats-section">

                <div class="stat-card">

                    <div class="stat-icon">📊</div>

                    <div class="stat-content">

                        <h3>Gesamteinnahmen</h3>

                        <p class="stat-value"></p>

                        <span class="stat-change"></span>

                    </div>

                </div>

                <div class="stat-card">

                    <div class="stat-icon">👥</div>

                    <div class="stat-content">

                        <h3>Aktive Benutzer</h3>

                        <p class="stat-value"></p>

                        <span class="stat-change"></span>

                    </div>

                </div>

                <div class="stat-card">

                    <div class="stat-icon">📈</div>

                    <div class="stat-content">

                        <h3>Wachstumsrate</h3>

                        <p class="stat-value"></p>

                        <span class="stat-change"></span>

                    </div>

                </div>

                <div class="stat-card">

                    <div class="stat-icon">⚡</div>

                    <div class="stat-content">

                        <h3>Leistung</h3>

                        <p class="stat-value"></p>

                        <span class="stat-change"></span>

                    </div>

                </div>

            </section>



            <!-- Chart Section -->

            <section class="chart-section">

                <div class="chart-container">

                    <h2>Umsatzübersicht</h2>

                    <div class="chart-placeholder">

                        <canvas id="revenueChart"></canvas>

                    </div>

                </div>

            </section>



            <!-- Activity Feed -->

            <section class="activity-section">

                <div class="activity-card">

                    <h2>Aktuelle Aktivität</h2>

                    <div class="activity-list">

                    </div>

                </div>

            </section>

        </div>

    `;

    

    // Load activities from localStorage

    loadActivities();

    

    // Re-setup navigation after content change

    setupNavigation();

}



// Load activities from localStorage

function loadActivities() {

    const activityList = document.querySelector('.activity-list');

    if (activityList) {

        addActivityItem(activityList);

    }

}



// Show contracts page

function showVertraege() {

    const mainContent = document.querySelector('.dashboard-main');



    // Flag mit tatsächlichen Aktivitäten synchronisieren

    const activities = JSON.parse(localStorage.getItem('activities') || '[]');

    const vertragAktiv = activities.some(a => a.text && a.text.includes('Metallurgie I'));

    if (!vertragAktiv) localStorage.removeItem('vertrag_metallurgie');

    const isAdded = vertragAktiv;



    const isAdmin = checkAdminAccess();

    const memberList = loadMemberList();

    const assignment = JSON.parse(localStorage.getItem('vertrag_assign_metallurgie') || '{}');

    const assignedMembers = assignment.members || [];

    const assignedNote = assignment.note || '';



    const stueckData = JSON.parse(localStorage.getItem('stueck_members_metallurgie') || '{}');



    const membersHTML = memberList.map(m => `

        <label class="vertrag-member-label">

            <input type="checkbox" value="${m.name}" ${assignedMembers.includes(m.name) ? 'checked' : ''}> ${m.name}

        </label>

    `).join('');



    const assignedDisplay = assignedMembers.length > 0 ? `

        <div class="vertrag-assigned">

            ${assignedMembers.map(m => `

                <span class="vertrag-assigned-tag">

                    ${m}

                    ${isAdmin ? `<button class="vertrag-member-delete" onclick="deleteVertragMember('metallurgie','${m}')">×</button>` : ''}

                </span>`).join('')}

            ${assignedNote ? `<p class="vertrag-assigned-note">${assignedNote}</p>` : ''}

        </div>` : '';



    const aktuellStueck = parseInt(localStorage.getItem('stueck_metallurgie') || 0);



    mainContent.innerHTML = `

        <div class="vertraege-container">

            <h1 class="page-title">Verträge</h1>

            <div class="vertraege-section">

                <div class="vertraege-row-wrapper">

                    <div class="vertraege-item">

                        <div class="vertraege-header">

                            <h3>Metallurgie I</h3>

                            <div class="vertraege-actions">

                                <button class="vertraege-plus-btn" onclick="addVertrag()" ${isAdded ? 'disabled style="opacity:0.4;cursor:not-allowed;"' : ''}>+</button>

                                <button class="vertraege-assign-btn" onclick="toggleAssignPanel('metallurgie')" ${!isAdded ? 'disabled style="opacity:0.4;cursor:not-allowed;"' : ''}>+</button>

                            </div>

                        </div>

                        <div class="stueck-tracker">

                            <span class="stueck-label">Abzugeben: <strong>${aktuellStueck} / 840 Stück</strong></span>

                            <div class="stueck-progress-bar">

                                <div class="stueck-progress-fill" style="width:${Math.min((aktuellStueck/840)*100,100)}%"></div>

                            </div>

                        </div>



                        <div class="vertrag-assign-panel" id="assign-metallurgie" style="display:none;">

                            <div class="vertrag-members-list">

                                ${membersHTML || '<p style="color:var(--text-secondary)">Keine Mitglieder vorhanden</p>'}

                            </div>

                            <button class="vertrag-save-btn" onclick="saveVertragAssignment('metallurgie')">Speichern</button>

                        </div>

                    </div>

                    ${assignedMembers.length > 0 ? `

                    <div class="vertrag-assigned-sidebar">

                        ${assignedMembers.map(m => `

                            <div class="vertrag-member-stueck-row">

                                <span class="vertrag-assigned-tag">

                                    ${m}

                                    ${isAdmin ? `<button class="vertrag-member-delete" onclick="deleteVertragMember('metallurgie','${m}')">×</button>` : ''}

                                </span>

                                <div class="member-stueck-input-row">

                                    <input type="number" class="member-stueck-input" placeholder="Stück" min="0"

                                        value="${stueckData[m] || 0}"

                                        onchange="updateMemberStueck('metallurgie', '${m}', this.value, 840)">

                                    <span class="member-stueck-total">/ 840</span>

                                </div>

                            </div>`).join('')}

                        ${assignedNote ? `<p class="vertrag-assigned-note">${assignedNote}</p>` : ''}

                    </div>` : ''}

                </div>

            </div>

        </div>

    `;

    

    // Re-setup navigation after content change

    setupNavigation();

}



function updateMemberStueck(id, memberName, wert, ziel) {

    const data = JSON.parse(localStorage.getItem(`stueck_members_${id}`) || '{}');

    data[memberName] = parseInt(wert) || 0;

    localStorage.setItem(`stueck_members_${id}`, JSON.stringify(data));



    // Gesamtsumme berechnen

    const gesamt = Object.values(data).reduce((a, b) => a + b, 0);

    localStorage.setItem(`stueck_${id}`, gesamt);



    if (gesamt >= ziel) {

        // Textdatei auf Server speichern

        const assignment = JSON.parse(localStorage.getItem(`vertrag_assign_${id}`) || '{}');

        fetch('/save-vertrag', {

            method: 'POST',

            headers: { 'Content-Type': 'application/json' },

            body: JSON.stringify({

                vertragsname: 'Metallurgie I',

                material: 'Eisenerz',

                ziel: ziel,

                mitglieder: assignment.members || [],

                stueckData: data

            })

        });



        // Vertrag abgeschlossen

        localStorage.removeItem(`stueck_members_${id}`);

        localStorage.setItem(`stueck_${id}`, 0);

        localStorage.removeItem(`vertrag_assign_${id}`);

        const activities = JSON.parse(localStorage.getItem('activities') || '[]');

        localStorage.setItem('activities', JSON.stringify(activities.filter(a => !a.text || !a.text.includes('Metallurgie I'))));

        localStorage.removeItem('vertrag_metallurgie');

        showNotification('Vertrag abgeschlossen! 840 Stück erreicht.', 'success');

    }

    showVertraege();

}



function deleteVertragMember(id, memberName) {

    const assignment = JSON.parse(localStorage.getItem(`vertrag_assign_${id}`) || '{}');

    assignment.members = (assignment.members || []).filter(m => m !== memberName);

    localStorage.setItem(`vertrag_assign_${id}`, JSON.stringify(assignment));

    showNotification(`${memberName} entfernt!`, 'success');

    showVertraege();

}



function toggleAssignPanel(id) {

    const panel = document.getElementById(`assign-${id}`);

    if (panel) panel.style.display = panel.style.display === 'none' ? 'block' : 'none';

}



function saveVertragAssignment(id) {

    const panel = document.getElementById(`assign-${id}`);

    const selected = [...panel.querySelectorAll('input[type=checkbox]:checked')].map(c => c.value);



    if (selected.length === 0) {

        showNotification('Bitte mindestens ein Mitglied auswählen!', 'error');

        return;

    }



    const data = JSON.parse(localStorage.getItem(`vertrag_assign_${id}`) || '{}');

    data.members = selected;

    localStorage.setItem(`vertrag_assign_${id}`, JSON.stringify(data));



    showNotification('Gespeichert!', 'success');

    showVertraege();

}



function addStueck(id, ziel) {

    const input = document.getElementById('stueck-add');

    const hinzu = parseInt(input.value) || 0;

    if (hinzu <= 0) { showNotification('Bitte eine gültige Anzahl eingeben!', 'error'); return; }



    const aktuell = parseInt(localStorage.getItem(`stueck_${id}`) || 0);

    const neu = aktuell + hinzu;

    localStorage.setItem(`stueck_${id}`, neu);



    if (neu >= ziel) {

        // Vertrag abgeschlossen

        localStorage.setItem(`stueck_${id}`, 0);

        const activities = JSON.parse(localStorage.getItem('activities') || '[]');

        const updated = activities.filter(a => !a.text || !a.text.includes('Metallurgie I'));

        localStorage.setItem('activities', JSON.stringify(updated));

        localStorage.removeItem('vertrag_metallurgie');

        showNotification('🎉 Vertrag abgeschlossen! 840 Stück erreicht.', 'success');

    } else {

        showNotification(`${neu} / ${ziel} Stück abgegeben.`, 'success');

    }

    showVertraege();

}



// Add contract function

function addVertrag() {

    const added = localStorage.getItem('vertrag_metallurgie') === 'true';

    if (added) {

        showNotification('Vertrag wurde bereits hinzugefügt!', 'error');

        return;

    }



    localStorage.setItem('vertrag_metallurgie', 'true');

    addVertragInternal();



    showNotification('Vertrag hinzugefügt!', 'success');

    showVertraege();

}



function addVertragInternal() {

    const timestamp = new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });

    

    // Store activity in localStorage to persist across page changes

    const activities = JSON.parse(localStorage.getItem('activities') || '[]');

    activities.unshift({

        icon: '📄',

        text: 'Vertrag "Metallurgie I" hinzugefügt',

        time: timestamp

    });

    localStorage.setItem('activities', JSON.stringify(activities));

    

    // Try to add to current activity list if it exists

    const activityList = document.querySelector('.activity-list');

    console.log('activityList found:', activityList); // Debug

    

    if (activityList) {

        addActivityItem(activityList);

    }

}



function addActivityItem(activityList) {

    const activities = JSON.parse(localStorage.getItem('activities') || '[]');

    

    // Clear current list and rebuild from localStorage

    activityList.innerHTML = '';

    

    activities.forEach((activity, index) => {

        const newActivity = document.createElement('div');

        newActivity.className = 'activity-item';

        newActivity.innerHTML = `

            <div class="activity-icon">${activity.icon}</div>

            <div class="activity-content">

                <p class="activity-text">${activity.text}</p>

                <span class="activity-time">${activity.time}</span>

            </div>

            ${activity.text.includes('Vertrag') ? `

                <button class="activity-delete-btn" data-index="${index}">×</button>

            ` : ''}

        `;

        activityList.appendChild(newActivity);

        

        // Add event listener to delete button

        const deleteBtn = newActivity.querySelector('.activity-delete-btn');

        if (deleteBtn) {

            deleteBtn.addEventListener('click', (e) => {

                e.stopPropagation();

                const indexToDelete = parseInt(deleteBtn.getAttribute('data-index'));

                console.log('Delete button clicked, index:', indexToDelete); // Debug

                deleteActivity(indexToDelete);

            });

        }

    });

}



// Delete activity function

function deleteActivity(index) {

    const activities = JSON.parse(localStorage.getItem('activities') || '[]');

    const deletedActivity = activities[index];

    activities.splice(index, 1);

    localStorage.setItem('activities', JSON.stringify(activities));



    // Vertrag-Flag zurücksetzen wenn Vertrag-Aktivität gelöscht

    if (deletedActivity && deletedActivity.text && deletedActivity.text.includes('Metallurgie I')) {

        localStorage.removeItem('vertrag_metallurgie');

    }



    // Refresh activity list

    const activityList = document.querySelector('.activity-list');

    if (activityList) {

        addActivityItem(activityList);

    }

    

    showNotification('Aktivität gelöscht!', 'success');

}



// Show analytics page

function showAnalytik() {

    const mainContent = document.querySelector('.dashboard-main');

    mainContent.innerHTML = `

        <div class="analytik-container">

            <h1 class="page-title">Analytik</h1>

            <p>Analytics-Seite in Entwicklung...</p>

        </div>

    `;

    

    // Re-setup navigation after content change

    setupNavigation();

}



// Save admin name

function saveAdminName() {

    const nameInput = document.getElementById('admin-name');

    const adminName = nameInput.value.trim();

    

    if (adminName) {

        localStorage.setItem('adminName', adminName);

        

        // Add member with "One for All" role

        const memberList = loadMemberList();

        if (!memberList.some(m => m.name === adminName)) {

            memberList.push({ name: adminName });

            saveMemberList(memberList);

        }

        

        // Save role as "One for All"

        saveMemberRole(adminName, 'One for All');

        

        showNotification(`Name "${adminName}" als "One for All" gespeichert!`, 'success');

    } else {

        showNotification('Bitte gib einen Namen ein!', 'error');

    }

}



// Show register page

function showRegister() {

    const mainContent = document.querySelector('.dashboard-main');

    const isLoggedIn = checkAdminAccess();

    

    mainContent.innerHTML = `

        <div class="register-container">

            <h1 class="page-title">Register</h1>

            <div class="register-section">

                ${isLoggedIn ? 

                    `<div class="register-logged-in">

                        <span class="register-status">✅ Eingeloggt als Admin</span>

                        <button class="register-logout-btn" onclick="adminLogout()">Ausloggen</button>

                    </div>` :

                    `<div class="register-form">

                        <div class="register-inputs">

                            <input type="text" id="register-firstname" class="register-input" placeholder="Name">

                            <input type="text" id="register-lastname" class="register-input" placeholder="Nachname">

                            <input type="password" id="register-password" class="register-input" placeholder="Password">

                        </div>

                        <button class="register-btn" onclick="adminLogin()">Register</button>

                    </div>`

                }

            </div>

        </div>

    `;

    

    // Re-setup navigation after content change

    setupNavigation();

}



// Show login page

function showLogin() {

    const mainContent = document.querySelector('.dashboard-main');

    const isLoggedIn = checkAdminAccess();

    

    mainContent.innerHTML = `

        <div class="login-container">

            <h1 class="page-title">Login</h1>

            <div class="login-section">

                ${isLoggedIn ? 

                    `<div class="login-logged-in">

                        <span class="login-status">✅ Eingeloggt als Admin</span>

                        <button class="login-logout-btn" onclick="adminLogout()">Ausloggen</button>

                    </div>` :

                    `<div class="login-form">

                        <input type="password" id="login-password" class="login-input" placeholder="Passwort">

                        <button class="login-btn" onclick="adminLogin()">Login</button>

                    </div>`

                }

            </div>

        </div>

    `;

    

    // Re-setup navigation after content change

    setupNavigation();

}



// Show settings page

function showEinstellungen() {

    const mainContent = document.querySelector('.dashboard-main');

    const isAdmin = checkAdminAccess();

    const savedName = localStorage.getItem('adminName') || '';

    const userRegistration = JSON.parse(localStorage.getItem('userRegistration') || '{}');

    

    mainContent.innerHTML = `

        <div class="admin-container">

            <h1 class="page-title">Admin</h1>

            <div class="admin-section">

                ${isAdmin ? 

                    `<div class="admin-logged-in">

                        <span class="admin-status">✅ Erfolgreich</span>

                        <div class="admin-info">

                            <input type="text" id="admin-name" class="admin-name-input" placeholder="Dein Name" value="${savedName}">

                        </div>

                        <button class="admin-logout-btn" onclick="adminLogout()">Ausloggen</button>

                        

                        <div style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid var(--border-color);">

                            <h3 style="color: var(--text-primary); margin-bottom: 1rem;">Registrierungs-Verwaltung</h3>

                            ${userRegistration.name ? `

                                <p style="color: var(--text-secondary); margin-bottom: 1rem;">

                                    Aktuell registriert: <strong>${userRegistration.fullName}</strong> (ID: ${userRegistration.id})

                                </p>

                                <button class="admin-logout-btn" onclick="resetRegistration()">Registrierung zurücksetzen</button>

                            ` : '<p style="color: var(--text-secondary);">Keine Registrierung gefunden</p>'}

                        </div>

                    </div>` :

                    `<div class="admin-login-form">

                        <input type="password" id="admin-password" class="admin-input" placeholder="Passwort">

                        <button class="admin-login-btn" onclick="adminLogin()">Login</button>

                    </div>`

                }

            </div>

        </div>

    `;

    

    // Re-setup navigation after content change

    setupNavigation();

}



// Reset registration (admin only)

function resetRegistration() {

    if (!checkAdminAccess()) {

        showNotification('Nur Admins können die Registrierung zurücksetzen!', 'error');

        return;

    }

    

    if (confirm('Möchtest du die Registrierung wirklich zurücksetzen? Der Benutzer muss sich neu registrieren.')) {

        localStorage.removeItem('userRegistered');

        localStorage.removeItem('userRegistration');

        showNotification('Registrierung wurde zurückgesetzt!', 'success');

        

        // Reload page to show registration overlay

        setTimeout(() => {

            location.reload();

        }, 1000);

    }

}



// Generate report functionality

function generateReport() {

    showNotification('Bericht wird erstellt...', 'info');

    

    setTimeout(() => {

        showNotification('Bericht erfolgreich erstellt!', 'success');

    }, 2000);

}



// Export data functionality

function exportData() {

    showNotification('Daten-Export wird vorbereitet...', 'info');

    

    setTimeout(() => {

        // Create a simple CSV export

        const data = [

            ['Metrik', 'Wert', 'Änderung'],

            ['Umsatz', '', ''],

            ['Aktive Benutzer', '', ''],

            ['Wachstumsrate', '', ''],

            ['Leistung', '', '']

        ];

        

        const csv = data.map(row => row.join(',')).join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });

        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');

        a.href = url;

        a.download = 'dashboard_data.csv';

        a.click();

        

        showNotification('Daten erfolgreich exportiert!', 'success');

    }, 1500);

}



// Open user management (placeholder)

function openUserManagement() {

    showNotification('Benutzerverwaltung wird geöffnet...', 'info');

}



// Open settings (placeholder)

function openSettings() {

    showNotification('Systemeinstellungen werden geöffnet...', 'info');

}



// Show notification

function showNotification(message, type = 'info') {

    // Remove existing notifications

    const existingNotification = document.querySelector('.notification');

    if (existingNotification) {

        existingNotification.remove();

    }

    

    // Create notification element

    const notification = document.createElement('div');

    notification.className = `notification ${type}`;

    notification.textContent = message;

    

    // Add styles

    notification.style.cssText = `

        position: fixed;

        top: 20px;

        right: 20px;

        padding: 1rem 1.5rem;

        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#f59e0b'};

        color: white;

        border-radius: 8px;

        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);

        z-index: 1000;

        opacity: 0;

        transform: translateX(100%);

        transition: all 0.3s ease;

    `;

    

    document.body.appendChild(notification);

    

    // Animate in

    setTimeout(() => {

        notification.style.opacity = '1';

        notification.style.transform = 'translateX(0)';

    }, 100);

    

    // Remove after 3 seconds

    setTimeout(() => {

        notification.style.opacity = '0';

        notification.style.transform = 'translateX(100%)';

        setTimeout(() => notification.remove(), 300);

    }, 3000);

}



// Add keyboard shortcuts

document.addEventListener('keydown', function(e) {

    // Strg/Cmd + R für Bericht erstellen

    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {

        e.preventDefault();

        generateReport();

    }

    

    // Strg/Cmd + E für Daten exportieren

    if ((e.ctrlKey || e.metaKey) && e.key === 'e') {

        e.preventDefault();

        exportData();

    }

    

    // Escape to close notifications

    if (e.key === 'Escape') {

        const notification = document.querySelector('.notification');

        if (notification) {

            notification.remove();

        }

    }

});

