document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    const sectionTitle = document.getElementById('section-title');
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const mainContent = document.querySelector('.main-content');

    const sectionTitles = {
        about: "Обо мне",
        modules: "Мои Модули",
        utils: "Утилиты и Всячина",
        terminal: "Интерактивный Терминал"
    };

    // --- Sidebar Toggle ---
    if (sidebarToggle && sidebar) {
        // Determine initial state based on screen width
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
            sidebar.classList.add('collapsed-mobile'); // Custom class for mobile specific collapse logic
            sidebar.classList.remove('open'); // Ensure it's not open by default
        } else {
            // For desktop, you might want it open by default or remember last state
            // For now, let's keep it open on desktop unless explicitly collapsed
        }


        sidebarToggle.addEventListener('click', () => {
            if (window.innerWidth <= 768) { // Mobile behavior: slide in/out
                 sidebar.classList.toggle('open');
                 sidebarToggle.classList.toggle('open');
            } else { // Desktop behavior: collapse/expand
                sidebar.classList.toggle('collapsed');
                sidebarToggle.classList.toggle('open'); // For X icon
            }
        });
    }
     // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (event) => {
        if (window.innerWidth <= 768 && sidebar.classList.contains('open')) {
            if (!sidebar.contains(event.target) && !sidebarToggle.contains(event.target)) {
                sidebar.classList.remove('open');
                sidebarToggle.classList.remove('open');
            }
        }
    });


    // --- Section Navigation ---
    function setActiveSection(sectionId) {
        contentSections.forEach(section => {
            section.classList.remove('active');
            if (section.id === sectionId) {
                section.classList.add('active');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.section === sectionId) {
                link.classList.add('active');
            }
        });

        sectionTitle.textContent = sectionTitles[sectionId] || "JxTech";
        sectionTitle.classList.remove('animated-gradient-text'); // Remove class
        void sectionTitle.offsetWidth; // Trigger reflow
        sectionTitle.classList.add('animated-gradient-text'); // Re-add class to restart animation
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.dataset.section;
            setActiveSection(sectionId);
            window.location.hash = sectionId; // Update URL hash

            // Close sidebar on mobile after navigation
            if (window.innerWidth <= 768 && sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
                sidebarToggle.classList.remove('open');
            }
        });
    });

    // --- Activate section based on URL hash on page load ---
    const currentHash = window.location.hash.substring(1);
    if (currentHash && sectionTitles[currentHash]) {
        setActiveSection(currentHash);
    } else {
        setActiveSection('about'); // Default section
    }
    
    // --- Update Current Year ---
    document.getElementById('currentYearSidebar').textContent = new Date().getFullYear();
    document.getElementById('currentYearMain').textContent = new Date().getFullYear();

    // --- Basic Terminal Logic ---
    const terminalInput = document.getElementById('terminalInput');
    const terminalOutput = document.getElementById('terminalOutput');

    if (terminalInput && terminalOutput) {
        terminalInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const command = this.value.trim();
                if (command) {
                    appendOutput(`user@jxtech:~$ ${command}`, 'command');
                    processCommand(command);
                    this.value = '';
                }
            }
        });
    }

    function appendOutput(message, type = 'message') {
        const line = document.createElement('div');
        line.textContent = message;
        if (type === 'error') line.classList.add('error');
        if (type === 'command') line.classList.add('command');
        terminalOutput.appendChild(line);
        terminalOutput.scrollTop = terminalOutput.scrollHeight; // Scroll to bottom
    }

    function processCommand(command) {
        const args = command.toLowerCase().split(' ');
        const cmd = args[0];

        switch(cmd) {
            case 'help':
                appendOutput("Доступные команды:");
                appendOutput("  help          - Показать это сообщение");
                appendOutput("  date          - Показать текущую дату и время");
                appendOutput("  whoami        - Информация о создателе");
                appendOutput("  modules       - Перейти в раздел модулей");
                appendOutput("  about         - Перейти в раздел 'Обо мне'");
                appendOutput("  utils         - Перейти в раздел утилит");
                appendOutput("  clear         - Очистить терминал");
                appendOutput("  contact       - Контактная информация");
                appendOutput("  ping <адрес>  - (Имитация) пинг");
                break;
            case 'date':
                appendOutput(new Date().toLocaleString());
                break;
            case 'whoami':
                appendOutput("Я JelikTon, разработчик этого сайта и проектов JxTech.");
                appendOutput("Подробнее в разделе 'Обо мне'.");
                break;
            case 'modules':
                setActiveSection('modules');
                appendOutput("Переход в раздел 'Модули'...");
                break;
            case 'about':
                setActiveSection('about');
                appendOutput("Переход в раздел 'Обо мне'...");
                break;
            case 'utils':
                setActiveSection('utils');
                appendOutput("Переход в раздел 'Утилиты'...");
                break;
            case 'clear':
                terminalOutput.innerHTML = '';
                break;
            case 'contact':
                appendOutput("Telegram: @jeliktontech (https://t.me/jeliktontech)");
                appendOutput("TikTok: @jeliktonxd");
                appendOutput("YouTube: @JeliktonTech");
                break;
            case 'ping':
                if (args.length > 1) {
                    const address = args.slice(1).join(' ');
                    appendOutput(`Pinging ${address} with 32 bytes of data:`);
                    for(let i=0; i<4; i++){
                        setTimeout(() => {
                             appendOutput(`Reply from ${address}: bytes=32 time=${Math.floor(Math.random()*20)+5}ms TTL=${Math.floor(Math.random()*50)+50}`);
                        }, i * 700);
                    }
                } else {
                    appendOutput("Использование: ping <адрес>", 'error');
                }
                break;
            default:
                appendOutput(`Команда не найдена: ${command}. Введите 'help' для списка команд.`, 'error');
        }
    }

    // Handle window resize for sidebar behavior
    window.addEventListener('resize', () => {
        const isMobileNow = window.innerWidth <= 768;
        if (isMobileNow) {
            if (!sidebar.classList.contains('open')) { // If sidebar is not actively open on mobile
                 // it should be visually collapsed (off-screen)
            }
        } else {
            // Desktop: remove mobile-specific classes if they were added
            sidebar.classList.remove('open'); // Ensure 'open' for mobile slide-in is off
            // If it was collapsed on desktop, keep it collapsed. If not, it remains expanded.
            // The .collapsed class handles desktop collapse.
        }
    });

});