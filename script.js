document.addEventListener('DOMContentLoaded', () => {
    
    // --- TABS LOGIC ---
    const btns = document.querySelectorAll('.tab-btn');
    const pages = document.querySelectorAll('.page');

    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            btns.forEach(b => b.classList.remove('active'));
            pages.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            const target = btn.getAttribute('data-tab');
            document.getElementById(target).classList.add('active');
        });
    });

    // --- TERMINAL LOGIC ---
    const termContainer = document.getElementById('terminalContainer');
    const termInput = document.getElementById('termInput');
    const termOut = document.getElementById('termOutput');
    const date = new Date().toLocaleString();

    // Focus input when clicking anywhere in terminal
    termContainer.addEventListener('click', () => {
        termInput.focus();
    });

    // Boot Sequence
    const bootLines = [
        "Initializing JxOS Kernel v4.2...",
        "Mounting file system... [OK]",
        "Loading modules: JxBooster, JxZapret... [OK]",
        `System ready. Logged in as user at ${date}`,
        "Type <span class='t-purple'>'help'</span> for commands."
    ];

    let delay = 0;
    bootLines.forEach(line => {
        setTimeout(() => printLine(line, 't-gray'), delay);
        delay += 300;
    });

    // Commands
    const commands = {
        help: () => `
<span class='t-blue'>Available Commands:</span>
  <span class='t-green'>neofetch</span>   - Show system info
  <span class='t-green'>ls</span>         - List files
  <span class='t-green'>whoami</span>     - Current user
  <span class='t-green'>date</span>       - Show time
  <span class='t-green'>clear</span>      - Clear screen
  <span class='t-green'>hack</span>       - Simulate breach`,
        
        whoami: () => "uid=0(root) gid=0(root) groups=0(root) // JelikTon",
        
        date: () => new Date().toString(),
        
        ls: () => "<span class='t-blue'>JxBooster_v3.1X.zip</span>  <span class='t-blue'>JxZapret_v1.1X.zip</span>  <span class='t-gray'>secrets.txt</span>",
        
        neofetch: () => `
<div style="display:flex; gap:20px; align-items:center;">
<pre class="t-ascii">
   .       .
   |\\     /|
   | \\   / |
   |  \\ /  |   JxTech OS
   |   |   |   ---------
   |   |   |
   |_______|
</pre>
<div style="font-size:0.9rem">
  <span class="t-purple">Host:</span> MacBook Pro 2011<br>
  <span class="t-purple">Kernel:</span> Android 14 (Custom)<br>
  <span class="t-purple">Uptime:</span> 999 days<br>
  <span class="t-purple">Packages:</span> 300+ flashed<br>
  <span class="t-purple">Shell:</span> bash 5.1
</div>
</div>`,

        hack: () => {
            setTimeout(() => printLine("Scanning ports...", "t-green"), 200);
            setTimeout(() => printLine("Bypassing firewall...", "t-green"), 800);
            setTimeout(() => printLine("Accessing Mainframe...", "t-green"), 1500);
            setTimeout(() => printLine("ACCESS GRANTED. Downloading RAM...", "t-green"), 2400);
            return "Initializing attack vector...";
        },

        clear: () => {
            termOut.innerHTML = "";
            return null;
        }
    };

    termInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const input = termInput.value.trim();
            if(!input) return;

            // Print Command
            printLine(`<span class='prompt'>➜ ~</span> <span class='t-cmd'>${input}</span>`);

            // Process
            const cmd = input.toLowerCase();
            if (commands[cmd]) {
                const result = commands[cmd]();
                if (result) printLine(result);
            } else {
                printLine(`bash: command not found: ${input}`, 't-red');
            }

            termInput.value = '';
            scrollToBottom();
        }
    });

    function printLine(html, cssClass = '') {
        const div = document.createElement('div');
        div.className = cssClass;
        div.innerHTML = html;
        termOut.appendChild(div);
        scrollToBottom();
    }

    function scrollToBottom() {
        setTimeout(() => {
            termOut.scrollTop = termOut.scrollHeight;
        }, 10);
    }
});