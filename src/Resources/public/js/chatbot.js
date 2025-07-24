document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('chatbot-button');

    if (button) {
        button.addEventListener('click', () => {
            let chatWindow = document.getElementById('chatbot-window');

            if (!chatWindow) {
                createChatWindow();
            } else {
                toggleChatWindow(chatWindow);
            }
        });
    }

    function createChatWindow() {
        const chatWindow = document.createElement('div');
        chatWindow.id = 'chatbot-window';
        chatWindow.style.cssText = `
            position: fixed;
            bottom: 90px;
            right: 20px;
            width: 350px;
            height: 500px;
            background: #ffffff;
            border: none;
            border-radius: 15px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
            z-index: 9999;
            display: flex;
            flex-direction: column;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            opacity: 0;
            transform: translateY(20px) scale(0.95);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            overflow: hidden;
        `;

        chatWindow.innerHTML = `
            <div id="chatbot-header" style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 16px 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-top-left-radius: 15px;
                border-top-right-radius: 15px;
            ">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="
                        width: 8px;
                        height: 8px;
                        background: #4ade80;
                        border-radius: 50%;
                        animation: pulse 2s infinite;
                    "></div>
                    <span style="font-weight: 600; font-size: 16px;">AI Assistant</span>
                </div>
                <button id="chatbot-close" style="
                    background: none;
                    border: none;
                    color: white;
                    font-size: 18px;
                    cursor: pointer;
                    padding: 4px;
                    border-radius: 4px;
                    transition: background-color 0.2s;
                " onmouseover="this.style.backgroundColor='rgba(255,255,255,0.1)'" 
                   onmouseout="this.style.backgroundColor='transparent'">×</button>
            </div>
            <div id="chatbot-conversation" style="
                flex: 1;
                padding: 20px;
                overflow-y: auto;
                background: #f8fafc;
                scrollbar-width: thin;
                scrollbar-color: #cbd5e1 #f1f5f9;
            "></div>
            <div id="chatbot-loading" style="
                display: none;
                padding: 10px 20px;
                text-align: center;
                color: #64748b;
                font-size: 14px;
                background: #f8fafc;
                border-top: 1px solid #e2e8f0;
            ">
                <div style="display: inline-flex; align-items: center; gap: 8px;">
                    <div style="
                        width: 6px;
                        height: 6px;
                        background: #64748b;
                        border-radius: 50%;
                        animation: typing 1.4s infinite ease-in-out;
                    "></div>
                    <div style="
                        width: 6px;
                        height: 6px;
                        background: #64748b;
                        border-radius: 50%;
                        animation: typing 1.4s infinite ease-in-out 0.2s;
                    "></div>
                    <div style="
                        width: 6px;
                        height: 6px;
                        background: #64748b;
                        border-radius: 50%;
                        animation: typing 1.4s infinite ease-in-out 0.4s;
                    "></div>
                    <span style="margin-left: 8px;">Typing...</span>
                </div>
            </div>
        `;

        // Add CSS animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }
            @keyframes typing {
                0%, 60%, 100% { transform: translateY(0); }
                30% { transform: translateY(-10px); }
            }
            @keyframes slideInUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .message-animation { animation: slideInUp 0.3s ease-out; }
            #chatbot-conversation::-webkit-scrollbar { width: 6px; }
            #chatbot-conversation::-webkit-scrollbar-track { background: #f1f5f9; }
            #chatbot-conversation::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
            #chatbot-conversation::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

            .message-animation.chatbot-info {
                margin-bottom:10px;
            }

           .question-input-container {
                background: white;
                border: 2px solid #e5e7eb;
                border-radius: 12px;
                padding: 16px;
                margin: 12px 0;
                transition: border-color 0.2s ease;
            }
            .question-input-container:focus-within {
                border-color: #667eea;
                box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
            }
            .question-textarea {
                width: 100%;
                border: none;
                outline: none;
                resize: vertical;
                min-height: 60px;
                font-size: 14px;
                font-family: inherit;
                color: #374151;
                background: transparent;
            }
            .question-textarea::placeholder {
                color: #9ca3af;
            }
            .submit-question-btn {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                margin-top: 10px;
                transition: all 0.2s ease;
                width: 100%;
            }
            .submit-question-btn:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
            }
            .submit-question-btn:active {
                transform: translateY(0);
            }
            .submit-question-btn:disabled {
                opacity: 0.6;
                cursor: not-allowed;
                transform: none;
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(chatWindow);

        // Animate window appearance
        setTimeout(() => {
            chatWindow.style.opacity = '1';
            chatWindow.style.transform = 'translateY(0) scale(1)';
        }, 10);

        // Setup event listeners
        setupEventListeners(chatWindow);
        initializeChatbot();
    }

    function setupEventListeners(chatWindow) {
        const closeButton = document.getElementById('chatbot-close');
        closeButton.addEventListener('click', () => {
            closeChatWindow(chatWindow);
        });
    }

    function toggleChatWindow(chatWindow) {
        if (chatWindow.style.opacity === '1') {
            closeChatWindow(chatWindow);
        } else {
            chatWindow.style.opacity = '1';
            chatWindow.style.transform = 'translateY(0) scale(1)';
        }
    }

    function closeChatWindow(chatWindow) {
        chatWindow.style.opacity = '0';
        chatWindow.style.transform = 'translateY(20px) scale(0.95)';
        setTimeout(() => {
            if (chatWindow.parentNode) {
                chatWindow.remove();
            }
        }, 300);
    }

    function showLoading(show = true) {
        const loading = document.getElementById('chatbot-loading');
        if (loading) {
            loading.style.display = show ? 'block' : 'none';
        }
    }

    function addMessage(content, isUser = false, animate = true) {
        const conversation = document.getElementById('chatbot-conversation');
        if (!conversation) return;

        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            margin-bottom: 16px;
            text-align: ${isUser ? 'right' : 'left'};
            ${animate ? 'opacity: 0;' : ''}
        `;

        const messageBubble = document.createElement('div');
        messageBubble.style.cssText = `
            display: inline-block;
            max-width: 85%;
            padding: 12px 16px;
            border-radius: 18px;
            font-size: 14px;
            line-height: 1.4;
            word-wrap: break-word;
            ${isUser
            ? 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;'
            : 'background: white; color: #374151; border: 1px solid #e5e7eb; box-shadow: 0 1px 3px rgba(0,0,0,0.1);'
        }
        `;
        messageBubble.innerHTML = content;
        messageDiv.appendChild(messageBubble);
        conversation.appendChild(messageDiv);
        if (animate) {
            setTimeout(() => {
                messageDiv.style.opacity = '1';
                messageDiv.classList.add('message-animation');
            }, 50);
        }

        scrollToBottom();
    }

    function addInteractiveButtons(buttons, callback) {
        const conversation = document.getElementById('chatbot-conversation');
        if (!conversation) return;

        const buttonsContainer = document.createElement('div');
        buttonsContainer.style.cssText = `
            margin-bottom: 16px;
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
        `;

        buttons.forEach(button => {
            const btn = document.createElement('button');
            btn.textContent = button.text;
            btn.style.cssText = `
                display: block;
                width: 100%;
                background: white;
                border: 2px solid #e5e7eb;
                margin: 8px 0;
                padding: 12px 16px;
                text-align: left;
                border-radius: 12px;
                cursor: pointer;
                font-size: 14px;
                color: #374151;
                transition: all 0.2s ease;
                position: relative;
                overflow: hidden;
            `;

            btn.addEventListener('mouseenter', () => {
                btn.style.borderColor = '#667eea';
                btn.style.backgroundColor = '#f8faff';
                btn.style.transform = 'translateY(-1px)';
                btn.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.15)';
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.borderColor = '#e5e7eb';
                btn.style.backgroundColor = 'white';
                btn.style.transform = 'translateY(0)';
                btn.style.boxShadow = 'none';
            });

            btn.addEventListener('click', () => {
                callback(button);
                // Add click effect
                btn.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    btn.style.transform = 'scale(1)';
                }, 100);
            });

            buttonsContainer.appendChild(btn);
        });

        conversation.appendChild(buttonsContainer);

        setTimeout(() => {
            buttonsContainer.style.opacity = '1';
            buttonsContainer.classList.add('message-animation');
        }, 100);

        scrollToBottom();
    }

    function addQuestionInput() {
        const conversation = document.getElementById('chatbot-conversation');
        if (!conversation) return;

        const inputContainer = document.createElement('div');
        inputContainer.style.cssText = `
            margin-bottom: 16px;
            opacity: 0;
        `;

        inputContainer.innerHTML = `
            <div class="question-input-container">
                <textarea 
                    class="question-textarea" 
                    placeholder="Type your question here..."
                    maxlength="500"
                ></textarea>
                <button class="submit-question-btn" type="button">
                    Submit Question
                </button>
            </div>
        `;

        const textarea = inputContainer.querySelector('.question-textarea');
        const submitBtn = inputContainer.querySelector('.submit-question-btn');

        // Auto-resize textarea
        textarea.addEventListener('input', () => {
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';

            // Enable/disable submit button
            submitBtn.disabled = textarea.value.trim().length === 0;
        });

        // Submit question
        submitBtn.addEventListener('click', () => {
            const question = textarea.value.trim();
            if (question) {
                handleUserQuestion(question);
                inputContainer.remove();
            }
        });

        // Submit on Enter (Ctrl+Enter for new line)
        textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.ctrlKey && !e.shiftKey) {
                e.preventDefault();
                if (textarea.value.trim()) {
                    submitBtn.click();
                }
            }
        });

        conversation.appendChild(inputContainer);

        setTimeout(() => {
            inputContainer.style.opacity = '1';
            inputContainer.classList.add('message-animation');
            textarea.focus();
        }, 100);

        scrollToBottom();
    }

    async function handleUserQuestion(question) {
        // Show user's question
        addMessage(question, true);

        try {
            // showLoading(true);
            // Submit question to server
            const response = await fetch('/chatbot/submit-user-question', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({ question: question })
            });

            // showLoading(false);

            if (response.ok) {
                addMessage(`
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                        <span style="font-size: 16px;">✅</span>
                        <strong>Thank you for your question!</strong>
                    </div>
                    <div>We've received your question and our team will review it. We'll try to provide an answer as soon as possible and add it to our FAQ section.</div>
                `);
            } else {
                throw new Error('Failed to submit question');
            }
        } catch (error) {
            showLoading(false);
            showError("Sorry, we couldn't submit your question. Please try again later.");
        }
    }

    function scrollToBottom() {
        const conversation = document.getElementById('chatbot-conversation');
        if (conversation) {
            conversation.scrollTop = conversation.scrollHeight;
        }
    }

    function showError(message) {
        addMessage(`
            <div style="display: flex; align-items: center; gap: 8px; color: #dc2626;">
                <span style="font-size: 16px;">⚠️</span>
                <span>${message}</span>
            </div>
        `);
    }

    async function fetchWithErrorHandling(url) {
        try {
            showLoading(true);
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            showLoading(false);
            return data;
        } catch (error) {
            showLoading(false);
            console.error('Fetch error:', error);
            throw error;
        }
    }

    function initializeChatbot() {
        // Welcome message with delay for better UX
        setTimeout(() => {
            addMessage(`
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                    <span style="font-size: 20px;">👋</span>
                    <strong>Hello! I'm here to help</strong>
                </div>
                <div>Please choose a category to get started, or ask your own question:</div>
            `);

            loadCategories();
        }, 500);
    }

    async function loadCategories() {
        try {
            const categories = await fetchWithErrorHandling('/chatbot/categories');

            if (!categories || categories.length === 0) {
                showError("No categories available at the moment.");
                return;
            }

            const categoryButtons = categories.map(category => ({
                text: category.name,
                id: category.id,
                type: 'category'
            }));

            if (isUserLoggedIn) {
                categoryButtons.push({
                    text: "❓ Ask your own question",
                    type: 'ask_question'
                });
            }

            addInteractiveButtons(categoryButtons, handleCategorySelection);

        } catch (error) {
            showError("Sorry, I couldn't load the categories. Please try again later.");
        }
    }

    function showInfoMessage(message) {
        const chatArea = document.getElementById('chatbot-conversation');
        if (chatArea) {
            const infoDiv = document.createElement('div');
            infoDiv.className = 'message-animation chatbot-info';
            infoDiv.textContent = message;
            chatArea.appendChild(infoDiv);
        }
    }

    function handleCategorySelection(category) {
        // Show user selection
        addMessage(category.text, true);

        if (category.type === 'ask_question') {
            // Show question input
            setTimeout(() => {
                addMessage("Please type your question below:");
                addQuestionInput();
            }, 300);
        } else {
            // Show loading and then load FAQs
            setTimeout(() => {
                loadFaqs(category.id, category.text);
            }, 300);
        }
    }

    async function loadFaqs(categoryId, categoryName) {
        try {
            addMessage(`Great! Here are the frequently asked questions for <strong>${categoryName}</strong>:`);

            const faqs = await fetchWithErrorHandling(`/chatbot/faqs/${categoryId}`);

            if (!faqs || faqs.length === 0) {
                addMessage("No FAQs available for this category at the moment.");
                addBackToCategories();
                return;
            }

            const faqButtons = faqs.map(faq => ({
                text: faq.question,
                id: faq.id,
                answer: faq.answer,
                type: 'faq'
            }));

            addInteractiveButtons(faqButtons, handleFaqSelection);
            addBackToCategories();

        } catch (error) {
            showError("Sorry, I couldn't load the FAQs for this category. Please try again.");
            addBackToCategories();
        }
    }

    function handleFaqSelection(faq) {
        // Show user selection
        addMessage(faq.text, true);

        // Show answer with delay
        setTimeout(() => {
            addMessage(faq.answer);

            // Add helpful actions after answer
            setTimeout(() => {
                const actionButtons = [
                    { text: "🔙 Back to categories", type: 'back_to_categories' }
                ];

                if (isUserLoggedIn) {
                    actionButtons.push({ text: "❓ Ask your own question", type: 'ask_question' });
                }else{
                    showInfoMessage("🔒 Please login to ask your own question");
                }

                addInteractiveButtons(actionButtons, (action) => {
                    if (action.type === 'back_to_categories') {
                        resetChatbot();
                    } else if (action.type === 'ask_question') {
                        addMessage("Please type your question below:", false);
                        addQuestionInput();
                    }
                });
            }, 800);
        }, 500);
    }

    function addBackToCategories() {
        const backButtons = [
            { text: "🔙 Back to categories", type: 'back_to_categories' }
        ];

        if (isUserLoggedIn) {
            backButtons.push({ text: "❓ Ask your own question", type: 'ask_question' });
        }else{
            showInfoMessage("🔒 Please login to ask your own question");
        }

        addInteractiveButtons(backButtons, (action) => {
            if (action.type === 'back_to_categories') {
                resetChatbot();
            } else if (action.type === 'ask_question') {
                addMessage("Please type your question below:", false);
                addQuestionInput();
            }
        });
    }

    function resetChatbot() {
        const conversation = document.getElementById('chatbot-conversation');
        if (conversation) {
            // Clear conversation with fade effect
            conversation.style.opacity = '0.5';

            setTimeout(() => {
                conversation.innerHTML = '';
                conversation.style.opacity = '1';
                initializeChatbot();
            }, 200);
        }
    }

    // Handle mobile responsiveness
    function handleMobileView() {
        const chatWindow = document.getElementById('chatbot-window');
        if (!chatWindow) return;

        if (window.innerWidth <= 480) {
            chatWindow.style.cssText += `
                width: calc(100vw - 20px);
                height: calc(100vh - 120px);
                right: 10px;
                left: 10px;
                bottom: 10px;
            `;
        }
    }

    window.addEventListener('resize', handleMobileView);
});